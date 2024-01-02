import { describe, expect, test } from "vitest";
import {
  areParamsArrayEqual,
  first,
  getStableParamsKey,
  isNonEmpty,
  isParam,
} from "../src/helpers";

describe("first", () => {
  test("returns the first element of an array", () => {
    expect(first(["a", "b", "c"])).toBe("a");
    expect(first([1, 2, 3])).toBe(1);
  });

  test("returns undefined if the array is empty", () => {
    expect(first([])).toBeUndefined();
  });
});

describe("isNonEmpty", () => {
  test("returns true if the value is not an empty string", () => {
    expect(isNonEmpty("test")).toBe(true);
    expect(isNonEmpty(" ")).toBe(true);
  });

  test("returns false if the value is an empty string", () => {
    expect(isNonEmpty("")).toBe(false);
  });
});

describe("isParam", () => {
  test("returns true if the value is a well-formed route param", () => {
    expect(isParam(":test")).toBe(true);
    expect(isParam(":")).toBe(true);
    expect(isParam(": ")).toBe(true);
  });

  test("returns false if the value is not a well-formed route param", () => {
    expect(isParam(" :test")).toBe(false);
    expect(isParam("test")).toBe(false);
  });
});

describe("areParamsArrayEqual", () => {
  test("returns true with identical arrays", () => {
    expect(areParamsArrayEqual([], [])).toBe(true);
    expect(areParamsArrayEqual(["foo"], ["foo"])).toBe(true);
    expect(areParamsArrayEqual(["foo", "bar"], ["foo", "bar"])).toBe(true);
  });

  test("returns false with different arrays", () => {
    expect(areParamsArrayEqual(["foo"], [])).toBe(false);
    expect(areParamsArrayEqual(["foo"], ["bar"])).toBe(false);
    expect(areParamsArrayEqual(["foo", "bar"], ["bar", "foo"])).toBe(false);
  });
});

describe("getStableParamsKey", () => {
  test("with already ordered params", () => {
    expect(getStableParamsKey({ a: "foo", b: "bar", c: "baz" })).toBe(
      '[["a","foo"],["b","bar"],["c","baz"]]',
    );

    expect(
      getStableParamsKey({ a: "foo", b: undefined, c: ["baz", "qux"] }),
    ).toBe('[["a","foo"],["b",null],["c",["baz","qux"]]]');
  });

  test("with unordered params", () => {
    expect(getStableParamsKey({ b: "bar", a: "foo", c: "baz" })).toBe(
      '[["a","foo"],["b","bar"],["c","baz"]]',
    );

    expect(
      getStableParamsKey({ b: undefined, c: ["baz", "qux"], a: "foo" }),
    ).toBe('[["a","foo"],["b",null],["c",["baz","qux"]]]');
  });
});
