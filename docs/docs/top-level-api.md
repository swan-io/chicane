---
title: Top-level API
sidebar_label: Top-level API
---

## createRouter

- `routes` (**required**): Takes an object with your **route names** as keys, and their [**pattern**](./route-pattern-syntax) as values.
- `options`:
  - `basePath`: Prefix for the path (allowing your code to ignore it)

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

Spread a `createGroup` in your routes if you want to avoid repetition with nested routes having the same prefix.

- `routeName` (**required**): string
- `routePath` (**required**): string
- `subroutes` (**required**): Takes an object with your **route names** as keys, and their [**pattern**](./route-pattern-syntax) as values.

```ts
import { createRouter } from "@swan-io/chicane";

export const Router = createRouter({
  Home: "/",
  ...createGroup("User", "/users", {
    List: "/users",
    Detail: "/users/:userId",
  }),
});
```

## getLocation

Returns the exploded location (a [Location object](#getlocation))

```ts
import { getLocation /*, Location */ } from "@swan-io/chicane";

type Location = {
  path: string[]; // path split on `/`
  search: Record<string, string | string[]>;
  hash?: string;
  key: string; // a hash for the location
  raw: { path: string; search: string; hash: string };
  toString(): string; // returns the imploded location
};

const location: Location = getLocation();
console.log(location.path);
```

## subscribeToLocation

Subscribes to location changes, and passes a [Location object](#getlocation) to the listener.

```ts
import { subscribeToLocation } from "@swan-io/chicane";

subscribeToLocation((location: Location) => {
  console.log("Location changed!");
  console.log(location);
});
```

## encodeSearch / decodeSearch

Implode and explode search params.

```ts
import { encodeSearch, decodeSearch } from "@swan-io/chicane";

encodeSearch({ invitation: "542022247745", users: ["frank", "chris"] });
// -> "?invitation=542022247745&users=frank&users=chris"

decodeSearch("?invitation=542022247745&users=frank&users=chris");
// -> { invitation: "542022247745", users: ["frank", "chris"] }
```

## pushUnsafe / replaceUnsafe

Escape hatch. Similar to `Router.push` and `Router.replace` but accepts a unique string argument.

```ts
import { pushUnsafe, replaceUnsafe } from "@swan-io/chicane";

pushUnsafe("/");
replaceUnsafe("?foo=x");
```
