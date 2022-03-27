---
title: Components
sidebar_label: Components
---

## Link

Creates a link to a given URL and forces it to be handled by the router.

### Props

- `to` (`string`): URL
- `replace?` (`boolean`): Don't create a new browser history entry on navigation (defaults to `false`)
- Any prop `<a>` takes

### Usage

```tsx
import { Link } from "@swan-io/chicane";

const App = () => (
  <>
    <Link to={Router.Home()}>Home</Link>
    <Link to={Router.UseDetail({ userId: "123" })}>User</Link>
  </>
);
```
