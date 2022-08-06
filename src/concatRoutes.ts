import { parsePath } from "history";
import { RouteObject } from "./types";

const addPrefixOnNonEmpty = (value: string, prefix: string) =>
  value === "" ? value : prefix + value;

const trimOneChar = (value: string, char: string) => {
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
  const fixedPathA = trimOneChar(routeA["path"], "/");
  const fixedPathB = trimOneChar(routeB["path"], "/");
  const path = "/" + trimOneChar(fixedPathA + "/" + fixedPathB, "/");

  const fixedSearchA = trimOneChar(routeA["search"], "&");
  const fixedSearchB = trimOneChar(routeB["search"], "&");
  const search = trimOneChar(fixedSearchA + "&" + fixedSearchB, "&");

  const hash = routeB["hash"] === "" ? routeA["hash"] : routeB["hash"];

  return (
    path + addPrefixOnNonEmpty(search, "?") + addPrefixOnNonEmpty(hash, "#")
  );
};
