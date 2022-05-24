import { parsePath } from "history";
import * as React from "react";
import { GetUniversalLocationProvider } from "./history";
import { decodeLocation } from "./location";

type Props = {
  children: React.ReactNode;
  value: string;
};

export const ServerSideUrlProvider = ({ children, value }: Props) => {
  const { pathname = "/", search = "", hash = "" } = parsePath(value);
  const location = decodeLocation({ pathname, search, hash }, false);

  return React.createElement(GetUniversalLocationProvider, {
    children,
    value: () => location,
  });
};
