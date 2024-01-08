---
title: Creating your router
sidebar_label: Creating your router
---

The first need you need to do with chicane is to create your **router**. A router allows you to specify all the routes in your application: each route has a **name** and a **pattern**.

To do that, let's import `createRouter` and create our first routes:

```ts title="src/router.ts"
import { createRouter } from "@swan-io/chicane";

export const Router = createRouter({
  Home: "/",
  About: "/about",
  UserList: "/users",
  UserDetail: "/users/:userId",
});
```

That's it! You now have a router that is ready-to-use.

Now, let's see what's inside:

## Routes

First, you have your **Routes**. You can picture your routes as an opaque value that you can pass around.

You can call a route to create a URL:

```ts
Router.Home(); // "/"
Router.UserDetail({ userId: "1" }); // "/users/1"
```

Each route is **fully typed**, making sure you're passing all the necessary params.

## useRoute

Second, you have the **useRoute** React hook. It takes an **array of routes you want to match**, and returns the first match (or `undefined`).

```ts
const route = Router.useRoute(["UserList", "UserDetail"]);

// -> { name: "UserList", params: {} }
//  | { name: "UserDetail", params: { userId: "1" } }
//  | undefined
```

You can call `useRoute` in any React component in your application!

## push / replace

The router also provides two functions to navigate programmatically (from your JS code):

- `Router.push(routeName, routeParams)`
- `Router.replace(routeName, routeParams)` (doesn't create a new entry in the browser history)

## Organizing nested routes

If you want to avoid repetitions when having lots of subroutes, you can use a little helper called `createGroup`:

```ts title="src/router.ts"
import { createRouter, createGroup } from "@swan-io/chicane";

export const Router = createRouter({
  Home: "/",
  About: "/about",

  ...createGroup("User", "/users", {
    Area: "/*", // UserArea: "/users/*"
    List: "/", // UserList: "/users"
    Detail: "/:userId", // UserDetail: "/users/:userId"
  }),
});
```
