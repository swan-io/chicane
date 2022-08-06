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
const identityType = <T>(): T => {};
const compareTypes = <A, B extends A>() => expectType<B>(identityType<A>());

test("ExtractRoute", () => {
  compareTypes<
    ExtractRoute<"/foo?bar#baz">,
    { path: "/foo"; search: "bar"; hash: "baz" }
  >();

  compareTypes<
    ExtractRoute<"/foo?bar">,
    { path: "/foo"; search: "bar"; hash: "" }
  >();

  compareTypes<
    ExtractRoute<"/foo#baz">,
    { path: "/foo"; search: ""; hash: "baz" }
  >();

  compareTypes<
    ExtractRoute<"/foo/bar">,
    { path: "/foo/bar"; search: ""; hash: "" }
  >();

  compareTypes<
    ExtractRoute<"/foo/bar?baz&qux">,
    { path: "/foo/bar"; search: "baz&qux"; hash: "" }
  >();

  compareTypes<
    ExtractRoute<"/foo/bar/baz#qux">,
    { path: "/foo/bar/baz"; search: ""; hash: "qux" }
  >();
});

test("SplitAndFilterEmpty", () => {
  compareTypes<SplitAndFilterEmpty<"/foo", "/">, ["foo"]>();
  compareTypes<SplitAndFilterEmpty<"foo", "&">, ["foo"]>();

  compareTypes<SplitAndFilterEmpty<"/foo/bar", "/">, ["foo", "bar"]>();
  compareTypes<SplitAndFilterEmpty<"foo/bar/", "/">, ["foo", "bar"]>();
  compareTypes<SplitAndFilterEmpty<"/foo/bar", "/">, ["foo", "bar"]>();
  compareTypes<SplitAndFilterEmpty<"/foo//bar", "/">, ["foo", "bar"]>();

  compareTypes<SplitAndFilterEmpty<"foo&bar", "&">, ["foo", "bar"]>();
  compareTypes<SplitAndFilterEmpty<"foo&bar&", "&">, ["foo", "bar"]>();
  compareTypes<SplitAndFilterEmpty<"&foo&bar", "&">, ["foo", "bar"]>();
  compareTypes<SplitAndFilterEmpty<"foo&&bar", "&">, ["foo", "bar"]>();
});

test("ExtractPathParams", () => {
  compareTypes<ExtractPathParams<"/foo/bar">, {}>();
  compareTypes<ExtractPathParams<"/foo/:bar">, { bar: string }>();
  compareTypes<ExtractPathParams<"/:foo/:bar">, { foo: string; bar: string }>();
});

test("ExtractSearchParams", () => {
  compareTypes<ExtractSearchParams<"foo&bar">, {}>(); // no params

  compareTypes<
    ExtractSearchParams<"foo&:bar&:baz">,
    { bar?: string; baz?: string }
  >();

  compareTypes<
    ExtractSearchParams<":foo&:bar&:baz[]">,
    { foo?: string; bar?: string; baz?: string[] }
  >();
});

test("ExtractHashParams", () => {
  compareTypes<ExtractHashParams<"foo">, {}>(); // no param
  compareTypes<ExtractSearchParams<":foo">, { foo?: string }>();
});

test("ConcatPaths", () => {
  compareTypes<ConcatPaths<"/foo", "/bar">, "/foo/bar">();
  compareTypes<ConcatPaths<"/foo", "/">, "/foo">();
  compareTypes<ConcatPaths<"/foo", "">, "/foo">();
  compareTypes<ConcatPaths<"/", "/bar">, "/bar">();
  compareTypes<ConcatPaths<"", "/bar">, "/bar">();
  compareTypes<ConcatPaths<"/foo/bar", "/baz">, "/foo/bar/baz">();
});

test("ConcatSearchs", () => {
  compareTypes<ConcatSearchs<":foo", ":bar">, ":foo&:bar">();
  compareTypes<ConcatSearchs<":foo", "">, ":foo">();
  compareTypes<ConcatSearchs<"", ":bar">, ":bar">();
  compareTypes<ConcatSearchs<":foo", "&:bar">, ":foo&:bar">();
  compareTypes<ConcatSearchs<":foo&:bar", ":baz">, ":foo&:bar&:baz">();

  // TODO: Handle the case for prefix in trailing position
  // compareTypes<ConcatSearchs<":foo&", "&:bar">, ":foo&&:bar">();
});
