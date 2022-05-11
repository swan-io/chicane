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
});
