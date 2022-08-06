import { parsePath } from "history";
import { RouteObject } from "./types";

export const ensurePrefix = (value: string, prefix: string): string =>
  value[0] === prefix ? value : prefix + value;

export const ensurePrefixOnNonEmpty = (value: string, prefix: string) =>
  value === "" ? value : ensurePrefix(value, prefix);

export const extractRoute = (route: string): RouteObject => {
  const { pathname: path = "", search = "", hash = "" } = parsePath(route);
  return { path, search: search.substring(1), hash: hash.substring(1) };
};

export const concatRoutes = (
  routeA: RouteObject,
  routeB: RouteObject,
): string => {
  const fixedPathA = ensurePrefix(routeA["path"], "/");
  const fixedPathB = ensurePrefix(routeB["path"], "/");

  const path =
    fixedPathA === "/"
      ? fixedPathB
      : fixedPathB === "/"
      ? fixedPathA
      : fixedPathA + fixedPathB;

  const search =
    routeA["search"] === ""
      ? routeB["search"]
      : routeA["search"] + ensurePrefixOnNonEmpty(routeB["search"], "&");

  const hash = routeB["hash"] === "" ? routeA["hash"] : routeB["hash"];

  return (
    path +
    ensurePrefixOnNonEmpty(search, "?") +
    ensurePrefixOnNonEmpty(hash, "#")
  );
};
