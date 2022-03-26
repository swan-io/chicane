import { getMatcher, match } from "../src/matcher";
import { getLocation } from "./utils";

const getMatcherEqual = <E>(name: string, route: string, expected: E) =>
  expect(getMatcher(name, route)).toStrictEqual({ name, ...expected });

const matchers = [
  getMatcher("Groups", "/groups"),
  getMatcher("Group", "/groups/:groupId"),
  getMatcher("MyGroup", "/groups/mine"),
  getMatcher("UsersArea", "/groups/:groupId/users/*"),
  getMatcher("Users", "/groups/:groupId/users"),
].sort((a, b) => b.ranking - a.ranking); // we sort the matchers since match doesn't do it at each call

const matchEqual = <E>(path: string, expected: E) =>
  expect(match(getLocation(path), matchers)).toStrictEqual(expected);

test("getMatcher returns a proper matcher structure for paths without params", () => {
  getMatcherEqual("Groups", "/groups", {
    finite: true,
    ranking: 7,
    search: {},
    pathParams: [],
    segments: [{ name: "groups", param: false }],
  });

  getMatcherEqual("MyGroup", "/groups/mine", {
    finite: true,
    ranking: 14,
    search: {},
    pathParams: [],
    segments: [
      { name: "groups", param: false },
      { name: "mine", param: false },
    ],
  });
});

test("getMatcher returns a proper matcher structure for paths with params (in path only)", () => {
  getMatcherEqual("Group", "/group/:groupId", {
    finite: true,
    ranking: 13,
    search: {},
    pathParams: ["groupId"],
    segments: [
      { name: "group", param: false },
      { name: "groupId", param: true },
    ],
  });

  getMatcherEqual("Users", "/groups/:groupId/users", {
    finite: true,
    ranking: 20,
    search: {},
    pathParams: ["groupId"],
    segments: [
      { name: "groups", param: false },
      { name: "groupId", param: true },
      { name: "users", param: false },
    ],
  });
});

test("getMatcher returns a proper matcher structure for paths with params (in path, search and hash)", () => {
  getMatcherEqual("Group", "/group/:groupId?:foo&:bar[]#:baz", {
    finite: true,
    ranking: 13,
    hash: "baz",
    search: { foo: "unique", bar: "multiple" },
    pathParams: ["groupId"],
    segments: [
      { name: "group", param: false },
      { name: "groupId", param: true },
    ],
  });
});

test("getMatcher decrements the ranking by 1 if the path is not finite", () => {
  getMatcherEqual("UsersArea", "/groups/:groupId/users/*", {
    finite: false,
    ranking: 19,
    search: {},
    pathParams: ["groupId"],
    segments: [
      { name: "groups", param: false },
      { name: "groupId", param: true },
      { name: "users", param: false },
    ],
  });

  getMatcherEqual("Users", "/groups/:groupId/users", {
    finite: true,
    ranking: 20,
    search: {},
    pathParams: ["groupId"],
    segments: [
      { name: "groups", param: false },
      { name: "groupId", param: true },
      { name: "users", param: false },
    ],
  });
});

test("match extract route params and matches against a matcher", () => {
  matchEqual("/groups", {
    name: "Groups",
    params: {},
  });

  matchEqual("/groups/github", {
    name: "Group",
    params: { groupId: "github" },
  });

  matchEqual("/groups/mine", {
    name: "MyGroup",
    params: {},
  });

  matchEqual("/groups/github/users/nested", {
    name: "UsersArea",
    params: { groupId: "github" },
  });

  matchEqual("/groups/github/users", {
    name: "Users",
    params: { groupId: "github" },
  });
});

test("match returns undefined in case of no route match", () => {
  matchEqual("/repositories/:repositoryId", undefined);
  matchEqual("/bills/:billId", undefined);
});
