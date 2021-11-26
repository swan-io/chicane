import { first, isMultipleParam, isNonEmpty, isParam } from "../src/helpers";

test("first returns the first element of an array", () => {
  expect(first(["a", "b", "c"])).toBe("a");
  expect(first([1, 2, 3])).toBe(1);
});

test("first returns undefined if the array is empty", () => {
  expect(first([])).toBeUndefined();
});

test("isNonEmpty returns true if the value is not an empty string", () => {
  expect(isNonEmpty("test")).toBe(true);
  expect(isNonEmpty(" ")).toBe(true);
});

test("isNonEmpty returns false if the value is an empty string", () => {
  expect(isNonEmpty("")).toBe(false);
});

test("isParam returns true if the value is a well-formed route param", () => {
  expect(isParam(":test")).toBe(true);
  expect(isParam(":")).toBe(true);
  expect(isParam(": ")).toBe(true);
});

test("isParam returns false if the value is not a well-formed route param", () => {
  expect(isParam(" :test")).toBe(false);
  expect(isParam("test")).toBe(false);
});

test("isMultipleParam returns true if the value is a well-formed route multiple param", () => {
  expect(isMultipleParam(":test[]")).toBe(true);
  expect(isMultipleParam(":[]")).toBe(true);
  expect(isMultipleParam(": []")).toBe(true);
});

test("isMultipleParam returns false if the value is not a well-formed route multiple param", () => {
  expect(isMultipleParam(" :test[]")).toBe(false);
  expect(isMultipleParam("test[]")).toBe(false);
  expect(isMultipleParam(":test]")).toBe(false);
  expect(isMultipleParam(":test[")).toBe(false);
  expect(isMultipleParam(": ")).toBe(false);
  expect(isMultipleParam(":")).toBe(false);
  expect(isMultipleParam(":test")).toBe(false);
  expect(isMultipleParam("test")).toBe(false);
});
