# react-chicane

[![mit licence](https://img.shields.io/dub/l/vibe-d.svg?style=for-the-badge)](https://github.com/zoontek/react-chicane/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/react-chicane?style=for-the-badge)](https://www.npmjs.org/package/react-chicane)
[![bundlephobia](https://img.shields.io/bundlephobia/minzip/react-chicane?label=size&style=for-the-badge)](https://bundlephobia.com/result?p=react-chicane)

A simple and safe router for React and TypeScript.

## Installation

```sh
yarn add react-chicane
```

## 📘 Usage

### Creating a router

This library exports only one function: `createRouter`. The goal behind this is to enforce listing all your project routes using fancy names in a file and use the strongly typed methods returned.

```tsx
import { createRouter } from "react-chicane";

const { useRoute } = createRouter({
  root: "/",
  users: "/users",
  user: "/users/:userId",
});

const App = () => {
  const route = useRoute(["root", "users", "user"]);

  if (!route) {
    return <h1>404</h1>;
  }

  // route object is a discriminated union
  switch (route.name) {
    case "root":
      return <h1>Homepage</h1>;
    case "users":
      return <h1>Users</h1>;
    case "user":
      // all path params are strongly typed
      return <h1>User {route.params.userId}</h1>;
  }
};
```

#### 👉 Note: I strongly recommand using a pattern matching library, like the excellent [ts-pattern](https://github.com/gvergnaud/ts-pattern).

#### ✍️ Path syntax

`react-chicane` doesn't bother about what's inside your path, your search params or your hash. It only exposes an object, `params`.

- A param in your path will result in a required `string`
- A param in your search or your hash will result in an optional `string`
- A mutiple param in your search will result in a optional `string[]`

```tsx
import { createRouter } from "react-chicane";

export const { useRoute } = createRouter({
  groups: "/groups",
  group: "/groups/:groupId?:foo&:bar[]#:baz",
  users: "/groups/:groupId/users",
  user: "/groups/:groupId/users/:userId",
  // it also supports wildcard routes!
  "users*": "/groups/:groupId/users*",
});

const App = () => {
  const route = useRoute(["groups", "group", "users", "user"]);

  if (!route) {
    return <h1>404</h1>;
  }

  switch (route.name) {
    case "groups":
      return route.params; // {}
    case "group":
      return route.params; // { groupId: string, foo?: string, bar?: string[], baz?: string }
    case "users":
      return route.params; // { groupId: string }
    case "user":
      return route.params; // { groupId: string, userId: string }
  }
};
```

#### 👉 Note: Non-param search and hash are not supported.

### 🔗 Creating URLs

Because it's also nice to create safe internal URLs, `createRouter` also returns `createURL`.

```tsx
import { createRouter } from "react-chicane";

const { createURL } = createRouter({
  root: "/",
  users: "/users",
  user: "/users/:userId",
});

createURL("root"); // -> "/"
createURL("users"); // -> "/users"
createURL("user", { userId: "zoontek" }); // -> "/users/zoontek"
```

## ⚙️ API

### createRouter

Create a router instance for your whole application.

```tsx
import { createRouter } from "react-chicane";

const Router = createRouter(
  {
    root: "/",
    users: "/users",
    user: "/users/:userId",
  },
  // { basePath: "/setup/basePath/here" }
);
```

#### 👇 Note: All the following examples will use this `Router` instance.

#### Router.location

```tsx
type Location = {
  path: string[];
  search: Record<string, string | string[]>;
  hash?: string;
};

Router.location; // Location
```

#### Router.url

```tsx
Router.url; // string
```

#### Router.navigate

Navigate to a given route.

```tsx
Router.navigate("root");
Router.navigate("users");
Router.navigate("user", { userId: "zoontek" });
```

#### Router.replace

Same as `navigate`, but will replace the current route in the browser history.

```tsx
Router.replace("root");
Router.replace("users");
Router.replace("user", { userId: "zoontek" });
```

#### Router.goBack

Go back in browser history.

```tsx
Router.goBack();
```

#### Router.goForward

Go forward in browser history.

```tsx
Router.goForward();
```

#### Router.createURL

Safely create internal URLs.

```tsx
createURL("root"); // -> "/"
createURL("users"); // -> "/users"
createURL("user", { userId: "zoontek" }); // -> "/users/zoontek"
```

#### Router.useRoute

Listen and match a bunch of your routes. Awesome with pattern matching.

```tsx
import { match } from "ts-pattern";

const App = () => {
  // The order isn't important, paths are ranked using https://reach.tech/router/ranking
  const route = Router.useRoute(["root", "users", "user"]);

  match(route)
    .with({ name: "root" }, () => null)
    .with({ name: "users" }, () => null)
    .with({ name: "user" }, ({ params } /* { groupId: string } */) => null)
    .otherwise(() => <h1>404</h1>);
};
```

#### Router.useLink

As this library doesn't provide a single component, we expose this hook to create your own customized `Link`.

```tsx
const Link = ({
  children,
  href,
  replace,
  target,
}: {
  children?: React.ReactNode;
  href: string;
  replace?: boolean;
  target?: React.HTMLAttributeAnchorTarget;
}) => {
  const { active, onClick } = Router.useLink({ href, replace, target });

  return (
    <a
      href={href}
      target={target}
      onClick={onClick}
      style={{ fontWeight: active ? 700 : 400 }}
    >
      {children}
    </a>
  );
};

// usage
<Link href={Router.createURL("user", { userId: "zoontek" })} />;
```

#### Router.useLocation

Listen and react on `Router.location` changes.

```tsx
const App = () => {
  const location: Location = Router.useLocation();

  React.useEffect(() => {
    console.log("location changed", location);
  }, [location]);

  /* … */
};
```

#### Router.useURL

Listen and react on `Router.url` changes.

```tsx
const App = () => {
  const url: string = Router.useURL();

  React.useEffect(() => {
    console.log("url changed", url);
  }, [url]);

  /* … */
};
```

#### Router.subscribe

Subscribe to location changes. Useful to reset keyboard focus.

```tsx
const App = () => {
  React.useEffect(() => {
    const unsubscribe = Router.subscribe((location) => {
      resetKeyboardFocusToContent();
    });

    return unsubscribe;
  }, []);

  /* … */
};
```

## 👷‍♂️ Roadmap

- Improve documentation
- Tests, tests, tests
- Add navigation blocker
- Write a "focus reset" recipe
- Find a cool logo
- Create a website (?)

## 🙌 Acknowledgements

- [react-router](https://github.com/remix-run/react-router) for the `history` and the `Link` creation code.
- [reach-router](https://github.com/reach/router) for the path ranking algorithm.
