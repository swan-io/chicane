export const first = <T>(value: T[]): T | undefined => value[0];
export const isNonEmpty = (value: string): boolean => value !== "";
export const isParam = (value: string): boolean => value.startsWith(":");

export const isMultipleParam = (value: string): boolean =>
  value.startsWith(":") && value.endsWith("[]");

export const prependBasePath = (basePath: string, route: string): string =>
  route === "/"
    ? basePath
    : route[0] === "/"
    ? `${basePath}${route}`
    : `${basePath}/${route}`;
