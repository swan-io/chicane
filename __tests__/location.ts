import { decodeLocation } from "../src/location";
import { getHistoryLocation } from "./utils";

const getEqual =
  (removeExtraSlashes: boolean) =>
  <E>(path: string, expected: E) =>
    expect(
      decodeLocation(getHistoryLocation(path), removeExtraSlashes),
    ).toStrictEqual(expected);

test("decodeLocation parses well-formed paths properly", () => {
  const equal = getEqual(false);

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

test("decodeLocation parses route with empty params properly", () => {
  const equal = getEqual(false);

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

test("decodeLocation parses URI components (and encode it back for url)", () => {
  const equal = getEqual(false);

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

test("decodeLocation keeps extra slashes when removeExtraSlashes is false", () => {
  const equal = getEqual(false);

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

test("decodeLocation removes extra slashes when removeExtraSlashes is true", () => {
  const equal = getEqual(true);

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
