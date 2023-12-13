import { Params } from "./types";

export const first = <T>(value: T[]): T | undefined => value[0];
export const identity = <T>(value: T): T => value;
export const isNonEmpty = (value: string): boolean => value !== "";
export const isParam = (value: string): boolean => value.startsWith(":");

export const areParamsArrayEqual = (arrayA: string[], arrayB: string[]) =>
  arrayA.length === arrayB.length &&
  arrayA.every((a, index) => a === arrayB[index]);

export const stableStringifyParams = (params: Params) => {
  const keys = Object.keys(params).sort();
  return JSON.stringify(keys.map((key) => [key, params[key]]));
};

export const areRouteEqual = (
  routeA?: { name: string; params: Params },
  routeB?: { name: string; params: Params },
): boolean => {
  const hasRouteA = typeof routeA !== "undefined";
  const hasRouteB = typeof routeB !== "undefined";

  if (!hasRouteA && !hasRouteB) {
    return true;
  }
  if (!hasRouteA || !hasRouteB || routeA.name !== routeB.name) {
    return false;
  }

  return (
    stableStringifyParams(routeA.params) ===
    stableStringifyParams(routeB.params)
  );
};

export const isMultipleParam = (value: string): boolean =>
  value.startsWith(":") && value.endsWith("[]");
