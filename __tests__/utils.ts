import { Path as HistoryLocation, parsePath } from "../src/historyLite";
import { decodeLocation } from "../src/location";
import { Location } from "../src/types";

export const getHistoryLocation = (path: string): HistoryLocation => ({
  hash: "",
  pathname: "/",
  search: "",
  ...parsePath(path),
});

export const getLocation = (path: string): Location =>
  decodeLocation(getHistoryLocation(path), false);
