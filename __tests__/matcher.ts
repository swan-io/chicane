import { getMatcher, match } from "../src/matcher";
import { getLocation } from "./utils";

const getMatcherEqual = <E>(name: string, route: string, expected: E) =>
  expect(getMatcher(name, route)).toStrictEqual({ name, ...expected });

const matchers = [
  getMatcher("groups", "/groups"),
  getMatcher("group", "/groups/:groupId"),
  getMatcher("myGroup", "/groups/mine"),
  getMatcher("usersArea", "/groups/:groupId/users/*"),
  getMatcher("users", "/groups/:groupId/users"),
].sort((a, b) => b.ranking - a.ranking); // we sort the matchers since match doesn't do it at each call

const matchEqual = <E>(path: string, expected: E) =>
  expect(match(getLocation(path), matchers)).toStrictEqual(expected);

test("getMatcher returns a proper matcher structure for paths without params", () => {
  getMatcherEqual("groups", "/groups", {
    finite: true,
    ranking: 7,
    search: {},
    segments: [{ name: "groups", param: false }],
  });

  getMatcherEqual("myGroup", "/groups/mine", {
    finite: true,
    ranking: 14,
    search: {},
    segments: [
      { name: "groups", param: false },
      { name: "mine", param: false },
    ],
  });
});

test("getMatcher returns a proper matcher structure for paths with params (in path only)", () => {
  getMatcherEqual("group", "/group/:groupId", {
    finite: true,
    ranking: 13,
    search: {},
    segments: [
      { name: "group", param: false },
      { name: "groupId", param: true },
    ],
  });

  getMatcherEqual("users", "/groups/:groupId/users", {
    finite: true,
    ranking: 20,
    search: {},
    segments: [
      { name: "groups", param: false },
      { name: "groupId", param: true },
      { name: "users", param: false },
    ],
  });
});

test("getMatcher returns a proper matcher structure for paths with params (in path, search and hash)", () => {
  getMatcherEqual("group", "/group/:groupId?:foo&:bar[]#:baz", {
    finite: true,
    ranking: 13,
    hash: "baz",
    search: { foo: "unique", bar: "multiple" },
    segments: [
      { name: "group", param: false },
      { name: "groupId", param: true },
    ],
  });
});

test("getMatcher decrements the ranking by 1 if the path is not finite", () => {
  getMatcherEqual("usersArea", "/groups/:groupId/users/*", {
    finite: false,
    ranking: 19,
    search: {},
    segments: [
      { name: "groups", param: false },
      { name: "groupId", param: true },
      { name: "users", param: false },
    ],
  });

  getMatcherEqual("users", "/groups/:groupId/users", {
    finite: true,
    ranking: 20,
    search: {},
    segments: [
      { name: "groups", param: false },
      { name: "groupId", param: true },
      { name: "users", param: false },
    ],
  });
});

test("match extract route params and matches against a matcher", () => {
  matchEqual("/groups", {
    name: "groups",
    params: {},
  });

  matchEqual("/groups/github", {
    name: "group",
    params: { groupId: "github" },
  });

  matchEqual("/groups/mine", {
    name: "myGroup",
    params: {},
  });

  matchEqual("/groups/github/users/nested", {
    name: "usersArea",
    params: { groupId: "github" },
  });

  matchEqual("/groups/github/users", {
    name: "users",
    params: { groupId: "github" },
  });
});

test("match returns undefined in case of no route match", () => {
  matchEqual("/repositories/:repositoryId", undefined);
  matchEqual("/bills/:billId", undefined);
});
