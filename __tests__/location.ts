import { decodeLocation } from "../src/location";
import { getHistoryLocation } from "./utils";

test("decodeLocation with well-formed paths", () => {
  const equal = <E>(path: string, expected: E) =>
    expect(decodeLocation(getHistoryLocation(path), false)).toStrictEqual(
      expected,
    );

  equal("/", {
    path: [],
    search: {},
    url: "/",
  });

  equal("/test", {
    path: ["test"],
    search: {},
    url: "/test",
  });

  equal("/test/ID", {
    path: ["test", "ID"],
    search: {},
    url: "/test/ID",
  });

  equal("/test/repositories/mine", {
    path: ["test", "repositories", "mine"],
    search: {},
    url: "/test/repositories/mine",
  });

  equal("/test#foo", {
    path: ["test"],
    search: {},
    hash: "foo",
    url: "/test#foo",
  });

  equal("/profile/settings?invitation=code", {
    path: ["profile", "settings"],
    search: { invitation: "code" },
    url: "/profile/settings?invitation=code",
  });

  equal("/test?filters=foo&filters=bar", {
    path: ["test"],
    search: { filters: ["foo", "bar"] },
    url: "/test?filters=foo&filters=bar",
  });
});

test("decodeLocation with empty params", () => {
  const equal = <E>(path: string, expected: E) =>
    expect(decodeLocation(getHistoryLocation(path), false)).toStrictEqual(
      expected,
    );

  equal("/?#", {
    path: [],
    search: {},
    hash: "",
    url: "/#",
  });

  equal("/test?", {
    path: ["test"],
    search: {},
    url: "/test",
  });

  equal("/test?foo", {
    path: ["test"],
    search: { foo: "" },
    url: "/test?foo",
  });

  equal("/test?foo=", {
    path: ["test"],
    search: { foo: "" },
    url: "/test?foo",
  });

  equal("/test?foo=&foo", {
    path: ["test"],
    search: { foo: ["", ""] },
    url: "/test?foo&foo",
  });

  equal("/test#", {
    path: ["test"],
    search: {},
    hash: "",
    url: "/test#",
  });
});

test("decodeLocation with unescaped chars", () => {
  const equal = <E>(path: string, expected: E) =>
    expect(decodeLocation(getHistoryLocation(path), false)).toStrictEqual(
      expected,
    );

  equal("/:test+", {
    path: [":test+"],
    search: {},
    url: "/%3Atest%2B",
  });

  equal("/test??foo", {
    path: ["test"],
    search: { "?foo": "" },
    url: "/test?%3Ffoo",
  });

  equal("/test?foo=?", {
    path: ["test"],
    search: { foo: "?" },
    url: "/test?foo=%3F",
  });

  equal("/test##+foo", {
    path: ["test"],
    search: {},
    hash: "#+foo",
    url: "/test#%23%2Bfoo",
  });
});

test("decodeLocation with extra slashes (without cleaning)", () => {
  const equal = <E>(path: string, expected: E) =>
    expect(decodeLocation(getHistoryLocation(path), false)).toStrictEqual(
      expected,
    );

  equal("///", {
    path: ["", "", ""],
    search: {},
    url: "///",
  });

  equal("/test/", {
    path: ["test", ""],
    search: {},
    url: "/test/",
  });

  equal("/test/?foo", {
    path: ["test", ""],
    search: { foo: "" },
    url: "/test/?foo",
  });

  equal("//profile//settings?invitation=/", {
    path: ["", "profile", "", "settings"],
    search: { invitation: "/" },
    url: "//profile//settings?invitation=%2F",
  });
});

test("decodeLocation with extra slashes (with cleaning)", () => {
  const equal = <E>(path: string, expected: E) =>
    expect(decodeLocation(getHistoryLocation(path), true)).toStrictEqual(
      expected,
    );

  equal("///", {
    path: [],
    search: {},
    url: "/",
  });

  equal("/test/", {
    path: ["test"],
    search: {},
    url: "/test",
  });

  equal("/test/?foo", {
    path: ["test"],
    search: { foo: "" },
    url: "/test?foo",
  });

  equal("//profile//settings?invitation=/", {
    path: ["profile", "settings"],
    search: { invitation: "/" },
    url: "/profile/settings?invitation=%2F",
  });
});
