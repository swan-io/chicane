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
      ranking += param.values == null ? 2 : 3;
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

        const { name, values } = extractParamNameUnion(
          key.substring(1, key.length - (multiple ? 2 : 0)),
        );

        matcher.search[name] =
          values == null ? { multiple } : { multiple, values };
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

    const { name, values } = matcherPart;

    if (values == null || values.includes(locationPart)) {
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

      const { multiple, values } = matcherPart;

      const locationValues =
        typeof locationPart === "string" ? [locationPart] : locationPart;

      const multipleValues =
        values == null
          ? locationValues
          : locationValues.filter((item) => values.includes(item));

      if (multiple) {
        params[key] = multipleValues;
        continue;
      }

      const uniqueValue = multipleValues[0];

      if (
        uniqueValue != null &&
        (values == null || values.includes(uniqueValue))
      ) {
        params[key] = uniqueValue;
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
        const { values } = matcherPart;

        if (typeof param === "string") {
          if (values == null || values.includes(param)) {
            object[key] = param;
          }
        } else {
          object[key] =
            values == null
              ? param
              : param.filter((item) => values.includes(item));
        }
      }
    }

    search = encodeSearch(object);
  }

  return path + search;
};
