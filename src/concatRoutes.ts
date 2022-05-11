import { parsePath } from "history";
import { RouteObject } from "./types";

export const addPrefixOnNonEmpty = (value: string, prefix: string) =>
  value === "" ? value : prefix + value;

export const ensureSlashPrefix = (value: string): string =>
  value[0] === "/" ? value : `/${value}`;

export const extractRoute = (route: string): RouteObject => {
  const { pathname: path = "", search = "", hash = "" } = parsePath(route);
  return { path, search, hash };
};

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

  const search = routeA["search"] + addPrefixOnNonEmpty(routeB["search"], "&");
  const hash = routeB["hash"] === "" ? routeA["hash"] : routeB["hash"];

  return (
    path + addPrefixOnNonEmpty(search, "?") + addPrefixOnNonEmpty(hash, "#")
  );
};
