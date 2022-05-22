import { parsePath } from "history";
import * as React from "react";
import { decodeLocation } from "./location";
import { ServerLocationContext } from "./serverLocationContext";

type Props = {
  value: string;
  children: React.ReactNode;
};

export const ServerSideUrlProvider = ({ value, children }: Props) => {
  const { pathname = "/", search = "", hash = "" } = parsePath(value);

  return React.createElement(ServerLocationContext.Provider, {
    value: decodeLocation({ pathname, search, hash }, false),
    children,
  });
};
