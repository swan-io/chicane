import { parsePath, Path as HistoryPath } from "history";
import { isMultipleParam, isNonEmpty, isParam } from "./helpers";
import { encodeSearch } from "./search";
import { Location, Matcher, Params, Search } from "./types";

// Kudos to https://reach.tech/router/ranking
const extractFromPathname = (pathname: string) => {
  const parts = pathname.split("/").filter(isNonEmpty);
  const pathParams: string[] = [];
  const segments: Matcher["segments"] = [];

  let ranking = parts.length > 0 ? parts.length * 4 : 5;

  for (const part of parts) {
    const param = isParam(part);
    const name = param ? part.substring(1) : encodeURIComponent(part);

    param && pathParams.push(name);
    ranking += param ? 2 : 3;
    segments.push({ name, param });
  }

  return { pathParams, ranking, segments };
};

export const getMatcher = (name: string, route: string): Matcher => {
  if (route.endsWith("*")) {
    const { pathname = "/" } = parsePath(route.slice(0, -1));
    const { pathParams, ranking, segments } = extractFromPathname(pathname);

    return {
      finite: false,
      name,
      ranking: ranking - 1, // penality due to wildcard
      pathParams,
      segments,
      search: {},
    };
  } else {
    const { pathname = "/", search = "", hash = "" } = parsePath(route);
    const { pathParams, ranking, segments } = extractFromPathname(pathname);

    const searchMatchers: Matcher["search"] = {};
    const params = new URLSearchParams(search.substring(1));

    for (const [key] of params) {
      if (isMultipleParam(key)) {
        searchMatchers[key.substring(1, key.length - 2)] = "multiple";
      } else if (isParam(key)) {
        searchMatchers[key.substring(1, key.length)] = "unique";
      }
    }

    return {
      finite: true,
      name,
      ranking,
      pathParams,
      segments,
      search: searchMatchers,
      ...(isParam(hash.substring(1)) && {
        hash: hash.substring(2),
      }),
    };
  }
};

export const extractLocationParams = (
  location: Location,
  matcher: Matcher,
): Params | undefined => {
  const { path } = location;
  const { finite, segments } = matcher;

  if (
    (finite && path.length !== segments.length) ||
    (!finite && path.length < segments.length)
  ) {
    return;
  }

  const params: Params = {};

  for (let index = 0; index < segments.length; index++) {
    const part = path[index];
    const segment = segments[index];

    if (segment == null) {
      continue;
    }

    if (segment.param) {
      if (part == null) {
        return;
      } else {
        params[segment.name] = part;
        continue;
      }
    } else {
      if (segment.name === part) {
        continue;
      } else {
        return;
      }
    }
  }

  if (!finite) {
    return params; // don't extract search and hash on non-finite routes
  }

  for (const key in matcher.search) {
    if (Object.prototype.hasOwnProperty.call(matcher.search, key)) {
      const matcherValue = matcher.search[key];
      const locationValue = location.search[key];

      if (matcherValue == null || locationValue == null) {
        continue;
      }

      if (matcherValue === "multiple") {
        params[key] =
          typeof locationValue === "string" ? [locationValue] : locationValue;
        continue;
      }

      if (typeof locationValue === "string") {
        params[key] = locationValue;
      } else if (locationValue[0] != null) {
        params[key] = locationValue[0];
      }
    }
  }

  if (matcher.hash != null && location.hash != null) {
    params[matcher.hash] = location.hash;
  }

  return params;
};

export const matchAll = (
  location: Location,
  matchers: Matcher[],
): { name: string; params: Params }[] => {
  const routes = [];
  for (const matcher of matchers) {
    const params = extractLocationParams(location, matcher);

    if (params != null) {
      routes.push({ name: matcher.name, params });
    }
  }

  return routes;
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

export const matchToHistoryPath = (
  matcher: Matcher,
  params: Params = {},
): HistoryPath => {
  const pathname =
    "/" +
    matcher.segments
      .map(({ name, param }) => {
        const value = params[name];

        return encodeURIComponent(
          param && typeof value === "string" ? value : name,
        );
      })
      .join("/");

  // https://github.com/remix-run/history/issues/859
  let search = "";
  let hash = "";

  if (matcher.search != null) {
    const object: Search = {};

    for (const key in params) {
      const value = params[key];

      if (
        Object.prototype.hasOwnProperty.call(params, key) &&
        Object.prototype.hasOwnProperty.call(matcher.search, key) &&
        value != null
      ) {
        object[key] = value;
      }
    }

    search = encodeSearch(object);
  }

  if (matcher.hash != null) {
    const value = params[matcher.hash];

    if (typeof value === "string") {
      hash = "#" + encodeURIComponent(value);
    }
  }

  return { pathname, search, hash };
};
