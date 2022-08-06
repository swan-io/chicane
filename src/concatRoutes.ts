import { parsePath } from "history";
import { RouteObject } from "./types";

const addPrefixOnNonEmpty = (value: string, prefix: string) =>
  value === "" ? value : prefix + value;

const removePrefixAndSuffix = (value: string, char: string) => {
  const unsuffixed =
    value[value.length - 1] === char ? value.slice(0, -1) : value;
  return unsuffixed[0] === char ? value.slice(1) : unsuffixed;
};

export const extractRoute = (route: string): RouteObject => {
  const { pathname: path = "", search = "", hash = "" } = parsePath(route);
  return { path, search: search.substring(1), hash: hash.substring(1) };
};

export const concatRoutes = (
  routeA: RouteObject,
  routeB: RouteObject,
): string => {
  const fixedPathA = removePrefixAndSuffix(routeA["path"], "/");
  const fixedPathB = removePrefixAndSuffix(routeB["path"], "/");
  const path = "/" + removePrefixAndSuffix(fixedPathA + "/" + fixedPathB, "/");

  const fixedSearchA = removePrefixAndSuffix(routeA["search"], "&");
  const fixedSearchB = removePrefixAndSuffix(routeB["search"], "&");
  const search = removePrefixAndSuffix(fixedSearchA + "&" + fixedSearchB, "&");

  const hash = routeB["hash"] === "" ? routeA["hash"] : routeB["hash"];

  return (
    path + addPrefixOnNonEmpty(search, "?") + addPrefixOnNonEmpty(hash, "#")
  );
};
