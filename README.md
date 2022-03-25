<br />
<br />

<p align="center">
  <img width="450" alt="react-chicane logo" src="docs/logo.svg">
</p>

<br />

# react-chicane

[![mit licence](https://img.shields.io/dub/l/vibe-d.svg?style=for-the-badge)](https://github.com/zoontek/react-chicane/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/react-chicane?style=for-the-badge)](https://www.npmjs.org/package/react-chicane)
[![bundlephobia](https://img.shields.io/bundlephobia/minzip/react-chicane?label=size&style=for-the-badge)](https://bundlephobia.com/result?p=react-chicane)

A simple and safe router for React and TypeScript.

## Installation

```sh
yarn add react-chicane
```

## Run the example

```sh
git clone git@github.com:zoontek/react-chicane.git
cd react-chicane/example
yarn install && yarn dev
```

## 📘 Usage

### Creating a router

This library exports a main function: `createRouter`. The goal behind this is to enforce listing all your project routes using fancy names in a file and use the strongly typed methods returned.

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
      // params are strongly typed
      return <h1>User {route.params.userId}</h1>;
  }
};
```

#### 👉 Note: Even if you can use classic type guards (if, switch, etc.) to check the result, I strongly recommand using a pattern matching library, like the excellent [ts-pattern](https://github.com/gvergnaud/ts-pattern) (all the following examples will).

#### ✍️ Path syntax

`react-chicane` doesn't bother about what's inside your path, your search params or your hash. It only exposes an object, `params`.

- A param in your path will result in a required `string`
- A param in your search or your hash will result in an optional `string`
- A mutiple param in your search will result in a optional `string[]`

```tsx
import { createRouter } from "react-chicane";
import { match } from "ts-pattern";

export const { useRoute } = createRouter({
  groups: "/groups",
  group: "/groups/:groupId?:foo&:bar[]#:baz",
  users: "/groups/:groupId/users",
  user: "/groups/:groupId/users/:userId",
  // it also supports wildcard routes!
  usersArea: "/groups/:groupId/users/*",
});

const App = () => {
  const route = useRoute(["groups", "group", "users", "user"]);

  match(route)
    .with({ name: "groups" }, ({ params }) => console.log(params)) // {}
    .with({ name: "group" }, ({ params }) => console.log(params)) // { groupId: string, foo?: string, bar?: string[], baz?: string }
    .with({ name: "users" }, ({ params }) => console.log(params)) // { groupId: string }
    .with({ name: "user" }, ({ params }) => console.log(params)) // { groupId: string, userId: string }
    .otherwise(() => <h1>404</h1>);

  // …
};
```

#### 👉 Note: Non-param search and hash are not supported.

### 🔗 Creating URLs

Because it's nice to create safe internal URLs, `createRouter` also returns `createURL`.

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
  {
    basePath: "/setup/basePath/here", // Will be prepend to all your paths (optional)
    blockerMessage: "Are you sure you want to leave this page?", // A default navigation blocker message (optional)
  },
);
```

#### 👇 Note: All the following examples will use this `Router` instance.

#### Router.getLocation

```tsx
type Location = {
  path: string[];
  search: Record<string, string | string[]>;
  hash?: string;
  raw: { path: string; search: string; hash: string };
  toString(): string;
};

Router.getLocation(); // Location
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
Router.createURL("root"); // -> "/"
Router.createURL("users"); // -> "/users"
Router.createURL("user", { userId: "zoontek" }); // -> "/users/zoontek"
```

#### Router.useRoute

Listen and match a bunch of your routes. Awesome with pattern matching.

```tsx
import { match } from "ts-pattern";

const App = () => {
  // The order isn't important, paths are ranked using https://reach.tech/router/ranking
  const route = Router.useRoute(["root", "users", "user"]);

  return match(route)
    .with({ name: "root" }, () => <h1>root</h1>)
    .with({ name: "users" }, () => <h1>users</h1>)
    .with({ name: "user" }, ({ params: { userId } }) => <h1>user</h1>)
    .otherwise(() => <h1>404</h1>);
};
```

#### Router.useRouteFocus

Registers a component as a route container, so that the element receives focus on route change. When using nested routes, the deepest route container is focused.

```tsx
const App = () => {
  const route = Router.useRoute(["root", "users", "user"]);
  const containerRef = React.useRef(null);

  Router.useRouteFocus({ containerRef, route });

  return <div ref={containerRef}>{/* match your route here */}</div>;
};
```

#### Router.useRoutes

Listen and match a bunch of your routes. Returns an array of routes, sorted by descending specificity. Useful for route hierarchical representation (e.g. a breadcrumb component).

```tsx
import { match } from "ts-pattern";

const Breadcrumbs = () => {
  const routes = Router.useRoutes(["root", "users", "user"], {
    orderBy: "asc", // accepts "asc" or "desc" order (default is "desc")
  });

  return routes.map((route) =>
    match(route)
      .with({ name: "root" }, () => "Home")
      .with({ name: "users" }, () => "Users")
      .with({ name: "user" }, ({ params: { userId } }) => userId)
      .otherwise(() => null),
  );
};
```

#### Router.useLink

As this library doesn't provide a single component, we expose this hook to create your own customized `Link`.

```tsx
const Link = ({
  children,
  to,
  replace,
  target,
}: {
  children?: React.ReactNode;
  to: string;
  replace?: boolean;
  target?: React.HTMLAttributeAnchorTarget;
}) => {
  const { active, onClick } = useLink({ href: to, replace, target });

  return (
    <a
      href={to}
      onClick={onClick}
      target={target}
      style={{ fontWeight: active ? 700 : 400 }}
    >
      {children}
    </a>
  );
};

// usage
<Link to={Router.createURL("user", { userId: "zoontek" })}>Profile</Link>;
```

#### Router.useLocation

Listen and react on `Router.location` changes.

```tsx
const App = () => {
  const location: Location = Router.useLocation();

  React.useEffect(() => {
    console.log("location changed", location);
  }, [location]);

  // …
};
```

#### Router.useBlocker

Block the navigation and ask user for confirmation. Useful to avoid loosing a form state. It accepts a second paramater if you want to override the default `blockerMessage`.

```tsx
const App = () => {
  const { formStatus } = useForm(/* … */);

  Router.useBlocker(
    formStatus === "editing",
    "Are you sure you want to stop editing this profile?",
  );

  // …
};
```

#### Router.subscribe

Subscribe to location changes.

```tsx
const unsubscribe = Router.subscribe((location: Location) => {
  // …
});
```

#### Router.unsafeNavigate and Router.unsafeReplace

Two methods similar to `Router.navigate` and `Router.replace` but which accept a `string` as unique argument. Useful for escape hatches.

A quick example with a `Redirect` component:

```tsx
const Redirect = ({ to }: { to: string }) => {
  const location = Router.useLocation().toString();

  React.useLayoutEffect(() => {
    if (to !== location) {
      Router.unsafeReplace(to);
    }
  }, []);

  return null;
};

// usage
<Redirect to={Router.createURL("root")} />;
```

### groupRoutes

Reduce routes declaration repetitions by subpath grouping.

```tsx
import { createRouter, groupRoutes } from "react-chicane";

const Router = createRouter({
  root: "/",
  user: "/:userName",

  ...groupRoutes("repository", "/:repositoryName", {
    root: "/",
    issues: "/issues",
    pulls: "/pulls",
    actions: "/actions",

    // Can be nested indefinitely
    ...groupRoutes("settings", "/settings", {
      root: "/",
      collaborators: "/access",
      branches: "/branches",
    }),
  }),
});

Router.createURL("user", { userName: "zoontek" });
Router.createURL("repository.actions", { repositoryName: "valienv" });
Router.createURL("repository.settings.branches", { repositoryName: "valienv" });
```

### encodeSearch / decodeSearch

Encode and decode url search parameters.

```tsx
import { decodeSearch, encodeSearch } from "react-chicane";

encodeSearch({ invitation: "542022247745", users: ["frank", "chris"] });
// -> "?invitation=542022247745&users=frank&users=chris"

decodeSearch("?invitation=542022247745&users=frank&users=chris");
// -> { invitation: "542022247745", users: ["frank", "chris"] }
```

## 👷‍♂️ Roadmap

- Improve documentation
- Tests, tests, tests
- Create a website (?)

## 🙌 Acknowledgements

- [react-router](https://github.com/remix-run/react-router) for the `history` and the `Link` creation code.
- [reach-router](https://github.com/reach/router) for the path ranking algorithm.
