import { decodeLocation } from "../src/location";
import { getHistoryLocation } from "./utils";

const getEqual =
  (removeExtraSlashes: boolean) =>
  <E>(path: string, sanitized: string, location: E) => {
    const value = decodeLocation(getHistoryLocation(path), removeExtraSlashes);
    const { toString, ...raw } = value.raw;
    expect(toString()).toStrictEqual(sanitized);
    expect({ ...value, raw }).toStrictEqual(location);
  };

test("decodeLocation parses well-formed paths properly", () => {
  const equal = getEqual(false);

  equal("/", "/", {
    path: [],
    search: {},
    raw: {
      path: "/",
      search: "",
      hash: "",
    },
  });

  equal("/test", "/test", {
    path: ["test"],
    search: {},
    raw: {
      path: "/test",
      search: "",
      hash: "",
    },
  });

  equal("/test/ID", "/test/ID", {
    path: ["test", "ID"],
    search: {},
    raw: {
      path: "/test/ID",
      search: "",
      hash: "",
    },
  });

  equal("/test/repositories/mine", "/test/repositories/mine", {
    path: ["test", "repositories", "mine"],
    search: {},
    raw: {
      path: "/test/repositories/mine",
      search: "",
      hash: "",
    },
  });

  equal("/test#foo", "/test#foo", {
    path: ["test"],
    search: {},
    hash: "foo",
    raw: {
      path: "/test",
      search: "",
      hash: "#foo",
    },
  });

  equal(
    "/profile/settings?invitation=code",
    "/profile/settings?invitation=code",
    {
      path: ["profile", "settings"],
      search: { invitation: "code" },
      raw: {
        path: "/profile/settings",
        search: "?invitation=code",
        hash: "",
      },
    },
  );

  equal("/test?filters=foo&filters=bar", "/test?filters=foo&filters=bar", {
    path: ["test"],
    search: { filters: ["foo", "bar"] },
    raw: {
      path: "/test",
      search: "?filters=foo&filters=bar",
      hash: "",
    },
  });
});

test("decodeLocation parses route with empty params properly", () => {
  const equal = getEqual(false);

  equal("/?#", "/#", {
    path: [],
    search: {},
    hash: "",
    raw: {
      path: "/",
      search: "",
      hash: "#",
    },
  });

  equal("/test?", "/test", {
    path: ["test"],
    search: {},
    raw: {
      path: "/test",
      search: "",
      hash: "",
    },
  });

  equal("/test?foo", "/test?foo", {
    path: ["test"],
    search: { foo: "" },
    raw: {
      path: "/test",
      search: "?foo",
      hash: "",
    },
  });

  equal("/test?foo=", "/test?foo", {
    path: ["test"],
    search: { foo: "" },
    raw: {
      path: "/test",
      search: "?foo",
      hash: "",
    },
  });

  equal("/test?foo=&foo", "/test?foo&foo", {
    path: ["test"],
    search: { foo: ["", ""] },
    raw: {
      path: "/test",
      search: "?foo&foo",
      hash: "",
    },
  });

  equal("/test#", "/test#", {
    path: ["test"],
    search: {},
    hash: "",
    raw: {
      path: "/test",
      search: "",
      hash: "#",
    },
  });
});

test("decodeLocation parses URI components (and encode it back for url)", () => {
  const equal = getEqual(false);

  equal("/:test+", "/%3Atest%2B", {
    path: [":test+"],
    search: {},
    raw: {
      path: "/%3Atest%2B",
      search: "",
      hash: "",
    },
  });

  equal("/test??foo", "/test?%3Ffoo", {
    path: ["test"],
    search: { "?foo": "" },
    raw: {
      path: "/test",
      search: "?%3Ffoo",
      hash: "",
    },
  });

  equal("/test?foo=?", "/test?foo=%3F", {
    path: ["test"],
    search: { foo: "?" },
    raw: {
      path: "/test",
      search: "?foo=%3F",
      hash: "",
    },
  });

  equal("/test##+foo", "/test#%23%2Bfoo", {
    path: ["test"],
    search: {},
    hash: "#+foo",
    raw: {
      path: "/test",
      search: "",
      hash: "#%23%2Bfoo",
    },
  });
});

test("decodeLocation keeps extra slashes when removeExtraSlashes is false", () => {
  const equal = getEqual(false);

  equal("///", "///", {
    path: ["", "", ""],
    search: {},
    raw: {
      path: "///",
      search: "",
      hash: "",
    },
  });

  equal("/test/", "/test/", {
    path: ["test", ""],
    search: {},
    raw: {
      path: "/test/",
      search: "",
      hash: "",
    },
  });

  equal("/test/?foo", "/test/?foo", {
    path: ["test", ""],
    search: { foo: "" },
    raw: {
      path: "/test/",
      search: "?foo",
      hash: "",
    },
  });

  equal(
    "//profile//settings?invitation=/",
    "//profile//settings?invitation=%2F",
    {
      path: ["", "profile", "", "settings"],
      search: { invitation: "/" },
      raw: {
        path: "//profile//settings",
        search: "?invitation=%2F",
        hash: "",
      },
    },
  );
});

test("decodeLocation removes extra slashes when removeExtraSlashes is true", () => {
  const equal = getEqual(true);

  equal("///", "/", {
    path: [],
    search: {},
    raw: {
      path: "/",
      search: "",
      hash: "",
    },
  });

  equal("/test/", "/test", {
    path: ["test"],
    search: {},
    raw: {
      path: "/test",
      search: "",
      hash: "",
    },
  });

  equal("/test/?foo", "/test?foo", {
    path: ["test"],
    search: { foo: "" },
    raw: {
      path: "/test",
      search: "?foo",
      hash: "",
    },
  });

  equal(
    "//profile//settings?invitation=/",
    "/profile/settings?invitation=%2F",
    {
      path: ["profile", "settings"],
      search: { invitation: "/" },
      raw: {
        path: "/profile/settings",
        search: "?invitation=%2F",
        hash: "",
      },
    },
  );
});
