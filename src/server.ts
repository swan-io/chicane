import { createElement } from "react";
import { GetUniversalLocationProvider } from "./history";
import { parsePath } from "./historyLite";
import { decodeLocation } from "./location";

type Props = {
  children: React.ReactNode;
  value: string;
};

export const ServerUrlProvider = ({ children, value }: Props) => {
  const { pathname, search } = parsePath(value);
  const location = decodeLocation({ pathname, search }, false);

  return createElement(GetUniversalLocationProvider, {
    children,
    value: () => location,
  });
};
