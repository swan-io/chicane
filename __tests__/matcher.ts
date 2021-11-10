import { getMatcher, match } from "../src/matcher";
import { getLocation } from "./utils";

test("getMatcher", () => {
  expect(getMatcher("groups", "/groups")).toStrictEqual({
    name: "groups",
    finite: true,
    ranking: 7,
    search: {},
    segments: [{ name: "groups", param: false }],
  });

  expect(getMatcher("group", "/group/:groupId?:foo&:bar[]#:baz")).toStrictEqual(
    {
      name: "group",
      finite: true,
      ranking: 13,
      hash: "baz",
      search: { foo: "unique", bar: "multiple" },
      segments: [
        { name: "group", param: false },
        { name: "groupId", param: true },
      ],
    },
  );

  expect(getMatcher("myGroup", "/groups/mine")).toStrictEqual({
    name: "myGroup",
    finite: true,
    ranking: 14,
    search: {},
    segments: [
      { name: "groups", param: false },
      { name: "mine", param: false },
    ],
  });

  expect(getMatcher("users*", "/groups/:groupId/users*")).toStrictEqual({
    name: "users*",
    finite: false,
    ranking: 19,
    search: {},
    segments: [
      { name: "groups", param: false },
      { name: "groupId", param: true },
      { name: "users", param: false },
    ],
  });

  expect(getMatcher("users", "/groups/:groupId/users")).toStrictEqual({
    name: "users",
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
    getMatcher("users*", "/groups/:groupId/users*"),
    getMatcher("users", "/groups/:groupId/users"),
  ].sort((a, b) => b.ranking - a.ranking);

  expect(match(getLocation("/groups"), matchers)).toStrictEqual({
    name: "groups",
    params: {},
  });

  expect(match(getLocation("/groups/github"), matchers)).toStrictEqual({
    name: "group",
    params: { groupId: "github" },
  });

  expect(match(getLocation("/groups/mine"), matchers)).toStrictEqual({
    name: "myGroup",
    params: {},
  });

  expect(
    match(getLocation("/groups/github/users/nested"), matchers),
  ).toStrictEqual({
    name: "users*",
    params: { groupId: "github" },
  });

  expect(match(getLocation("/groups/github/users"), matchers)).toStrictEqual({
    name: "users",
    params: { groupId: "github" },
  });
});
