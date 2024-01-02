import { expect, test } from "vitest";
import { decodeLocation } from "../src/history";

const getEqual =
  (removeExtraPathSlashes: boolean) =>
  <E>(path: string, sanitized: string, location: E) => {
    const { toString, ...value } = decodeLocation(path, removeExtraPathSlashes);
    expect(value).toStrictEqual(location);
    expect(toString()).toStrictEqual(sanitized);
  };

test("decodeLocation parses well-formed paths properly", () => {
  const equal = getEqual(false);

  equal("/", "/", {
    path: [],
    search: {},
    raw: {
      path: "/",
      search: "",
    },
  });

  equal("/test", "/test", {
    path: ["test"],
    search: {},
    raw: {
      path: "/test",
      search: "",
    },
  });

  equal("/test/ID", "/test/ID", {
    path: ["test", "ID"],
    search: {},
    raw: {
      path: "/test/ID",
      search: "",
    },
  });

  equal("/test/repositories/mine", "/test/repositories/mine", {
    path: ["test", "repositories", "mine"],
    search: {},
    raw: {
      path: "/test/repositories/mine",
      search: "",
    },
  });

  equal("/test#foo", "/test", {
    path: ["test"],
    search: {},
    raw: {
      path: "/test",
      search: "",
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
      },
    },
  );

  equal("/test?filters=foo&filters=bar", "/test?filters=foo&filters=bar", {
    path: ["test"],
    search: { filters: ["foo", "bar"] },
    raw: {
      path: "/test",
      search: "?filters=foo&filters=bar",
    },
  });
});

test("decodeLocation parses route with empty params properly", () => {
  const equal = getEqual(false);

  equal("/?#", "/", {
    path: [],
    search: {},

    raw: {
      path: "/",
      search: "",
    },
  });

  equal("/test?", "/test", {
    path: ["test"],
    search: {},
    raw: {
      path: "/test",
      search: "",
    },
  });

  equal("/test?foo", "/test?foo", {
    path: ["test"],
    search: { foo: "" },
    raw: {
      path: "/test",
      search: "?foo",
    },
  });

  equal("/test?foo=", "/test?foo", {
    path: ["test"],
    search: { foo: "" },
    raw: {
      path: "/test",
      search: "?foo",
    },
  });

  equal("/test?foo=&foo", "/test?foo&foo", {
    path: ["test"],
    search: { foo: ["", ""] },
    raw: {
      path: "/test",
      search: "?foo&foo",
    },
  });

  equal("/test#", "/test", {
    path: ["test"],
    search: {},

    raw: {
      path: "/test",
      search: "",
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
    },
  });

  equal("/test??foo", "/test?%3Ffoo", {
    path: ["test"],
    search: { "?foo": "" },
    raw: {
      path: "/test",
      search: "?%3Ffoo",
    },
  });

  equal("/test?foo=?", "/test?foo=%3F", {
    path: ["test"],
    search: { foo: "?" },
    raw: {
      path: "/test",
      search: "?foo=%3F",
    },
  });

  equal("/test##+foo", "/test", {
    path: ["test"],
    search: {},
    raw: {
      path: "/test",
      search: "",
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
    },
  });

  equal("/test/", "/test/", {
    path: ["test", ""],
    search: {},
    raw: {
      path: "/test/",
      search: "",
    },
  });

  equal("/test/?foo", "/test/?foo", {
    path: ["test", ""],
    search: { foo: "" },
    raw: {
      path: "/test/",
      search: "?foo",
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
    },
  });

  equal("/test/", "/test", {
    path: ["test"],
    search: {},
    raw: {
      path: "/test",
      search: "",
    },
  });

  equal("/test/?foo", "/test?foo", {
    path: ["test"],
    search: { foo: "" },
    raw: {
      path: "/test",
      search: "?foo",
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
      },
    },
  );
});
