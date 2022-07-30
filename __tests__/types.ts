import { expectType } from "tsd";
import { test } from "vitest";
import { ConcatRoutes, SplitAndFilterEmpty } from "../src/types";

// @ts-expect-error
const identityType = <T>(): T => {};
const compareTypes = <R, T extends R>() => expectType<R>(identityType<T>());

test("ConcatRoutes", () => {
  compareTypes<ConcatRoutes<"/foo", "/bar">, "/foo/bar">();
});

test("SplitAndFilterEmpty", () => {
  compareTypes<SplitAndFilterEmpty<"/foo/bar", "/">, ["foo", "bar"]>();
  compareTypes<SplitAndFilterEmpty<"foo/bar/", "/">, ["foo", "bar"]>();
  compareTypes<SplitAndFilterEmpty<"/foo/bar/", "/">, ["foo", "bar"]>();
});
