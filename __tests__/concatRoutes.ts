import { expect, test } from "vitest";
import { concatRoutes, extractRoute } from "../src/concatRoutes";

const concatRouteStrings = (routeA: string, routeB: string): string =>
  concatRoutes(extractRoute(routeA), extractRoute(routeB));

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

  expect(concatRouteStrings("/#", "/#")).toBe("/");
  expect(concatRouteStrings("/#:foo", "/")).toBe("/#:foo");
  expect(concatRouteStrings("/", "/#:bar")).toBe("/#:bar");
  expect(concatRouteStrings("/#:foo", "/#:bar")).toBe("/#:bar");

  expect(concatRouteStrings("/foo", "/bar?:baz")).toBe("/foo/bar?:baz");
  expect(concatRouteStrings("/foo#:bar", "/baz#:qux")).toBe("/foo/baz#:qux");

  expect(
    concatRouteStrings("/foo?:bar&:baz&:qux[]", "/quux?:corge&:grault[]"),
  ).toBe("/foo/quux?:bar&:baz&:qux[]&:corge&:grault[]");

  expect(
    concatRouteStrings("/foo?:bar&:baz[]#:qux", "/quux?:corge#:grault"),
  ).toBe("/foo/quux?:bar&:baz[]&:corge#:grault");
});
