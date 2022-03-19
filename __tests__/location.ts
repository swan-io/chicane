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
    raw: {
      path: "/",
      search: "",
      hash: "",
    },
  });

  equal("/test", {
    path: ["test"],
    search: {},
    url: "/test",
    raw: {
      path: "/test",
      search: "",
      hash: "",
    },
  });

  equal("/test/ID", {
    path: ["test", "ID"],
    search: {},
    url: "/test/ID",
    raw: {
      path: "/test/ID",
      search: "",
      hash: "",
    },
  });

  equal("/test/repositories/mine", {
    path: ["test", "repositories", "mine"],
    search: {},
    url: "/test/repositories/mine",
    raw: {
      path: "/test/repositories/mine",
      search: "",
      hash: "",
    },
  });

  equal("/test#foo", {
    path: ["test"],
    search: {},
    hash: "foo",
    url: "/test#foo",
    raw: {
      path: "/test",
      search: "",
      hash: "#foo",
    },
  });

  equal("/profile/settings?invitation=code", {
    path: ["profile", "settings"],
    search: { invitation: "code" },
    url: "/profile/settings?invitation=code",
    raw: {
      path: "/profile/settings",
      search: "?invitation=code",
      hash: "",
    },
  });

  equal("/test?filters=foo&filters=bar", {
    path: ["test"],
    search: { filters: ["foo", "bar"] },
    url: "/test?filters=foo&filters=bar",
    raw: {
      path: "/test",
      search: "?filters=foo&filters=bar",
      hash: "",
    },
  });
});

test("decodeLocation parses route with empty params properly", () => {
  const equal = getEqual(false);

  equal("/?#", {
    path: [],
    search: {},
    hash: "",
    url: "/#",
    raw: {
      path: "/",
      search: "",
      hash: "#",
    },
  });

  equal("/test?", {
    path: ["test"],
    search: {},
    url: "/test",
    raw: {
      path: "/test",
      search: "",
      hash: "",
    },
  });

  equal("/test?foo", {
    path: ["test"],
    search: { foo: "" },
    url: "/test?foo",
    raw: {
      path: "/test",
      search: "?foo",
      hash: "",
    },
  });

  equal("/test?foo=", {
    path: ["test"],
    search: { foo: "" },
    url: "/test?foo",
    raw: {
      path: "/test",
      search: "?foo",
      hash: "",
    },
  });

  equal("/test?foo=&foo", {
    path: ["test"],
    search: { foo: ["", ""] },
    url: "/test?foo&foo",
    raw: {
      path: "/test",
      search: "?foo&foo",
      hash: "",
    },
  });

  equal("/test#", {
    path: ["test"],
    search: {},
    hash: "",
    url: "/test#",
    raw: {
      path: "/test",
      search: "",
      hash: "#",
    },
  });
});

test("decodeLocation parses URI components (and encode it back for url)", () => {
  const equal = getEqual(false);

  equal("/:test+", {
    path: [":test+"],
    search: {},
    url: "/%3Atest%2B",
    raw: {
      path: "/%3Atest%2B",
      search: "",
      hash: "",
    },
  });

  equal("/test??foo", {
    path: ["test"],
    search: { "?foo": "" },
    url: "/test?%3Ffoo",
    raw: {
      path: "/test",
      search: "?%3Ffoo",
      hash: "",
    },
  });

  equal("/test?foo=?", {
    path: ["test"],
    search: { foo: "?" },
    url: "/test?foo=%3F",
    raw: {
      path: "/test",
      search: "?foo=%3F",
      hash: "",
    },
  });

  equal("/test##+foo", {
    path: ["test"],
    search: {},
    hash: "#+foo",
    url: "/test#%23%2Bfoo",
    raw: {
      path: "/test",
      search: "",
      hash: "#%23%2Bfoo",
    },
  });
});

test("decodeLocation keeps extra slashes when removeExtraSlashes is false", () => {
  const equal = getEqual(false);

  equal("///", {
    path: ["", "", ""],
    search: {},
    url: "///",
    raw: {
      path: "///",
      search: "",
      hash: "",
    },
  });

  equal("/test/", {
    path: ["test", ""],
    search: {},
    url: "/test/",
    raw: {
      path: "/test/",
      search: "",
      hash: "",
    },
  });

  equal("/test/?foo", {
    path: ["test", ""],
    search: { foo: "" },
    url: "/test/?foo",
    raw: {
      path: "/test/",
      search: "?foo",
      hash: "",
    },
  });

  equal("//profile//settings?invitation=/", {
    path: ["", "profile", "", "settings"],
    search: { invitation: "/" },
    url: "//profile//settings?invitation=%2F",
    raw: {
      path: "//profile//settings",
      search: "?invitation=%2F",
      hash: "",
    },
  });
});

test("decodeLocation removes extra slashes when removeExtraSlashes is true", () => {
  const equal = getEqual(true);

  equal("///", {
    path: [],
    search: {},
    url: "/",
    raw: {
      path: "/",
      search: "",
      hash: "",
    },
  });

  equal("/test/", {
    path: ["test"],
    search: {},
    url: "/test",
    raw: {
      path: "/test",
      search: "",
      hash: "",
    },
  });

  equal("/test/?foo", {
    path: ["test"],
    search: { foo: "" },
    url: "/test?foo",
    raw: {
      path: "/test",
      search: "?foo",
      hash: "",
    },
  });

  equal("//profile//settings?invitation=/", {
    path: ["profile", "settings"],
    search: { invitation: "/" },
    url: "/profile/settings?invitation=%2F",
    raw: {
      path: "/profile/settings",
      search: "?invitation=%2F",
      hash: "",
    },
  });
});
