import { expectTypeOf, test } from "vitest";
import {
  ConcatPaths,
  ConcatSearchs,
  GetAreaRoutes,
  GetHashParams,
  GetPathParams,
  GetSearchParams,
  NonEmptySplit,
  ParseRoute,
  ParseRoutes,
  PrependBasePath,
  Simplify,
} from "../src/types";

test("ParseRoute", () => {
  expectTypeOf<ParseRoute<"/foo?bar#baz">>().toEqualTypeOf<{
    path: "/foo";
    search: "bar";
    hash: "baz";
  }>();

  expectTypeOf<ParseRoute<"/foo?bar">>().toEqualTypeOf<{
    path: "/foo";
    search: "bar";
    hash: "";
  }>();

  expectTypeOf<ParseRoute<"/foo#baz">>().toEqualTypeOf<{
    path: "/foo";
    search: "";
    hash: "baz";
  }>();

  expectTypeOf<ParseRoute<"/foo/bar">>().toEqualTypeOf<{
    path: "/foo/bar";
    search: "";
    hash: "";
  }>();

  expectTypeOf<ParseRoute<"/foo/bar?baz&qux">>().toEqualTypeOf<{
    path: "/foo/bar";
    search: "baz&qux";
    hash: "";
  }>();

  expectTypeOf<ParseRoute<"/foo/bar/baz#qux">>().toEqualTypeOf<{
    path: "/foo/bar/baz";
    search: "";
    hash: "qux";
  }>();
});

test("NonEmptySplit", () => {
  expectTypeOf<NonEmptySplit<"/foo", "/">>().toEqualTypeOf<["foo"]>();
  expectTypeOf<NonEmptySplit<"foo", "&">>().toEqualTypeOf<["foo"]>();
  expectTypeOf<NonEmptySplit<"foo&bar", "&">>().toEqualTypeOf<["foo", "bar"]>();

  expectTypeOf<NonEmptySplit<"/foo/bar", "/">>().toEqualTypeOf<
    ["foo", "bar"]
  >();
  expectTypeOf<NonEmptySplit<"foo/bar/", "/">>().toEqualTypeOf<
    ["foo", "bar"]
  >();
  expectTypeOf<NonEmptySplit<"/foo/bar", "/">>().toEqualTypeOf<
    ["foo", "bar"]
  >();
  expectTypeOf<NonEmptySplit<"/foo//bar", "/">>().toEqualTypeOf<
    ["foo", "bar"]
  >();
  expectTypeOf<NonEmptySplit<"foo&bar&", "&">>().toEqualTypeOf<
    ["foo", "bar"]
  >();
  expectTypeOf<NonEmptySplit<"&foo&bar", "&">>().toEqualTypeOf<
    ["foo", "bar"]
  >();
  expectTypeOf<NonEmptySplit<"foo&&bar", "&">>().toEqualTypeOf<
    ["foo", "bar"]
  >();
});

test("GetPathParams", () => {
  expectTypeOf<GetPathParams<"/foo/bar">>().toEqualTypeOf<{}>();
  expectTypeOf<GetPathParams<"/foo/:bar">>().toEqualTypeOf<{ bar: string }>();

  expectTypeOf<Simplify<GetPathParams<"/:foo/:bar">>>().toEqualTypeOf<{
    foo: string;
    bar: string;
  }>();
});

test("GetSearchParams", () => {
  expectTypeOf<GetSearchParams<"foo&bar">>().toEqualTypeOf<{}>(); // no params

  expectTypeOf<Simplify<GetSearchParams<"foo&:bar&:baz">>>().toEqualTypeOf<{
    bar?: string;
    baz?: string;
  }>();

  expectTypeOf<Simplify<GetSearchParams<":foo&:bar&:baz[]">>>().toEqualTypeOf<{
    foo?: string;
    bar?: string;
    baz?: string[];
  }>();
});

test("GetHashParams", () => {
  expectTypeOf<GetHashParams<"foo">>().toEqualTypeOf<{}>(); // no param
  expectTypeOf<GetHashParams<":foo">>().toEqualTypeOf<{ foo?: string }>();
});

test("ConcatPaths", () => {
  expectTypeOf<ConcatPaths<"/foo", "/bar">>().toEqualTypeOf<"/foo/bar">();
  expectTypeOf<ConcatPaths<"/foo", "/">>().toEqualTypeOf<"/foo">();
  expectTypeOf<ConcatPaths<"/foo", "">>().toEqualTypeOf<"/foo">();
  expectTypeOf<ConcatPaths<"/", "/bar">>().toEqualTypeOf<"/bar">();
  expectTypeOf<ConcatPaths<"", "/bar">>().toEqualTypeOf<"/bar">();

  expectTypeOf<
    ConcatPaths<"/foo/bar", "/baz">
  >().toEqualTypeOf<"/foo/bar/baz">();
});

test("ConcatSearchs", () => {
  expectTypeOf<ConcatSearchs<":foo", ":bar">>().toEqualTypeOf<":foo&:bar">();
  expectTypeOf<ConcatSearchs<":foo", "">>().toEqualTypeOf<":foo">();
  expectTypeOf<ConcatSearchs<"", ":bar">>().toEqualTypeOf<":bar">();

  expectTypeOf<
    ConcatSearchs<":foo&:bar", ":baz">
  >().toEqualTypeOf<":foo&:bar&:baz">();
});

test("GetAreaRoutes", () => {
  expectTypeOf<
    GetAreaRoutes<
      ParseRoutes<{
        User: "/users/:userId";
        RepositoriesArea: "/users/:userId/repositories/*?:foo&:bar[]#:baz";
      }>
    >
  >().toEqualTypeOf<{
    RepositoriesArea: {
      path: "/users/:userId/repositories";
      hash: ":baz";
      search: ":foo&:bar[]";
    };
  }>();
});

test("PrependBasePath", () => {
  type Input = {
    a: ParseRoute<"/">;
    b: ParseRoute<"/foo/bar">;
    c: ParseRoute<"/foo?:bar#:baz">;
  };

  expectTypeOf<PrependBasePath<"", Input>>().toEqualTypeOf<{
    a: { path: "/"; search: ""; hash: "" };
    b: { path: "/foo/bar"; search: ""; hash: "" };
    c: { path: "/foo"; search: ":bar"; hash: ":baz" };
  }>();

  expectTypeOf<PrependBasePath<"/", Input>>().toEqualTypeOf<{
    a: { path: "/"; search: ""; hash: "" };
    b: { path: "/foo/bar"; search: ""; hash: "" };
    c: { path: "/foo"; search: ":bar"; hash: ":baz" };
  }>();

  expectTypeOf<PrependBasePath<"/base", Input>>().toEqualTypeOf<{
    a: { path: "/base"; search: ""; hash: "" };
    b: { path: "/base/foo/bar"; search: ""; hash: "" };
    c: { path: "/base/foo"; search: ":bar"; hash: ":baz" };
  }>();
});
