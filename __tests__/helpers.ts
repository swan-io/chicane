import { expect, test } from "vitest";
import {
  areParamsArrayEqual,
  areRouteEqual,
  extractParamNameUnion,
  first,
  getStableParamsKey,
  isNonEmpty,
  isParam,
} from "../src/helpers";

test("first", () => {
  expect(first(["a", "b", "c"])).toBe("a");
  expect(first([1, 2, 3])).toBe(1);

  expect(first([])).toBeUndefined();
});

test("isNonEmpty", () => {
  expect(isNonEmpty("test")).toBe(true);
  expect(isNonEmpty(" ")).toBe(true);

  expect(isNonEmpty("")).toBe(false);
});

test("isParam", () => {
  expect(isParam(":test")).toBe(true);
  expect(isParam(":")).toBe(true);
  expect(isParam(": ")).toBe(true);

  expect(isParam(" :test")).toBe(false);
  expect(isParam("test")).toBe(false);
});

test("areParamsArrayEqual", () => {
  expect(areParamsArrayEqual([], [])).toBe(true);
  expect(areParamsArrayEqual(["foo"], ["foo"])).toBe(true);
  expect(areParamsArrayEqual(["foo", "bar"], ["foo", "bar"])).toBe(true);

  expect(areParamsArrayEqual(["foo"], [])).toBe(false);
  expect(areParamsArrayEqual(["foo"], ["bar"])).toBe(false);
  expect(areParamsArrayEqual(["foo", "bar"], ["bar", "foo"])).toBe(false);
});

test("getStableParamsKey", () => {
  expect(getStableParamsKey({ a: "foo", b: "bar", c: "baz" })).toBe(
    JSON.stringify([
      ["a", "foo"],
      ["b", "bar"],
      ["c", "baz"],
    ]),
  );

  expect(
    getStableParamsKey({ a: "foo", b: undefined, c: ["baz", "qux"] }),
  ).toBe(
    JSON.stringify([
      ["a", "foo"],
      ["b", null],
      ["c", ["baz", "qux"]],
    ]),
  );

  expect(getStableParamsKey({ b: "bar", a: "foo", c: "baz" })).toBe(
    JSON.stringify([
      ["a", "foo"],
      ["b", "bar"],
      ["c", "baz"],
    ]),
  );

  expect(
    getStableParamsKey({ b: undefined, c: ["baz", "qux"], a: "foo" }),
  ).toBe(
    JSON.stringify([
      ["a", "foo"],
      ["b", null],
      ["c", ["baz", "qux"]],
    ]),
  );
});

test("areRouteEqual", () => {
  expect(areRouteEqual(undefined, undefined)).toBe(true);
  expect(areRouteEqual({ name: "Foo", params: {} }, undefined)).toBe(false);

  expect(
    areRouteEqual({ name: "Foo", params: {} }, { name: "Foo", params: {} }),
  ).toBe(true);

  expect(
    areRouteEqual({ name: "Foo", params: {} }, { name: "Bar", params: {} }),
  ).toBe(false);

  expect(
    areRouteEqual(
      { name: "Foo", params: { bar: "baz", qux: ["a", "b"] } },
      { name: "Foo", params: { bar: "baz", qux: ["a", "b"] } },
    ),
  ).toBe(true);

  expect(
    areRouteEqual(
      { name: "Foo", params: { bar: "baz", qux: ["a", "b"] } },
      { name: "Foo", params: { bar: "baz", qux: ["a"] } },
    ),
  ).toBe(false);
});

test("extractParamNameUnion", () => {
  expect(extractParamNameUnion("foo")).toStrictEqual({ name: "foo" });
  expect(extractParamNameUnion("foo{")).toStrictEqual({ name: "foo{" });
  expect(extractParamNameUnion("foo}")).toStrictEqual({ name: "foo}" });
  expect(extractParamNameUnion("{}foo")).toStrictEqual({ name: "{}foo" });

  expect(extractParamNameUnion("foo{}")).toStrictEqual({
    name: "foo",
    values: [],
  });

  expect(extractParamNameUnion("foo{a}")).toStrictEqual({
    name: "foo",
    values: ["a"],
  });

  expect(extractParamNameUnion("foo{a|b}")).toStrictEqual({
    name: "foo",
    values: ["a", "b"],
  });
});
