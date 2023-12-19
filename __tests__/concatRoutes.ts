import { expect, test } from "vitest";
import { concatRoutes, parseRoute } from "../src/concatRoutes";

const concatRouteStrings = (routeA: string, routeB: string): string =>
  concatRoutes(parseRoute(routeA), parseRoute(routeB));

test("concatRoutes perform proper routes concatenation", () => {
  expect(concatRouteStrings("/", "/")).toBe("/");
  expect(concatRouteStrings("/foo", "/")).toBe("/foo");
  expect(concatRouteStrings("/", "/bar")).toBe("/bar");
  expect(concatRouteStrings("/foo", "/bar")).toBe("/foo/bar");

  expect(concatRouteStrings("", "")).toBe("/");
  expect(concatRouteStrings("foo", "")).toBe("/foo");
  expect(concatRouteStrings("", "bar")).toBe("/bar");
  expect(concatRouteStrings("foo", "bar")).toBe("/foo/bar");

  expect(concatRouteStrings("/?", "/?")).toBe("/");
  expect(concatRouteStrings("/?:foo", "/")).toBe("/?:foo");
  expect(concatRouteStrings("/", "/?:bar")).toBe("/?:bar");
  expect(concatRouteStrings("/?:foo", "/?:bar")).toBe("/?:foo&:bar");

  expect(concatRouteStrings("/foo", "/bar?:baz")).toBe("/foo/bar?:baz");

  expect(
    concatRouteStrings("/foo?:bar&:baz&:qux[]", "/quux?:corge&:grault[]"),
  ).toBe("/foo/quux?:bar&:baz&:qux[]&:corge&:grault[]");
});
