import * as React from "react";

export const first = <T>(value: T[]): T | undefined => value[0];
export const isNonEmpty = (value: string): boolean => value !== "";
export const isParam = (value: string): boolean => value.startsWith(":");

export const isMultipleParam = (value: string): boolean =>
  value.startsWith(":") && value.endsWith("[]");

export const useIsoLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;
