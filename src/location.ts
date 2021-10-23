import { Location as HistoryLocation } from "history";
import { isNonEmpty } from "./helpers";
import { decodeSearch, encodeSearch } from "./search";
import { Location } from "./types";

export const decodeLocation = (
  { pathname, search, hash }: HistoryLocation,
  removeExtraSlashes: boolean,
): Location => {
  const path = pathname.substring(1);

  return {
    path:
      path !== ""
        ? removeExtraSlashes
          ? path.split("/").filter(isNonEmpty).map(decodeURIComponent)
          : path.split("/").map(decodeURIComponent)
        : [],

    search: search !== "" ? decodeSearch(search) : {},
    ...(hash !== "" && {
      hash: decodeURIComponent(hash.substring(1)),
    }),
  };
};

export const encodeLocation = ({ path, search, hash }: Location): string =>
  "/" +
  path.map(encodeURIComponent).join("/") +
  encodeSearch(search) +
  (hash != null ? "#" + encodeURIComponent(hash) : "");
