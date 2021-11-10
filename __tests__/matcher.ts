import { getMatcher, match } from "../src/matcher";
import { getLocation } from "./utils";

test("getMatcher", () => {
  const equal = <E>(name: string, route: string, expected: E) =>
    expect(getMatcher(name, route)).toStrictEqual({ name, ...expected });

  equal("groups", "/groups", {
    finite: true,
    ranking: 7,
    search: {},
    segments: [{ name: "groups", param: false }],
  });

  equal("group", "/group/:groupId?:foo&:bar[]#:baz", {
    finite: true,
    ranking: 13,
    hash: "baz",
    search: { foo: "unique", bar: "multiple" },
    segments: [
      { name: "group", param: false },
      { name: "groupId", param: true },
    ],
  });

  equal("myGroup", "/groups/mine", {
    finite: true,
    ranking: 14,
    search: {},
    segments: [
      { name: "groups", param: false },
      { name: "mine", param: false },
    ],
  });

  equal("usersArea", "/groups/:groupId/users/*", {
    finite: false,
    ranking: 19,
    search: {},
    segments: [
      { name: "groups", param: false },
      { name: "groupId", param: true },
      { name: "users", param: false },
    ],
  });

  equal("users", "/groups/:groupId/users", {
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

test("match", () => {
  const matchers = [
    getMatcher("groups", "/groups"),
    getMatcher("group", "/groups/:groupId"),
    getMatcher("myGroup", "/groups/mine"),
    getMatcher("usersArea", "/groups/:groupId/users/*"),
    getMatcher("users", "/groups/:groupId/users"),
  ].sort((a, b) => b.ranking - a.ranking);

  const equal = <E>(path: string, expected: E) =>
    expect(match(getLocation(path), matchers)).toStrictEqual(expected);

  equal("/groups", {
    name: "groups",
    params: {},
  });

  equal("/groups/github", {
    name: "group",
    params: { groupId: "github" },
  });

  equal("/groups/mine", {
    name: "myGroup",
    params: {},
  });

  equal("/groups/github/users/nested", {
    name: "usersArea",
    params: { groupId: "github" },
  });

  equal("/groups/github/users", {
    name: "users",
    params: { groupId: "github" },
  });
});
