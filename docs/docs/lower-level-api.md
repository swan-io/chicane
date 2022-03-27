---
title: Lower-level API
sidebar_label: Lower-level API
---

Even though you'll mostly need to consume the location through the [Router](./router), you might need to dive deeper at some point.

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
replaceUnsafe("?name=frank");
```
