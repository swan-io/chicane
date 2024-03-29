---
title: The Route pattern syntax
sidebar_label: Route pattern syntax
---

When defining a route, you assign a **URL pattern** to it. Its syntax supports different features:

## Simple path

```ts {2,3}
const Router = createRouter({
  Home: "/",
  UserList: "/users",
});
```

## Path params

You can have **params** (or _dynamic segments_) in your paths. It's syntax is `:yourParamName`. A param in the path will result in a **non-nullable `string`** in the route param object when matched.

```ts {4}
const Router = createRouter({
  Home: "/",
  UserList: "/users",
  UserDetail: "/users/:userId",
});
```

## Query params

If your route can take meaninful **query params**, you can specify them in the pattern using the `:paramName` syntax after a `?` character. When having multiple query params, separate them with a `&`, just like in an actual query string!

In the following example, the `UserList` route will receive a **nullable `sortBy` string** in its `params` object.

```ts {4}
const Router = createRouter({
  Home: "/",
  UserArea: "/users/*",
  UserList: "/users?:sortBy",
  UserDetail: "/users/:userId",
});
```

If you expect an array (which could be useful for filters, e.g. `/users?status=Active&status=Inactive`), you can suffix the param with `[]` to indicate to Chicane that it needs to treat this parameter as an array. The following will result in a **nullable `status` `string[]`** in its `params` object.

```ts {4}
const Router = createRouter({
  Home: "/",
  UserArea: "/users/*",
  UserList: "/users?:sortBy&:status[]",
  UserDetail: "/users/:userId",
});
```

## Union params

At some point you might need to restraint a param type (as `string` is too wide). To achieve this, you can declare union params using the `:name{a|b|…}` syntax.

```ts {3,4}
const Router = createRouter({
  Home: "/",
  Projects: "/:env{live|sandbox}/projects",
  Users: "/users?:statuses{invited|enabled|banned}[]",
});
```

```tsx title="src/App.tsx"
const App = () => {
  const route = Router.useRoute(["Projects", "Users"]);

  return match(route)
    .with({ name: "Projects" }, ({ params: { env } }) => (
      // env type is "live" | "sandbox"
      <Projects env={env} />
    ))
    .with({ name: "Users" }, ({ params: { statuses } }) => (
      // statuses type is Array<"invited" | "enabled" | "banned"> | undefined
      <Users statuses={statuses} />
    ))
    .otherwise(() => null);
};
```

## Wildcard

When building your React app, there's a fair chance you'll want to delegate to a component the management of its **subroutes**, for this purpose, you might want to use **wildcards** to make your component listen to every route that starts with a given path, and then let it handle the fine routing.

```ts {3}
const Router = createRouter({
  Home: "/",
  UserArea: "/users/*", // will match "/users" and "/users/:userId"
  UserList: "/users",
  UserDetail: "/users/:userId",
});
```

This unlocks the possibility to delegate subroutes. Here, `App` doesn't have to know about what happens in `UserArea`.

```tsx title="src/App.tsx"
const App = () => {
  const route = Router.useRoute(["Home", "UserArea"]);

  return match(route)
    .with({ name: "Home" }, () => <Home />)
    .with({ name: "UserArea" }, () => <UserArea />)
    .otherwise(() => null);
};
```

But here, the component can manage its subroutes, keeping your diffs where it actually matters.

```tsx title="src/UserArea.tsx"
const UserArea = () => {
  const route = Router.useRoute(["UserList", "UserDetail"]);

  return match(route)
    .with({ name: "UserList" }, () => <UserList />)
    .with({ name: "UserDetail" }, ({ params: { userId } }) => (
      <UserDetail userId={userId} />
    ))
    .otherwise(() => null);
};
```

:::info
Because it's not tied to a precise URL but rather a acts like a scope, **you cannot create a link that points to a wildcard route** (e.g. in the previous example, you can link to `UserList`, but not to `UserArea`).
:::
