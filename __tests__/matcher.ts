import { randomUUID } from "crypto";
import { expect, test } from "vitest";
import { decodeLocation } from "../src/history";
import { getMatcher, match } from "../src/matcher";

const getMatcherEqual = <E>(route: string, expected: E) => {
  const name = randomUUID();
  return expect(getMatcher(name, route)).toStrictEqual({ name, ...expected });
};

test("getMatcher returns a proper matcher structure for paths without params", () => {
  getMatcherEqual("/groups", {
    isArea: false,
    ranking: 9,
    path: ["groups"],
    search: undefined,
  });

  getMatcherEqual("/groups/mine", {
    isArea: false,
    ranking: 18,
    path: ["groups", "mine"],
    search: undefined,
  });
});

test("getMatcher returns a proper matcher structure for paths with params (in path only)", () => {
  getMatcherEqual("/group/:groupId", {
    isArea: false,
    ranking: 16,
    path: ["group", { name: "groupId" }],
    search: undefined,
  });

  getMatcherEqual("/groups/:groupId/users", {
    isArea: false,
    ranking: 25,
    path: ["groups", { name: "groupId" }, "users"],
    search: undefined,
  });

  getMatcherEqual("/projects/:projectId/:env{live|sandbox}", {
    isArea: false,
    ranking: 24,
    path: [
      "projects",
      { name: "projectId" },
      { name: "env", union: ["live", "sandbox"] },
    ],
    search: undefined,
  });
});

test("getMatcher returns a proper matcher structure for paths with params (in path and search)", () => {
  getMatcherEqual("/group/:groupId?:foo&:bar[]#:baz", {
    isArea: false,
    ranking: 16,
    path: ["group", { name: "groupId" }],
    search: {
      foo: { multiple: false },
      bar: { multiple: true },
    },
  });

  getMatcherEqual("/group/:groupId?:foo{a|b}&:bar{c|d}[]#:baz{e|f}", {
    isArea: false,
    ranking: 16,
    path: ["group", { name: "groupId" }],
    search: {
      foo: { multiple: false, union: ["a", "b"] },
      bar: { multiple: true, union: ["c", "d"] },
    },
  });
});

test("getMatcher decrements the ranking by 1 if the path is an area", () => {
  getMatcherEqual("/groups/:groupId/users/*", {
    isArea: true,
    ranking: 24,
    path: ["groups", { name: "groupId" }, "users"],
    search: undefined,
  });

  getMatcherEqual("/groups/:groupId/users/*?:foo&:bar[]", {
    isArea: true,
    ranking: 24,
    path: ["groups", { name: "groupId" }, "users"],
    search: {
      foo: { multiple: false },
      bar: { multiple: true },
    },
  });

  getMatcherEqual("/groups/:groupId/users", {
    isArea: false,
    ranking: 25,
    path: ["groups", { name: "groupId" }, "users"],
    search: undefined,
  });

  getMatcherEqual("/groups/:groupId/users", {
    isArea: false,
    ranking: 25,
    path: ["groups", { name: "groupId" }, "users"],
    search: undefined,
  });

  getMatcherEqual(
    "/groups?:orderBy{asc|desc}&:status{disabled|enabled|pending}[]",
    {
      isArea: false,
      ranking: 9,
      path: ["groups"],
      search: {
        orderBy: {
          multiple: false,
          union: ["asc", "desc"],
        },
        status: {
          multiple: true,
          union: ["disabled", "enabled", "pending"],
        },
      },
    },
  );
});

const matchers = [
  getMatcher(
    "Groups",
    "/groups?:orderBy{asc|desc}&:status{disabled|enabled|pending}[]",
  ),
  getMatcher("Group", "/groups/:groupId"),
  getMatcher("MyGroup", "/groups/mine"),
  getMatcher("UsersArea", "/groups/:groupId/users/*"),
  getMatcher("Users", "/groups/:groupId/users"),
  getMatcher("Project", "/projects/:projectId/:env{live|sandbox}"),
].sort((a, b) => b.ranking - a.ranking); // we sort the matchers since match doesn't do it at each call

const matchEqual = <E>(path: string, expected: E) =>
  expect(match(decodeLocation(path), matchers)).toStrictEqual(expected);

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

  matchEqual("/groups?orderBy=asc", {
    name: "Groups",
    params: { orderBy: "asc" },
  });

  matchEqual("/groups?orderBy=asc&orderBy=desc", {
    name: "Groups",
    params: { orderBy: "asc" },
  });

  matchEqual("/groups?orderBy=invalid", {
    name: "Groups",
    params: {},
  });

  matchEqual("/groups?orderBy=invalid&orderBy=desc", {
    name: "Groups",
    params: { orderBy: "desc" },
  });

  matchEqual("/groups?status=disabled&status=pending", {
    name: "Groups",
    params: { status: ["disabled", "pending"] },
  });

  matchEqual("/groups?status=invalid&status=pending", {
    name: "Groups",
    params: { status: ["pending"] },
  });

  matchEqual("/projects/swan/live", {
    name: "Project",
    params: { projectId: "swan", env: "live" },
  });
});

test("match returns undefined in case of no route match", () => {
  matchEqual("/repositories/:repositoryId", undefined);
  matchEqual("/bills/:billId", undefined);
  matchEqual("/projects/swan/invalid", undefined);
});
