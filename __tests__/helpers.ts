import { expect, test } from "vitest";
import {
  areParamsArrayEqual,
  extractParamNameUnion,
  first,
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

test("extractParamNameUnion", () => {
  expect(extractParamNameUnion("foo")).toStrictEqual({ name: "foo" });
  expect(extractParamNameUnion("foo{")).toStrictEqual({ name: "foo{" });
  expect(extractParamNameUnion("foo}")).toStrictEqual({ name: "foo}" });
  expect(extractParamNameUnion("{}foo")).toStrictEqual({ name: "{}foo" });

  expect(extractParamNameUnion("foo{}")).toStrictEqual({
    name: "foo",
    union: [],
  });

  expect(extractParamNameUnion("foo{a}")).toStrictEqual({
    name: "foo",
    union: ["a"],
  });

  expect(extractParamNameUnion("foo{a|b}")).toStrictEqual({
    name: "foo",
    union: ["a", "b"],
  });
});
