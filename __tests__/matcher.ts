import { expect, test } from "vitest";
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
    isArea: false,
    ranking: 9,
    path: ["groups"],
    search: undefined,
    hash: undefined,
  });

  getMatcherEqual("MyGroup", "/groups/mine", {
    isArea: false,
    ranking: 18,
    path: ["groups", "mine"],
    search: undefined,
    hash: undefined,
  });
});

test("getMatcher returns a proper matcher structure for paths with params (in path only)", () => {
  getMatcherEqual("Group", "/group/:groupId", {
    isArea: false,
    ranking: 16,
    path: ["group", { name: "groupId" }],
    search: undefined,
    hash: undefined,
  });

  getMatcherEqual("Users", "/groups/:groupId/users", {
    isArea: false,
    ranking: 25,
    path: ["groups", { name: "groupId" }, "users"],
    search: undefined,
    hash: undefined,
  });
});

test("getMatcher returns a proper matcher structure for paths with params (in path, search and hash)", () => {
  getMatcherEqual("Group", "/group/:groupId?:foo&:bar[]#:baz", {
    isArea: false,
    ranking: 16,
    path: ["group", { name: "groupId" }],
    search: { foo: { multiple: false }, bar: { multiple: true } },
    hash: { name: "baz" },
  });
});

test("getMatcher decrements the ranking by 1 if the path is an area", () => {
  getMatcherEqual("UsersArea", "/groups/:groupId/users/*", {
    isArea: true,
    ranking: 24,
    path: ["groups", { name: "groupId" }, "users"],
    search: undefined,
    hash: undefined,
  });

  getMatcherEqual("UsersArea", "/groups/:groupId/users/*?:foo&:bar[]", {
    isArea: true,
    ranking: 24,
    path: ["groups", { name: "groupId" }, "users"],
    search: { foo: { multiple: false }, bar: { multiple: true } },
    hash: undefined,
  });

  getMatcherEqual("Users", "/groups/:groupId/users", {
    isArea: false,
    ranking: 25,
    path: ["groups", { name: "groupId" }, "users"],
    search: undefined,
    hash: undefined,
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
