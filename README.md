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
  Home: "/",
  Users: "/users",
  User: "/users/:userId",
});

const App = () => {
  const route = useRoute(["Home", "Users", "User"]);

  if (!route) {
    return <h1>404</h1>;
  }

  // route object is a discriminated union
  switch (route.name) {
    case "Home":
      return <h1>Home</h1>;
    case "Users":
      return <h1>Users</h1>;
    case "User":
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
  Groups: "/groups",
  Group: "/groups/:groupId?:foo&:bar[]#:baz",
  Users: "/groups/:groupId/users",
  User: "/groups/:groupId/users/:userId",
  // it also supports wildcard routes!
  UsersArea: "/groups/:groupId/users/*",
});

const App = () => {
  const route = useRoute(["Groups", "Group", "Users", "User"]);

  match(route)
    .with({ name: "Groups" }, ({ params }) => console.log(params)) // {}
    .with({ name: "Group" }, ({ params }) => console.log(params)) // { groupId: string, foo?: string, bar?: string[], baz?: string }
    .with({ name: "Users" }, ({ params }) => console.log(params)) // { groupId: string }
    .with({ name: "User" }, ({ params }) => console.log(params)) // { groupId: string, userId: string }
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
  Home: "/",
  Users: "/users",
  User: "/users/:userId",
});

createURL("Home"); // -> "/"
createURL("Users"); // -> "/users"
createURL("User", { userId: "zoontek" }); // -> "/users/zoontek"
```

## ⚙️ API

### createRouter

Create a router instance for your whole application.

```tsx
import { createRouter } from "react-chicane";

const Router = createRouter(
  {
    Home: "/",
    Users: "/users",
    User: "/users/:userId",
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

  raw: {
    path: string;
    search: string;
    hash: string;
  };

  toString(): string;
};

Router.getLocation(); // Location
```

#### Router.push

Push a given route in the browser history.

```tsx
Router.push("Home");
Router.push("Users");
Router.push("User", { userId: "zoontek" });
```

#### Router.replace

Same as `push`, but will replace the current route in the browser history.

```tsx
Router.replace("Home");
Router.replace("Users");
Router.replace("User", { userId: "zoontek" });
```

#### Router.back

Go back in browser history.

```tsx
Router.back();
```

#### Router.forward

Go forward in browser history.

```tsx
Router.forward();
```

#### Router.createURL

Safely create internal URLs.

```tsx
Router.createURL("Home"); // -> "/"
Router.createURL("Users"); // -> "/users"
Router.createURL("User", { userId: "zoontek" }); // -> "/users/zoontek"
```

#### Router.useRoute

Listen and match a bunch of your routes. Awesome with pattern matching.

```tsx
import { match } from "ts-pattern";

const App = () => {
  // The order isn't important, paths are ranked using https://reach.tech/router/ranking
  const route = Router.useRoute(["Home", "Users", "User"]);

  return match(route)
    .with({ name: "Home" }, () => <h1>Home</h1>)
    .with({ name: "Users" }, () => <h1>Users</h1>)
    .with({ name: "User" }, ({ params: { userId } }) => <h1>User</h1>)
    .otherwise(() => <h1>404</h1>);
};
```

#### Router.useRouteFocus

Registers a component as a route container, so that the element receives focus on route change. When using nested routes, the deepest route container is focused.

```tsx
const App = () => {
  const route = Router.useRoute(["Home", "Users", "User"]);
  const containerRef = React.useRef(null);

  Router.useRouteFocus({
    route,
    containerRef,
  });

  return <div ref={containerRef}>{/* match your route here */}</div>;
};
```

#### Router.useLink

As this library doesn't provide a single component, we expose this hook to create your own customized `Link`.

```tsx
type Props = {
  to: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  replace?: boolean;
  target?: React.HTMLAttributeAnchorTarget;
};

const Link = ({
  to,
  children,
  replace,
  target,
  onClick: baseOnClick,
}: Props) => {
  const { active, onClick } = useLink({ href: to, replace, target });

  return (
    <a
      href={to}
      target={target}
      onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
        baseOnClick?.(event);
        onClick(event);
      }}
      style={{
        fontWeight: active ? 700 : 400,
      }}
    >
      {children}
    </a>
  );
};

// usage
<Link to={Router.createURL("User", { userId: "zoontek" })}>Profile</Link>;
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

#### Router.encodeSearch / Router.decodeSearch

Encode and decode url search parameters.

```tsx
Router.encodeSearch({ invitation: "542022247745", users: ["frank", "chris"] });
// -> "?invitation=542022247745&users=frank&users=chris"

Router.decodeSearch("?invitation=542022247745&users=frank&users=chris");
// -> { invitation: "542022247745", users: ["frank", "chris"] }
```

#### Router.pushUnsafe and Router.replaceUnsafe

Two methods similar to `Router.push` and `Router.replace` but which accept a `string` as unique argument. Useful for escape hatches.

A quick example with a `Redirect` component:

```tsx
const Redirect = ({ to }: { to: string }) => {
  const location = Router.useLocation().toString();

  React.useLayoutEffect(() => {
    if (to !== location) {
      Router.replaceUnsafe(to);
    }
  }, []);

  return null;
};

// usage
<Redirect to={Router.createURL("Home")} />;
```

### createGroup

Reduce routes declaration repetitions by subpath grouping.

```tsx
import { createGroup, createRouter } from "react-chicane";

const Router = createRouter({
  Home: "/",
  User: "/:userName",

  ...createGroup("Repository", "/:repositoryName", {
    Root: "/",
    Issues: "/issues",
    Pulls: "/pulls",
    Actions: "/actions",

    // Can be nested indefinitely
    ...createGroup("Settings", "/settings", {
      Root: "/",
      Collaborators: "/access",
      Branches: "/branches",
    }),
  }),
});

Router.createURL("User", { userName: "zoontek" });
Router.createURL("RepositoryActions", { repositoryName: "valienv" });
Router.createURL("RepositorySettingsBranches", { repositoryName: "valienv" });
```

## 👷‍♂️ Roadmap

- Improve documentation
- Tests, tests, tests
- Create a website (?)

## 🙌 Acknowledgements

- [react-router](https://github.com/remix-run/react-router) for the `history` and the `Link` creation code.
- [reach-router](https://github.com/reach/router) for the path ranking algorithm.
