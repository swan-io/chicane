import { expectType } from "tsd";
import { test } from "vitest";
import {
  ConcatPaths,
  ConcatSearchs,
  ExtractHashParams,
  ExtractPathParams,
  ExtractRoute,
  ExtractSearchParams,
  SplitAndFilterEmpty,
} from "../src/types";

// @ts-expect-error
const toBe = <T>(): T => {};

test("ExtractRoute", () => {
  expectType<ExtractRoute<"/foo?bar#baz">>(
    toBe<{ path: "/foo"; search: "bar"; hash: "baz" }>(),
  );

  expectType<ExtractRoute<"/foo?bar">>(
    toBe<{ path: "/foo"; search: "bar"; hash: "" }>(),
  );

  expectType<ExtractRoute<"/foo#baz">>(
    toBe<{ path: "/foo"; search: ""; hash: "baz" }>(),
  );

  expectType<ExtractRoute<"/foo/bar">>(
    toBe<{ path: "/foo/bar"; search: ""; hash: "" }>(),
  );

  expectType<ExtractRoute<"/foo/bar?baz&qux">>(
    toBe<{ path: "/foo/bar"; search: "baz&qux"; hash: "" }>(),
  );

  expectType<ExtractRoute<"/foo/bar/baz#qux">>(
    toBe<{ path: "/foo/bar/baz"; search: ""; hash: "qux" }>(),
  );
});

test("SplitAndFilterEmpty", () => {
  expectType<SplitAndFilterEmpty<"/foo", "/">>(toBe<["foo"]>());
  expectType<SplitAndFilterEmpty<"foo", "&">>(toBe<["foo"]>());

  expectType<SplitAndFilterEmpty<"/foo/bar", "/">>(toBe<["foo", "bar"]>());
  expectType<SplitAndFilterEmpty<"foo/bar/", "/">>(toBe<["foo", "bar"]>());
  expectType<SplitAndFilterEmpty<"/foo/bar", "/">>(toBe<["foo", "bar"]>());
  expectType<SplitAndFilterEmpty<"/foo//bar", "/">>(toBe<["foo", "bar"]>());

  expectType<SplitAndFilterEmpty<"foo&bar", "&">>(toBe<["foo", "bar"]>());
  expectType<SplitAndFilterEmpty<"foo&bar&", "&">>(toBe<["foo", "bar"]>());
  expectType<SplitAndFilterEmpty<"&foo&bar", "&">>(toBe<["foo", "bar"]>());
  expectType<SplitAndFilterEmpty<"foo&&bar", "&">>(toBe<["foo", "bar"]>());
});

test("ExtractPathParams", () => {
  expectType<ExtractPathParams<"/foo/bar">>(toBe<{}>());
  expectType<ExtractPathParams<"/foo/:bar">>(toBe<{ bar: string }>());

  expectType<ExtractPathParams<"/:foo/:bar">>(
    toBe<{ foo: string; bar: string }>(),
  );
});

test("ExtractSearchParams", () => {
  expectType<ExtractSearchParams<"foo&bar">>(toBe<{}>()); // no params

  expectType<ExtractSearchParams<"foo&:bar&:baz">>(
    toBe<{ bar?: string; baz?: string }>(),
  );

  expectType<ExtractSearchParams<":foo&:bar&:baz[]">>(
    toBe<{ foo?: string; bar?: string; baz?: string[] }>(),
  );
});

test("ExtractHashParams", () => {
  expectType<ExtractHashParams<"foo">>(toBe<{}>()); // no param
  expectType<ExtractSearchParams<":foo">>(toBe<{ foo?: string }>());
});

test("ConcatPaths", () => {
  expectType<ConcatPaths<"/foo", "/bar">>(toBe<"/foo/bar">());
  expectType<ConcatPaths<"/foo", "/">>(toBe<"/foo">());
  expectType<ConcatPaths<"/foo", "">>(toBe<"/foo">());
  expectType<ConcatPaths<"/", "/bar">>(toBe<"/bar">());
  expectType<ConcatPaths<"", "/bar">>(toBe<"/bar">());
  expectType<ConcatPaths<"/foo/bar", "/baz">>(toBe<"/foo/bar/baz">());
});

test("ConcatSearchs", () => {
  expectType<ConcatSearchs<":foo", ":bar">>(toBe<":foo&:bar">());
  expectType<ConcatSearchs<":foo", "">>(toBe<":foo">());
  expectType<ConcatSearchs<"", ":bar">>(toBe<":bar">());
  expectType<ConcatSearchs<":foo&:bar", ":baz">>(toBe<":foo&:bar&:baz">());
});
