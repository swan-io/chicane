import { isNonEmpty } from "./helpers";
import { Location as HistoryLocation } from "./historyLite";
import { decodeSearch, encodeSearch } from "./search";
import { Location } from "./types";

export const decodeLocation = (
  { pathname, search }: HistoryLocation,
  removeExtraSlashes: boolean,
): Location => {
  const path = pathname.substring(1);

  const parsedPath =
    path !== ""
      ? removeExtraSlashes
        ? path.split("/").filter(isNonEmpty).map(decodeURIComponent)
        : path.split("/").map(decodeURIComponent)
      : [];

  const parsedSearch = search !== "" ? decodeSearch(search) : {};

  const rawPath = "/" + parsedPath.map(encodeURIComponent).join("/");
  const rawSearch = encodeSearch(parsedSearch);
  const stringifiedLocation = rawPath + rawSearch;

  return {
    path: parsedPath,
    search: parsedSearch,

    raw: {
      path: rawPath,
      search: rawSearch,
    },

    toString() {
      return stringifiedLocation;
    },
  };
};
