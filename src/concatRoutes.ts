import { ensureSlashPrefix } from "./helpers";
import type { RouteObject } from "./types";

export const addPrefixOnNonEmpty = (value: string, prefix: string) =>
  value === "" ? value : prefix + value;

export const concatRoutes = (
  routeA: RouteObject,
  routeB: RouteObject,
): string => {
  const prefixedPathA = ensureSlashPrefix(routeA["path"]);
  const prefixedPathB = ensureSlashPrefix(routeB["path"]);
  const unprefixedSearchA = routeA.search.substring(1);
  const unprefixedSearchB = routeB.search.substring(1);

  const path =
    prefixedPathA === "/"
      ? prefixedPathB
      : prefixedPathB === "/"
        ? prefixedPathA
        : prefixedPathA + prefixedPathB;

  const search =
    unprefixedSearchA === ""
      ? unprefixedSearchB
      : unprefixedSearchA + addPrefixOnNonEmpty(unprefixedSearchB, "&");

  return path + addPrefixOnNonEmpty(search, "?");
};
