import { expect, test } from "vitest";
import { decodeSearch } from "../src";

test("decodeSearch parses params starting with a `?`", () => {
  expect(decodeSearch("?foo=bar")).toStrictEqual({ foo: "bar" });
});

test("decodeSearch parses params starting with a `&`", () => {
  expect(decodeSearch("&foo=bar&foo=baz")).toStrictEqual({
    foo: ["bar", "baz"],
  });
});

test("decodeSearch parses params ending with a `&`", () => {
  expect(decodeSearch("foo=bar&")).toStrictEqual({ foo: "bar" });
  expect(decodeSearch("foo=bar&&&")).toStrictEqual({ foo: "bar" });
});

test("decodeSearch parses a single query string", () => {
  expect(decodeSearch("foo=bar")).toStrictEqual({ foo: "bar" });
});

test("decodeSearch parses multiple query string", () => {
  expect(decodeSearch("foo=bar&baz=qux")).toStrictEqual({
    foo: "bar",
    baz: "qux",
  });
});

test("decodeSearch parses query string without value", () => {
  expect(decodeSearch("foo")).toStrictEqual({ foo: "" });
  expect(decodeSearch("foo&bar")).toStrictEqual({ foo: "", bar: "" });
  expect(decodeSearch("foo=bar&baz")).toStrictEqual({ foo: "bar", baz: "" });
  expect(decodeSearch("a&a")).toStrictEqual({ a: ["", ""] });
  expect(decodeSearch("a=&a")).toStrictEqual({ a: ["", ""] });
});

test("decodeSearch returns empty object if no query string can be found", () => {
  expect(decodeSearch("?")).toStrictEqual({});
  expect(decodeSearch("&")).toStrictEqual({});
});

test("decodeSearch handles spaces correctly", () => {
  expect(decodeSearch("foo%20faz=bar%20baz%20%20")).toStrictEqual({
    "foo faz": "bar baz  ",
  });
});

test("decodeSearch parses numbers with exponential notation as string", () => {
  expect(decodeSearch("192e11=bar")).toStrictEqual({ "192e11": "bar" });
  expect(decodeSearch("bar=192e11")).toStrictEqual({ bar: "192e11" });
});

test("decodeSearch handles multiple of the same key", () => {
  expect(decodeSearch("foo=bar&foo=baz")).toStrictEqual({
    foo: ["bar", "baz"],
  });
});

test("decodeSearch handles multiple values and preserve appearence order", () => {
  expect(decodeSearch("a=value&a=")).toStrictEqual({ a: ["value", ""] });
  expect(decodeSearch("a=&a=value")).toStrictEqual({ a: ["", "value"] });
});

test("decodeSearch parses params params including embedded `=`", () => {
  expect(
    decodeSearch("?param=https%3A%2F%2Fsomeurl%3Fid%3D2837"),
  ).toStrictEqual({
    param: "https://someurl?id=2837",
  });
});
