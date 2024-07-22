---
title: Utility types
sidebar_label: Utility types
---

To easily extract routes types, use `InferRoutes`:

```tsx {1,9}
import { createRouter, InferRoutes } from "@swan-io/chicane";

export const Router = createRouter({
  UserList: "/users",
  UserDetail: "/users/:userId",
});

// A map of RouteName and its associated RouteParams
type Routes = InferRoutes<typeof Router>;

export type RouteName = keyof Routes;
export type RouteParams<T extends RouteName> = Routes[T];
```
