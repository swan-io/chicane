import { parsePath } from "history";
import { RouteObject } from "./types";

const addPrefixOnNonEmpty = (value: string, prefix: string) =>
  value === "" ? value : prefix + value;

const trimOne = (value: string, char: string) => {
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
  const fixedPathA = trimOne(routeA["path"], "/");
  const fixedPathB = trimOne(routeB["path"], "/");
  const path = "/" + trimOne(fixedPathA + "/" + fixedPathB, "/");

  const fixedSearchA = trimOne(routeA["search"], "&");
  const fixedSearchB = trimOne(routeB["search"], "&");
  const search = trimOne(fixedSearchA + "&" + fixedSearchB, "&");

  const hash = routeB["hash"] === "" ? routeA["hash"] : routeB["hash"];

  return (
    path + addPrefixOnNonEmpty(search, "?") + addPrefixOnNonEmpty(hash, "#")
  );
};
