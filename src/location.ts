import { Path as HistoryLocation } from "history";
import { isNonEmpty } from "./helpers";
import { decodeSearch, encodeSearch } from "./search";
import { Location } from "./types";

// As the `encodeSearch` function guarantees a stable sorting, we can rely on a simple URL comparison
export const areLocationsEqual = (locationA: Location, locationB: Location) =>
  locationA.url === locationB.url;

export const decodeLocation = (
  { pathname, search, hash }: HistoryLocation,
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
  const parsedHash = hash !== "" ? decodeURIComponent(hash.substring(1)) : null;

  const raw = {
    path: "/" + parsedPath.map(encodeURIComponent).join("/"),
    search: encodeSearch(parsedSearch),
    hash: parsedHash != null ? "#" + encodeURIComponent(parsedHash) : "",
  };

  return {
    url: raw.path + raw.search + raw.hash,
    raw,
    path: parsedPath,
    search: parsedSearch,
    ...(parsedHash !== null && {
      hash: parsedHash,
    }),
  };
};
