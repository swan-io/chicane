import { decodeLocation } from "../src/location";
import { getHistoryLocation } from "./utils";

test("decodeLocation with well-formed paths", () => {
  const strictEqual = <E>(path: string, expected: E) =>
    expect(decodeLocation(getHistoryLocation(path), false)).toStrictEqual(
      expected,
    );

  strictEqual("/", {
    path: [],
    search: {},
    url: "/",
  });

  strictEqual("/test", {
    path: ["test"],
    search: {},
    url: "/test",
  });

  strictEqual("/test/ID", {
    path: ["test", "ID"],
    search: {},
    url: "/test/ID",
  });

  strictEqual("/test/repositories/mine", {
    path: ["test", "repositories", "mine"],
    search: {},
    url: "/test/repositories/mine",
  });

  strictEqual("/test#foo", {
    path: ["test"],
    search: {},
    hash: "foo",
    url: "/test#foo",
  });

  strictEqual("/profile/settings?invitation=code", {
    path: ["profile", "settings"],
    search: { invitation: "code" },
    url: "/profile/settings?invitation=code",
  });

  strictEqual("/test?filters=foo&filters=bar", {
    path: ["test"],
    search: { filters: ["foo", "bar"] },
    url: "/test?filters=foo&filters=bar",
  });
});

test("decodeLocation with empty params", () => {
  const strictEqual = <E>(path: string, expected: E) =>
    expect(decodeLocation(getHistoryLocation(path), false)).toStrictEqual(
      expected,
    );

  strictEqual("/?#", {
    path: [],
    search: {},
    hash: "",
    url: "/#",
  });

  strictEqual("/test?", {
    path: ["test"],
    search: {},
    url: "/test",
  });

  strictEqual("/test?foo", {
    path: ["test"],
    search: { foo: "" },
    url: "/test?foo",
  });

  strictEqual("/test?foo=", {
    path: ["test"],
    search: { foo: "" },
    url: "/test?foo",
  });

  strictEqual("/test?foo=&foo", {
    path: ["test"],
    search: { foo: ["", ""] },
    url: "/test?foo&foo",
  });

  strictEqual("/test#", {
    path: ["test"],
    search: {},
    hash: "",
    url: "/test#",
  });
});

test("decodeLocation with unescaped chars", () => {
  const strictEqual = <E>(path: string, expected: E) =>
    expect(decodeLocation(getHistoryLocation(path), false)).toStrictEqual(
      expected,
    );

  strictEqual("/:test+", {
    path: [":test+"],
    search: {},
    url: "/%3Atest%2B",
  });

  strictEqual("/test??foo", {
    path: ["test"],
    search: { "?foo": "" },
    url: "/test?%3Ffoo",
  });

  strictEqual("/test?foo=?", {
    path: ["test"],
    search: { foo: "?" },
    url: "/test?foo=%3F",
  });

  strictEqual("/test##+foo", {
    path: ["test"],
    search: {},
    hash: "#+foo",
    url: "/test#%23%2Bfoo",
  });
});

test("decodeLocation with extra slashes (without cleaning)", () => {
  const strictEqual = <E>(path: string, expected: E) =>
    expect(decodeLocation(getHistoryLocation(path), false)).toStrictEqual(
      expected,
    );

  strictEqual("///", {
    path: ["", "", ""],
    search: {},
    url: "///",
  });

  strictEqual("/test/", {
    path: ["test", ""],
    search: {},
    url: "/test/",
  });

  strictEqual("/test/?foo", {
    path: ["test", ""],
    search: { foo: "" },
    url: "/test/?foo",
  });

  strictEqual("//profile//settings?invitation=/", {
    path: ["", "profile", "", "settings"],
    search: { invitation: "/" },
    url: "//profile//settings?invitation=%2F",
  });
});

test("decodeLocation with extra slashes (with cleaning)", () => {
  const strictEqual = <E>(path: string, expected: E) =>
    expect(decodeLocation(getHistoryLocation(path), true)).toStrictEqual(
      expected,
    );

  strictEqual("///", {
    path: [],
    search: {},
    url: "/",
  });

  strictEqual("/test/", {
    path: ["test"],
    search: {},
    url: "/test",
  });

  strictEqual("/test/?foo", {
    path: ["test"],
    search: { foo: "" },
    url: "/test?foo",
  });

  strictEqual("//profile//settings?invitation=/", {
    path: ["profile", "settings"],
    search: { invitation: "/" },
    url: "/profile/settings?invitation=%2F",
  });
});
