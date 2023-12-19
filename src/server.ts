import { createElement } from "react";
import { GetUniversalLocationProvider } from "./history";
import { decodeLocation, parseRoute } from "./historyLite";

type Props = {
  children: React.ReactNode;
  value: string;
};

export const ServerUrlProvider = ({ children, value }: Props) => {
  const location = decodeLocation(parseRoute(value), false);

  return createElement(GetUniversalLocationProvider, {
    children,
    value: () => location,
  });
};
