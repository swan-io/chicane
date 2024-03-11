import { ensureSlashPrefix } from "./helpers";
import { RouteObject } from "./types";

export const addPrefixOnNonEmpty = (value: string, prefix: string) =>
  value === "" ? value : prefix + value;

export const concatRoutes = (
  routeA: RouteObject,
  routeB: RouteObject,
): string => {
  const fixedPathA = ensureSlashPrefix(routeA["path"]);
  const fixedPathB = ensureSlashPrefix(routeB["path"]);

  const path =
    fixedPathA === "/"
      ? fixedPathB
      : fixedPathB === "/"
        ? fixedPathA
        : fixedPathA + fixedPathB;

  const search =
    routeA["search"] === ""
      ? routeB["search"]
      : routeA["search"] + addPrefixOnNonEmpty(routeB["search"], "&");

  return path + addPrefixOnNonEmpty(search, "?");
};
