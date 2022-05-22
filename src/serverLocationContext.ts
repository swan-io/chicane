import * as React from "react";
import { decodeLocation } from "./location";
import { Location } from "./types";

export const ServerLocationContext = React.createContext<Location>(
  decodeLocation({ pathname: "/", search: "", hash: "" }, false),
);
