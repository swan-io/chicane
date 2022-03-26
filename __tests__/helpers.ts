import {
  areArrayDifferent,
  concatPaths,
  first,
  isMultipleParam,
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

describe("areArrayDifferent", () => {
  test("returns false with identical arrays", () => {
    expect(areArrayDifferent([], [])).toBe(false);
    expect(areArrayDifferent(["foo"], ["foo"])).toBe(false);
    expect(areArrayDifferent(["foo", "bar"], ["foo", "bar"])).toBe(false);
  });

  test("returns true with different arrays", () => {
    expect(areArrayDifferent(["foo"], [])).toBe(true);
    expect(areArrayDifferent(["foo"], ["bar"])).toBe(true);
    expect(areArrayDifferent(["foo", "bar"], ["bar", "foo"])).toBe(true);
  });
});

describe("isMultipleParam", () => {
  test("returns true if the value is a well-formed route multiple param", () => {
    expect(isMultipleParam(":test[]")).toBe(true);
    expect(isMultipleParam(":[]")).toBe(true);
    expect(isMultipleParam(": []")).toBe(true);
  });

  test("returns false if the value is not a well-formed route multiple param", () => {
    expect(isMultipleParam(" :test[]")).toBe(false);
    expect(isMultipleParam("test[]")).toBe(false);
    expect(isMultipleParam(":test]")).toBe(false);
    expect(isMultipleParam(":test[")).toBe(false);
    expect(isMultipleParam(": ")).toBe(false);
    expect(isMultipleParam(":")).toBe(false);
    expect(isMultipleParam(":test")).toBe(false);
    expect(isMultipleParam("test")).toBe(false);
  });
});

describe("concatPaths", () => {
  test("returns a proper path concatenation with valid params", () => {
    expect(concatPaths("/", "/")).toBe("/");
    expect(concatPaths("/foo", "/")).toBe("/foo");
    expect(concatPaths("/", "/bar")).toBe("/bar");
    expect(concatPaths("/foo", "/bar")).toBe("/foo/bar");
  });

  test("returns a proper path concatenation with params with missing leading slashes", () => {
    expect(concatPaths("", "")).toBe("/");
    expect(concatPaths("foo", "")).toBe("/foo");
    expect(concatPaths("", "bar")).toBe("/bar");
    expect(concatPaths("foo", "bar")).toBe("/foo/bar");
  });
});
