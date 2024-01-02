import { extractParamNameUnion, isNonEmpty, isParam } from "./helpers";
import { parseRoute } from "./history";
import { decodeUnprefixedSearch, encodeSearch } from "./search";
import { Location, Matcher, Params, Search } from "./types";

// Kudos to https://reach.tech/router/ranking
const extractFromPath = (path: string) => {
  const parts = path.split("/").filter(isNonEmpty);
  const output: Matcher["path"] = [];

  let ranking = parts.length > 0 ? parts.length * 5 : 6;

  for (const part of parts) {
    if (isParam(part)) {
      const param = extractParamNameUnion(part.substring(1));
      ranking += param.union == null ? 2 : 3;
      output.push(param);
    } else {
      ranking += 4;
      output.push(encodeURIComponent(part));
    }
  }

  return { ranking, path: output };
};

export const getMatcher = (name: string, route: string): Matcher => {
  const parsed = parseRoute(route);
  const isArea = parsed.path.endsWith("/*");

  const { ranking, path } = extractFromPath(
    isArea ? parsed.path.slice(0, -2) : parsed.path,
  );

  const matcher: Matcher = {
    isArea,
    name,
    // penality due to wildcard
    ranking: isArea ? ranking - 1 : ranking,
    path,
    search: undefined,
  };

  if (parsed.search !== "") {
    matcher.search = {};
    const params = decodeUnprefixedSearch(parsed.search);

    for (const key in params) {
      if (isParam(key)) {
        const multiple = key.endsWith("[]");

        const { name, union } = extractParamNameUnion(
          key.substring(1, key.length - (multiple ? 2 : 0)),
        );

        matcher.search[name] =
          union == null ? { multiple } : { multiple, union };
      }
    }
  }

  return matcher;
};

export const extractLocationParams = (
  location: Location,
  matcher: Matcher,
): Params | undefined => {
  const { path: locationPath } = location;
  const { isArea, path: matcherPath } = matcher;

  if (
    (!isArea && locationPath.length !== matcherPath.length) ||
    (isArea && locationPath.length < matcherPath.length)
  ) {
    return;
  }

  const params: Params = {};

  for (let index = 0; index < matcherPath.length; index++) {
    const locationPart = locationPath[index];
    const matcherPart = matcherPath[index];

    if (matcherPart == null) {
      continue;
    }

    if (typeof matcherPart === "string") {
      if (locationPart === matcherPart) {
        continue;
      } else {
        return;
      }
    }

    if (locationPart == null) {
      return;
    }

    const { name, union } = matcherPart;

    if (union == null || union.includes(locationPart)) {
      params[name] = locationPart;
    } else {
      return;
    }
  }

  for (const key in matcher.search) {
    if (Object.prototype.hasOwnProperty.call(matcher.search, key)) {
      const matcherPart = matcher.search[key];
      const locationPart = location.search[key];

      if (matcherPart == null || locationPart == null) {
        continue;
      }

      const { multiple, union } = matcherPart;

      const locationParts =
        typeof locationPart === "string" ? [locationPart] : locationPart;

      const values =
        union == null
          ? locationParts
          : locationParts.filter((item) => union.includes(item));

      if (multiple) {
        params[key] = values;
        continue;
      }

      const value = values[0];

      if (value != null && (union == null || union.includes(value))) {
        params[key] = value;
      }
    }
  }

  return params;
};

export const match = (
  location: Location,
  matchers: Matcher[],
): { name: string; params: Params } | undefined => {
  for (const matcher of matchers) {
    const params = extractLocationParams(location, matcher);

    if (params != null) {
      return { name: matcher.name, params };
    }
  }
};

export const matchToUrl = (matcher: Matcher, params: Params = {}): string => {
  const path =
    "/" +
    matcher.path
      .map((part) =>
        encodeURIComponent(
          typeof part === "string" ? part : String(params[part.name]),
        ),
      )
      .join("/");

  let search = "";

  if (matcher.search != null) {
    const object: Search = {};

    for (const key in params) {
      const matcherPart = matcher.search[key];
      const param = params[key];

      if (matcherPart != null && param != null) {
        const { union } = matcherPart;

        if (typeof param === "string") {
          if (union == null || union.includes(param)) {
            object[key] = param;
          }
        } else {
          object[key] =
            union == null
              ? param
              : param.filter((item) => union.includes(item));
        }
      }
    }

    search = encodeSearch(object);
  }

  return path + search;
};
