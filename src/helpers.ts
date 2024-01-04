import murmurhash from "@emotion/hash";
import { Params } from "./types";

export const first = <T>(value: T[]): T | undefined => value[0];
export const last = <T>(value: T[]): T | undefined => value[value.length - 1];
export const identity = <T>(value: T): T => value;
export const noop = () => {};
export const isNonEmpty = (value: string): boolean => value !== "";
export const isParam = (value: string): boolean => value.startsWith(":");

export const ensureSlashPrefix = (value: string): string =>
  value[0] === "/" ? value : "/" + value;

export const areParamsArrayEqual = (arrayA: string[], arrayB: string[]) =>
  arrayA.length === arrayB.length &&
  arrayA.every((a, index) => a === arrayB[index]);

const getStableParamsKey = (params: Params): string => {
  const keys = Object.keys(params);

  return keys.length > 0
    ? JSON.stringify(keys.sort().map((key) => [key, params[key]]))
    : "";
};

export const getRouteKey = (
  name: string,
  pathParams: Params,
  searchParams: Params,
) => {
  const stableStart = name + getStableParamsKey(pathParams);
  const stableEnd = getStableParamsKey(searchParams);
  return `${murmurhash(stableStart)}-${murmurhash(stableEnd)}`;
};

export const areRouteEqual = (
  routeA?: { key: string },
  routeB?: { key: string },
) => routeA?.key === routeB?.key;

export const extractParamNameUnion = (
  paramName: string,
): { name: string; union?: string[] } => {
  const bracketIndex = paramName.indexOf("{");

  if (bracketIndex > -1 && paramName.endsWith("}")) {
    return {
      name: paramName.substring(0, bracketIndex),
      union: paramName
        .substring(bracketIndex + 1, paramName.length - 1)
        .split("|")
        .filter(isNonEmpty),
    };
  } else {
    return { name: paramName };
  }
};
