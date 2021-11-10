import { Location as HistoryLocation, parsePath } from "history";
import { decodeLocation } from "../src/location";
import { Location } from "../src/types";

export const getHistoryLocation = (path: string): HistoryLocation => ({
  hash: "",
  key: "",
  pathname: "/",
  search: "",
  state: null,
  ...parsePath(path),
});

export const getLocation = (path: string): Location =>
  decodeLocation(getHistoryLocation(path), false);
