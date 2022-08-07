import { parsePath } from "history";
import { trim } from "./helpers";
import { RouteObject } from "./types";

const addPrefixOnNonEmpty = (value: string, prefix: string) =>
  value === "" ? value : prefix + value;

export const extractRoute = (route: string): RouteObject => {
  const { pathname: path = "", search = "", hash = "" } = parsePath(route);
  return { path, search: search.substring(1), hash: hash.substring(1) };
};

export const concatRoutes = (
  routeA: RouteObject,
  routeB: RouteObject,
): string => {
  const fixedPathA = trim(routeA["path"], "/");
  const fixedPathB = trim(routeB["path"], "/");
  const path = "/" + trim(fixedPathA + "/" + fixedPathB, "/");

  const fixedSearchA = trim(routeA["search"], "&");
  const fixedSearchB = trim(routeB["search"], "&");
  const search = trim(fixedSearchA + "&" + fixedSearchB, "&");

  const hash = routeB["hash"] === "" ? routeA["hash"] : routeB["hash"];

  return (
    path + addPrefixOnNonEmpty(search, "?") + addPrefixOnNonEmpty(hash, "#")
  );
};
