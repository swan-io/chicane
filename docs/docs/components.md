---
title: Components
sidebar_label: Components
---

## Link

Creates a link to a given URL and forces it to be handled by the router.

### Props

```ts
type LinkProps = {
  to: string; // The route you're linking to (required)
  replace?: boolean; // Replace instead of push (defaults to `false`)
  activeClassName?: string;
  activeStyle?: React.CSSProperties;
  // …and any prop <a> takes
};
```

### Usage

```tsx
import { Link } from "@swan-io/chicane";

const App = () => (
  <>
    <Link to={Router.Home()}>Home</Link>
    <Link to={Router.UserDetail({ userId: "123" })}>User</Link>
  </>
);
```
