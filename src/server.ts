import { Path as HistoryLocation } from "history";
import * as React from "react";
import { createContext } from "react";
import { decodeLocation } from "./location";
import { Location } from "./types";

export const ServerContext = createContext<Location | undefined>(undefined);

export const ServerSideUrlProvider = ({
  value,
  children,
}: {
  value: HistoryLocation;
  children: React.ReactNode;
}) =>
  React.createElement(ServerContext.Provider, {
    value: decodeLocation(value, false),
    children,
  });
