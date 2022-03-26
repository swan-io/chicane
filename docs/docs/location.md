---
title: Location
sidebar_label: Location
---

Even though you'll mostly need to consume the location through the [Router](./router), you might need to subscribe manually to the lower-level location object.

## Location object

- `path` (`Array<string>`): path split on `/`
- `search`: (`Record<string | Array<string>>`)
- `hash?`: (`string`)
- `raw`:
  - `path`: `string`
  - `search`: `string`
  - `hash`: `string`
- `toString()`: returns the imploded location

## getLocation

Returns the exploded location (a [Location object](#location-object))

```ts
import { getLocation } from "@swan-io/chicane";

console.log(getLocation().path);
```

## subscribeToLocation

Subscribes to location changes, and passes a [Location object](#location-object) to the listener.

```ts
import { subscribeToLocation } from "@swan-io/chicane";

subscribeToLocation((location) => {
  console.log("Location changed!");
  console.log(location);
});
```

## encodeSearch/decodeSearch

Implode and explode search params.

```ts
import { encodeSearch, decodeSearch } from "@swan-io/chicane";

encodeSearch({ invitation: "542022247745", users: ["frank", "chris"] });
// -> "?invitation=542022247745&users=frank&users=chris"

decodeSearch("?invitation=542022247745&users=frank&users=chris");
// -> { invitation: "542022247745", users: ["frank", "chris"] }
```

## pushUnsafe/replaceUnsafe

Escape hatch. Similar to `Router.push` and `Router.replace` but accepts a unique string argument.

```ts
import { pushUnsafe, replaceUnsafe } from "@swan-io/chicane";

pushUnsafe("/");
replaceUnsafe(someValue);
```
