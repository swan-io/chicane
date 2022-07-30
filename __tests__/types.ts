import { expectType } from "tsd";
import { test } from "vitest";
import { SplitAndFilterEmpty } from "../src/types";

// @ts-expect-error
const identityType = <T>(): T => {};
const compareTypes = <R, T extends R>() => expectType<R>(identityType<T>());

test("SplitAndFilterEmpty", () => {
  compareTypes<["foo", "bar"], SplitAndFilterEmpty<"/foo/bar", "/">>();
  compareTypes<["foo", "bar"], SplitAndFilterEmpty<"foo/bar/", "/">>();
  compareTypes<["foo", "bar"], SplitAndFilterEmpty<"/foo/bar/", "/">>();
});
