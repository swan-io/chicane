<img width="108" alt="@swan-io/chicane logo" src="https://github.com/swan-io/chicane/blob/main/docs/static/img/logo.svg?raw=true">

# @swan-io/chicane

[![mit licence](https://img.shields.io/dub/l/vibe-d.svg?style=for-the-badge)](https://github.com/swan-io/chicane/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/@swan-io/chicane?style=for-the-badge)](https://www.npmjs.org/package/@swan-io/chicane)
[![bundlephobia](https://img.shields.io/bundlephobia/minzip/@swan-io/chicane?label=size&style=for-the-badge)](https://bundlephobia.com/result?p=@swan-io/chicane)

A simple and safe router for React and TypeScript.

## Design principles

- **Typed routes**: improving the DX, and making sure all your params are here!
- **Component-friendly**: the router nicely fits in your React app.
- **Easy-to-use**: naming routes instead of moving around unsafe URLs.
- **Performant**: avoids any unnecessary render.

## Installation

```bash
$ yarn add @swan-io/chicane
# --- or ---
$ npm install --save @swan-io/chicane
```

## Links

- 📘 [**Documentation**](https://swan-io.github.io/chicane)
- 📗 [**Usage with other routers**](./ADOPTION.md)
- ⚖️ [**License**](./LICENSE)

## Quickstart

```tsx
import { createRouter } from "@swan-io/chicane";
import { match } from "ts-pattern";

const Router = createRouter({
  Home: "/",
  Users: "/users",
  User: "/users/:userId",
});

const App = () => {
  const route = Router.useRoute(["Home", "Users", "User"]);

  // route object is a discriminated union
  return match(route)
    .with({ name: "Home" }, () => <h1>Home</h1>)
    .with({ name: "Users" }, () => <h1>Users</h1>)
    .with({ name: "User" }, ({ params }) => <h1>User {params.userId}</h1>) // params are strongly typed
    .otherwise(() => <h1>404</h1>);
};
```

## Run the example app

```bash
$ git clone git@github.com:swan-io/chicane.git
$ cd chicane/example

$ yarn install && yarn dev
# --- or ---
$ npm install && npm run dev
```

## 🙌 Acknowledgements

- [react-router](https://github.com/remix-run/react-router) for the `history` and the `Link` creation code.
- [reach-router](https://github.com/reach/router) for the path ranking algorithm.
