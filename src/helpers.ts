import { Params } from "./types";

export const first = <T>(value: T[]): T | undefined => value[0];
export const identity = <T>(value: T): T => value;
export const noop = () => {};
export const isNonEmpty = (value: string): boolean => value !== "";
export const isParam = (value: string): boolean => value.startsWith(":");

export const ensureSlashPrefix = (value: string): string =>
  value[0] === "/" ? value : "/" + value;

export const areParamsArrayEqual = (arrayA: string[], arrayB: string[]) =>
  arrayA.length === arrayB.length &&
  arrayA.every((a, index) => a === arrayB[index]);

export const getStableParamsKey = (params: Params): string => {
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
    getStableParamsKey(routeA.params) === getStableParamsKey(routeB.params)
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

  const { name, values } = extractParamUnion(
    param.substring(1, param.length - (multiple ? 2 : 0)),
  );

  const output: ReturnType<typeof extractSearchParam> = { multiple, name };

  if (typeof values !== "undefined") {
    output["values"] = values;
  }

  return output;
};
