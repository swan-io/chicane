import { createElement } from "react";
import { GetUniversalLocationProvider } from "./history";
import { parseRoute } from "./historyLite";
import { decodeLocation } from "./location";

type Props = {
  children: React.ReactNode;
  value: string;
};

export const ServerUrlProvider = ({ children, value }: Props) => {
  const { path, search } = parseRoute(value);
  const location = decodeLocation({ path, search }, false);

  return createElement(GetUniversalLocationProvider, {
    children,
    value: () => location,
  });
};
