import { Path as HistoryLocation } from "history";
import * as React from "react";
import { createContext } from "react";
import { decodeLocation } from "./location";
import { Location } from "./types";

const ServerContext = createContext<Location | undefined>(undefined);

// From https://github.com/facebook/fbjs/blob/v2.0.0/packages/fbjs/src/core/ExecutionEnvironment.js
export const canUseDOM = !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);

type Props = {
  value: HistoryLocation;
  children: React.ReactNode;
};

export const ServerSideUrlProvider = ({ value, children }: Props) =>
  React.createElement(ServerContext.Provider, {
    value: decodeLocation(value, false),
    children,
  });

const fallbackLocation = decodeLocation(
  { pathname: "/", search: "", hash: "" },
  false,
);

export const useServerLocation = (): Location =>
  React.useContext(ServerContext) ?? fallbackLocation;
