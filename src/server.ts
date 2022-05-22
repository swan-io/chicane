import { parsePath } from "history";
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
  value: string;
  children: React.ReactNode;
};

export const ServerSideUrlProvider = ({ value, children }: Props) => {
  const { pathname = "/", search = "", hash = "" } = parsePath(value);

  return React.createElement(ServerContext.Provider, {
    value: decodeLocation({ pathname, search, hash }, false),
    children,
  });
};

const fallbackLocation = decodeLocation(
  { pathname: "/", search: "", hash: "" },
  false,
);

export const useServerLocation = (): Location =>
  React.useContext(ServerContext) ?? fallbackLocation;
