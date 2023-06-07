---
title: Top-level API
sidebar_label: Top-level API
---

## createRouter

- `routes` (**required**): Takes an object with your **route names** as keys, and their [**pattern**](./route-pattern-syntax) as values.
- `options`:
  - `basePath`: Prefix for the path (allowing your code to ignore it)
  - `skipUrlCleanup`: Avoid running initial URL cleanup

Returns a [Router](./router).

```ts
import { createRouter } from "@swan-io/chicane";

export const Router = createRouter({
  Home: "/",
  UserList: "/users",
  UserDetail: "/users/:userId",
});
```

## createGroup

Spread a `createGroup` in your routes if you want to avoid repetition with nested routes having the same prefix, search or hash params.

- `routeName` (**required**): string
- `routePath` (**required**): string
- `subroutes` (**required**): Takes an object with your **route names** as keys, and their [**pattern**](./route-pattern-syntax) as values.

```ts
import { createRouter, createGroup } from "@swan-io/chicane";

export const Router = createRouter({
  Home: "/",

  ...createGroup("User", "/users", {
    List: "/", // UserList: "/users"
    Detail: "/:userId", // UserDetail: "/users/:userId"
  }),

  ...createGroup("Book", "/books?:isEditor", {
    List: "/?:byAuthor", // BookList: "/books?:isEditor&:byAuthor"
    Detail: "/:bookId", // BookDetail: "/books/:bookId?:isEditor"
  }),
});
```
