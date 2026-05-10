import { createElement, type ReactNode } from "react";
import { GetUniversalLocationContext, decodeLocation } from "./history.ts";

type Props = {
  children: ReactNode;
  value: string;
};

export const UrlProvider = ({ children, value }: Props) => {
  const location = decodeLocation(value);

  return createElement(GetUniversalLocationContext, {
    children,
    value: () => location,
  });
};
