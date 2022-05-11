import { concatRouteObjects, extractRoute } from "../src/concatRouteObjects";

const concatRouteStrings = (routeA: string, routeB: string): string =>
  concatRouteObjects(extractRoute(routeA), extractRoute(routeB));

test("concatRouteObjects", () => {
  expect(concatRouteStrings("/", "/")).toBe("/");
  expect(concatRouteStrings("/foo", "/")).toBe("/foo");
  expect(concatRouteStrings("/", "/bar")).toBe("/bar");
  expect(concatRouteStrings("/foo", "/bar")).toBe("/foo/bar");

  expect(concatRouteStrings("", "")).toBe("/");
  expect(concatRouteStrings("foo", "")).toBe("/foo");
  expect(concatRouteStrings("", "bar")).toBe("/bar");
  expect(concatRouteStrings("foo", "bar")).toBe("/foo/bar");

  expect(concatRouteStrings("/?", "/?")).toBe("/");
});
