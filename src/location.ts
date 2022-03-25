import { Path as HistoryLocation } from "history";
import { isNonEmpty } from "./helpers";
import { decodeSearch, encodeSearch } from "./search";
import { MutableLocation } from "./types";

export const decodeLocation = (
  { pathname, search, hash }: HistoryLocation,
  removeExtraSlashes: boolean,
): MutableLocation => {
  const path = pathname.substring(1);

  const parsedPath =
    path !== ""
      ? removeExtraSlashes
        ? path.split("/").filter(isNonEmpty).map(decodeURIComponent)
        : path.split("/").map(decodeURIComponent)
      : [];

  const parsedSearch = search !== "" ? decodeSearch(search) : {};
  const parsedHash = hash !== "" ? decodeURIComponent(hash.substring(1)) : null;

  const rawPath = "/" + parsedPath.map(encodeURIComponent).join("/");
  const rawSearch = encodeSearch(parsedSearch);
  const rawHash =
    parsedHash != null ? "#" + encodeURIComponent(parsedHash) : "";

  const stringifiedLocation = rawPath + rawSearch + rawHash;

  return {
    path: parsedPath,
    search: parsedSearch,
    ...(parsedHash !== null && {
      hash: parsedHash,
    }),

    raw: {
      path: rawPath,
      search: rawSearch,
      hash: rawHash,
    },

    toString() {
      return stringifiedLocation;
    },
  };
};
