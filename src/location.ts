import { Location as HistoryLocation } from "history";
import { isNonEmpty } from "./helpers";
import { decodeSearch, encodeSearch } from "./search";
import { Location } from "./types";

export const decodeLocation = (
  { pathname, search, hash }: HistoryLocation,
  removeExtraSlashes: boolean,
): Location => {
  const path = pathname.substring(1);

  const outputPath =
    path !== ""
      ? removeExtraSlashes
        ? path.split("/").filter(isNonEmpty).map(decodeURIComponent)
        : path.split("/").map(decodeURIComponent)
      : [];

  const outputSearch = search !== "" ? decodeSearch(search) : {};
  const outputHash = hash !== "" ? decodeURIComponent(hash.substring(1)) : null;

  const url =
    "/" +
    outputPath.map(encodeURIComponent).join("/") +
    encodeSearch(outputSearch) +
    (outputHash != null ? "#" + encodeURIComponent(outputHash) : "");

  return {
    url,
    path: outputPath,
    search: outputSearch,
    ...(outputHash !== null && {
      hash: outputHash,
    }),
  };
};
