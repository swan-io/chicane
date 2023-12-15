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

const extractParamUnion = (
  paramName: string,
): { name: string; values?: string[] } => {
  const bracketIndex = paramName.indexOf("{");

  if (bracketIndex > -1 && paramName.endsWith("}")) {
    return {
      name: paramName.substring(0, bracketIndex),
      values: paramName
        .substring(bracketIndex + 1, paramName.length - 1)
        .split("|")
        .filter(isNonEmpty),
    };
  } else {
    return { name: paramName };
  }
};

export const extractPathParam = (param: string) =>
  extractParamUnion(param.substring(1));

export const extractSearchParam = (
  param: string,
): { name: string; multiple: boolean; values?: string[] } => {
  const multiple = param.endsWith("[]");

  return {
    ...extractParamUnion(param.substring(1, param.length - (multiple ? 2 : 0))),
    multiple,
  };
};
