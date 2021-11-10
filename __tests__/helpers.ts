import { first, isMultipleParam, isNonEmpty, isParam } from "../src/helpers";

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

test("isMultipleParam", () => {
  expect(isMultipleParam(":test[]")).toBe(true);
  expect(isMultipleParam(":[]")).toBe(true);
  expect(isMultipleParam(": []")).toBe(true);

  expect(isMultipleParam(" :test[]")).toBe(false);
  expect(isMultipleParam("test[]")).toBe(false);
  expect(isMultipleParam(":test]")).toBe(false);
  expect(isMultipleParam(":test[")).toBe(false);
  expect(isMultipleParam(": ")).toBe(false);
  expect(isMultipleParam(":")).toBe(false);
  expect(isMultipleParam(":test")).toBe(false);
  expect(isMultipleParam("test")).toBe(false);
});
