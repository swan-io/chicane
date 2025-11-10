import {
  extractParamNameUnion,
  getRouteKey,
  isNonEmpty,
  isParam,
} from "./helpers";
import { parseRoute } from "./history";
import { encodeSearch } from "./search";
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
    const params = new URLSearchParams(parsed.search);

    for (const [key] of params) {
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

export const getMatchResult = (
  location: Location,
  matcher: Matcher,
): { key: string; name: string; params: Params } | undefined => {
  if (
    (!matcher.isArea && location.path.length !== matcher.path.length) ||
    (matcher.isArea && location.path.length < matcher.path.length)
  ) {
    return;
  }

  const pathParams: Params = {};
  const searchParams: Params = {};

  for (let index = 0; index < matcher.path.length; index++) {
    const part = location.path[index];
    const test = matcher.path[index];

    if (test == null) {
      continue;
    }

    if (typeof test === "string") {
      if (part === test) {
        continue;
      } else {
        return;
      }
    }

    if (part == null) {
      return;
    }

    const { name, union } = test;

    if (union == null || union.has(part)) {
      pathParams[name] = part;
    } else {
      return;
    }
  }

  for (const key in matcher.search) {
    if (Object.prototype.hasOwnProperty.call(matcher.search, key)) {
      const part = location.search[key];
      const test = matcher.search[key];

      if (part == null || test == null) {
        continue;
      }

      const { multiple, union } = test;
      const parts = typeof part === "string" ? [part] : part;

      const values =
        union == null ? parts : parts.filter((item) => union.has(item));

      if (multiple) {
        searchParams[key] = values;
        continue;
      }

      const value = values[0];

      if (value != null) {
        searchParams[key] = value;
      }
    }
  }

  return {
    key: getRouteKey(matcher.name, pathParams, searchParams),
    name: matcher.name,
    params: { ...pathParams, ...searchParams },
  };
};

export const match = (
  location: Location,
  matchers: Matcher[],
): { key: string; name: string; params: Params } | undefined => {
  for (const matcher of matchers) {
    const result = getMatchResult(location, matcher);

    if (result != null) {
      return result;
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
      const param = params[key];
      const test = matcher.search[key];

      if (param == null || test == null) {
        continue;
      }

      const { union } = test;

      if (typeof param === "string") {
        if (union == null || union.has(param)) {
          object[key] = param;
        }
      } else {
        object[key] =
          union == null ? param : param.filter((item) => union.has(item));
      }
    }

    search = encodeSearch(object);
  }

  return path + search;
};
