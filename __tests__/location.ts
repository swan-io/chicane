import { decodeLocation } from "../src/location";
import { getHistoryLocation } from "./utils";

const getEqual =
  (removeExtraSlashes: boolean) =>
  <E>(path: string, sanitized: string, location: E) => {
    const { toString, ...value } = decodeLocation(
      getHistoryLocation(path),
      removeExtraSlashes,
    );

    expect(toString()).toStrictEqual(sanitized);
    expect(value).toStrictEqual(location);
  };

test("decodeLocation parses well-formed paths properly", () => {
  const equal = getEqual(false);

  equal("/", "/", {
    key: "1vr879e-0",
    path: [],
    search: {},
    raw: {
      path: "/",
      search: "",
      hash: "",
    },
  });

  equal("/test", "/test", {
    key: "15r3z8l-0",
    path: ["test"],
    search: {},
    raw: {
      path: "/test",
      search: "",
      hash: "",
    },
  });

  equal("/test/ID", "/test/ID", {
    key: "1t85fsm-0",
    path: ["test", "ID"],
    search: {},
    raw: {
      path: "/test/ID",
      search: "",
      hash: "",
    },
  });

  equal("/test/repositories/mine", "/test/repositories/mine", {
    key: "2tnzaa-0",
    path: ["test", "repositories", "mine"],
    search: {},
    raw: {
      path: "/test/repositories/mine",
      search: "",
      hash: "",
    },
  });

  equal("/test#foo", "/test#foo", {
    key: "15r3z8l-vqe7l8",
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
      key: "hvvndr-1mfzit5",
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
    key: "15r3z8l-1iu5pw9",
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
    key: "1vr879e-wm3gqk",
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
    key: "15r3z8l-0",
    path: ["test"],
    search: {},
    raw: {
      path: "/test",
      search: "",
      hash: "",
    },
  });

  equal("/test?foo", "/test?foo", {
    key: "15r3z8l-1xxto3f",
    path: ["test"],
    search: { foo: "" },
    raw: {
      path: "/test",
      search: "?foo",
      hash: "",
    },
  });

  equal("/test?foo=", "/test?foo", {
    key: "15r3z8l-1xxto3f",
    path: ["test"],
    search: { foo: "" },
    raw: {
      path: "/test",
      search: "?foo",
      hash: "",
    },
  });

  equal("/test?foo=&foo", "/test?foo&foo", {
    key: "15r3z8l-d9a9pr",
    path: ["test"],
    search: { foo: ["", ""] },
    raw: {
      path: "/test",
      search: "?foo&foo",
      hash: "",
    },
  });

  equal("/test#", "/test#", {
    key: "15r3z8l-wm3gqk",
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
    key: "uo6seg-0",
    path: [":test+"],
    search: {},
    raw: {
      path: "/%3Atest%2B",
      search: "",
      hash: "",
    },
  });

  equal("/test??foo", "/test?%3Ffoo", {
    key: "15r3z8l-md9mo5",
    path: ["test"],
    search: { "?foo": "" },
    raw: {
      path: "/test",
      search: "?%3Ffoo",
      hash: "",
    },
  });

  equal("/test?foo=?", "/test?foo=%3F", {
    key: "15r3z8l-5fvrh2",
    path: ["test"],
    search: { foo: "?" },
    raw: {
      path: "/test",
      search: "?foo=%3F",
      hash: "",
    },
  });

  equal("/test##+foo", "/test#%23%2Bfoo", {
    key: "15r3z8l-187n8mo",
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
    key: "1chjp8o-0",
    path: ["", "", ""],
    search: {},
    raw: {
      path: "///",
      search: "",
      hash: "",
    },
  });

  equal("/test/", "/test/", {
    key: "1xcznd3-0",
    path: ["test", ""],
    search: {},
    raw: {
      path: "/test/",
      search: "",
      hash: "",
    },
  });

  equal("/test/?foo", "/test/?foo", {
    key: "1xcznd3-1xxto3f",
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
      key: "1nmu3h0-2e1b3u",
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
    key: "1vr879e-0",
    path: [],
    search: {},
    raw: {
      path: "/",
      search: "",
      hash: "",
    },
  });

  equal("/test/", "/test", {
    key: "15r3z8l-0",
    path: ["test"],
    search: {},
    raw: {
      path: "/test",
      search: "",
      hash: "",
    },
  });

  equal("/test/?foo", "/test?foo", {
    key: "15r3z8l-1xxto3f",
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
      key: "hvvndr-2e1b3u",
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
