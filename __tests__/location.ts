import { expect, test } from "vitest";
import { decodeLocation, setInitialHasLocationChanged } from "../src/history";

const expectLocation = <E>(path: string, sanitized: string, location: E) => {
  const { toString, ...value } = decodeLocation(path);
  expect(value).toStrictEqual(location);
  expect(toString()).toStrictEqual(sanitized);
};

test("decodeLocation parses well-formed paths properly", () => {
  expectLocation("/", "/", {
    path: [],
    search: {},
    raw: {
      path: "/",
      search: "",
    },
  });

  expectLocation("/test", "/test", {
    path: ["test"],
    search: {},
    raw: {
      path: "/test",
      search: "",
    },
  });

  expectLocation("/test/ID", "/test/ID", {
    path: ["test", "ID"],
    search: {},
    raw: {
      path: "/test/ID",
      search: "",
    },
  });

  expectLocation("/test/repositories/mine", "/test/repositories/mine", {
    path: ["test", "repositories", "mine"],
    search: {},
    raw: {
      path: "/test/repositories/mine",
      search: "",
    },
  });

  expectLocation("/test#foo", "/test", {
    path: ["test"],
    search: {},
    raw: {
      path: "/test",
      search: "",
    },
  });

  expectLocation(
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

  expectLocation(
    "/test?filters=foo&filters=bar",
    "/test?filters=foo&filters=bar",
    {
      path: ["test"],
      search: { filters: ["foo", "bar"] },
      raw: {
        path: "/test",
        search: "?filters=foo&filters=bar",
      },
    },
  );
});

test("decodeLocation parses route with empty params properly", () => {
  expectLocation("/?#", "/", {
    path: [],
    search: {},

    raw: {
      path: "/",
      search: "",
    },
  });

  expectLocation("/test?", "/test", {
    path: ["test"],
    search: {},
    raw: {
      path: "/test",
      search: "",
    },
  });

  expectLocation("/test?foo", "/test?foo", {
    path: ["test"],
    search: { foo: "" },
    raw: {
      path: "/test",
      search: "?foo",
    },
  });

  expectLocation("/test?foo=", "/test?foo", {
    path: ["test"],
    search: { foo: "" },
    raw: {
      path: "/test",
      search: "?foo",
    },
  });

  expectLocation("/test?foo=&foo", "/test?foo&foo", {
    path: ["test"],
    search: { foo: ["", ""] },
    raw: {
      path: "/test",
      search: "?foo&foo",
    },
  });

  expectLocation("/test#", "/test", {
    path: ["test"],
    search: {},

    raw: {
      path: "/test",
      search: "",
    },
  });
});

test("decodeLocation parses URI components (and encode it back for url)", () => {
  expectLocation("/:test+", "/%3Atest%2B", {
    path: [":test+"],
    search: {},
    raw: {
      path: "/%3Atest%2B",
      search: "",
    },
  });

  expectLocation("/test??foo", "/test?%3Ffoo", {
    path: ["test"],
    search: { "?foo": "" },
    raw: {
      path: "/test",
      search: "?%3Ffoo",
    },
  });

  expectLocation("/test?foo=?", "/test?foo=%3F", {
    path: ["test"],
    search: { foo: "?" },
    raw: {
      path: "/test",
      search: "?foo=%3F",
    },
  });

  expectLocation("/test##+foo", "/test", {
    path: ["test"],
    search: {},
    raw: {
      path: "/test",
      search: "",
    },
  });
});

test("decodeLocation keeps extra slashes when initialLocationHasChanged is true", () => {
  setInitialHasLocationChanged(true);

  expectLocation("///", "///", {
    path: ["", "", ""],
    search: {},
    raw: {
      path: "///",
      search: "",
    },
  });

  expectLocation("/test/", "/test/", {
    path: ["test", ""],
    search: {},
    raw: {
      path: "/test/",
      search: "",
    },
  });

  expectLocation("/test/?foo", "/test/?foo", {
    path: ["test", ""],
    search: { foo: "" },
    raw: {
      path: "/test/",
      search: "?foo",
    },
  });

  expectLocation(
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

test("decodeLocation removes extra slashes when initialLocationHasChanged is false", () => {
  setInitialHasLocationChanged(false);

  expectLocation("///", "/", {
    path: [],
    search: {},
    raw: {
      path: "/",
      search: "",
    },
  });

  expectLocation("/test/", "/test", {
    path: ["test"],
    search: {},
    raw: {
      path: "/test",
      search: "",
    },
  });

  expectLocation("/test/?foo", "/test?foo", {
    path: ["test"],
    search: { foo: "" },
    raw: {
      path: "/test",
      search: "?foo",
    },
  });

  expectLocation(
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
