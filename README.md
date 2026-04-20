<img width="108" alt="@zoontek/chicane logo" src="https://github.com/zoontek/chicane/blob/main/docs/static/img/logo.svg?raw=true">

# @zoontek/chicane

[![mit licence](https://img.shields.io/dub/l/vibe-d.svg?style=for-the-badge)](https://github.com/zoontek/chicane/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/@zoontek/chicane?style=for-the-badge)](https://www.npmjs.org/package/@zoontek/chicane)
[![bundlephobia](https://img.shields.io/bundlephobia/minzip/@zoontek/chicane?label=size&style=for-the-badge)](https://bundlephobia.com/result?p=@zoontek/chicane)

A simple and safe router for React and TypeScript.

## Design principles

- **Typed routes**: improving the DX, and making sure all your params are here!
- **Component-friendly**: the router nicely fits in your React app.
- **Easy-to-use**: naming routes instead of moving around unsafe URLs.
- **Performant**: avoids any unnecessary render.

## Installation

```bash
$ yarn add @zoontek/chicane
# --- or ---
$ npm install --save @zoontek/chicane
```

## Links

- 📘 [**Documentation**](https://zoontek.github.io/chicane)
- ⚖️ [**License**](./LICENSE)

## Quickstart

```tsx
import { createRouter } from "@zoontek/chicane";
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
$ git clone git@github.com:zoontek/chicane.git
$ cd chicane/example

$ yarn install && yarn dev
# --- or ---
$ npm install && npm run dev
```

## 🙌 Acknowledgements

- [react-router](https://github.com/remix-run/react-router) for the `history` and the `Link` creation code.
- [reach-router](https://github.com/reach/router) for the path ranking algorithm.
