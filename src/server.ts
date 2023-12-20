import { createElement } from "react";
import { GetUniversalLocationProvider, decodeLocation } from "./history";

type Props = {
  children: React.ReactNode;
  value: string;
};

export const ServerUrlProvider = ({ children, value }: Props) => {
  const location = decodeLocation(value);

  return createElement(GetUniversalLocationProvider, {
    children,
    value: () => location,
  });
};
