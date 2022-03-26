export const first = <T>(value: T[]): T | undefined => value[0];
export const identity = <T>(value: T): T => value;
export const isNonEmpty = (value: string): boolean => value !== "";
export const isParam = (value: string): boolean => value.startsWith(":");

export const areParamsArrayEqual = (arrayA: string[], arrayB: string[]) =>
  arrayA.length === arrayB.length &&
  arrayA.every((a, index) => a === arrayB[index]);

export const areRouteEqual = (
  routeA?: { key: string },
  routeB?: { key: string },
) => routeA?.key === routeB?.key;

export const isMultipleParam = (value: string): boolean =>
  value.startsWith(":") && value.endsWith("[]");

export const prefixWithSlash = (value: string): string =>
  value[0] === "/" ? value : `/${value}`;

export const concatPaths = (pathA: string, pathB: string): string => {
  const prefixedPathA = prefixWithSlash(pathA);
  const prefixedPathB = prefixWithSlash(pathB);

  return prefixedPathA === "/"
    ? prefixedPathB
    : prefixedPathB === "/"
    ? prefixedPathA
    : prefixedPathA + prefixedPathB;
};
