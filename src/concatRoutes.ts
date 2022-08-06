import { parsePath } from "history";
import { RouteObject } from "./types";

const addPrefixOnNonEmpty = (value: string, prefix: string) =>
  value === "" ? value : prefix + value;

const trimOnce = (value: string, char: string) => {
  const output = value[value.length - 1] === char ? value.slice(0, -1) : value;
  return output[0] === char ? value.slice(1) : output;
};

export const extractRoute = (route: string): RouteObject => {
  const { pathname: path = "", search = "", hash = "" } = parsePath(route);
  return { path, search: search.substring(1), hash: hash.substring(1) };
};

export const concatRoutes = (
  routeA: RouteObject,
  routeB: RouteObject,
): string => {
  const fixedPathA = trimOnce(routeA["path"], "/");
  const fixedPathB = trimOnce(routeB["path"], "/");
  const path = "/" + trimOnce(fixedPathA + "/" + fixedPathB, "/");

  const fixedSearchA = trimOnce(routeA["search"], "&");
  const fixedSearchB = trimOnce(routeB["search"], "&");
  const search = trimOnce(fixedSearchA + "&" + fixedSearchB, "&");

  const hash = routeB["hash"] === "" ? routeA["hash"] : routeB["hash"];

  return (
    path + addPrefixOnNonEmpty(search, "?") + addPrefixOnNonEmpty(hash, "#")
  );
};
