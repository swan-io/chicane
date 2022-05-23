---
title: Linking to a route
sidebar_label: Linking to a route
---

Now that we have created our router, let's create our first link to our route:

```tsx {7-8} title="src/Header.tsx"
import { Link } from "@swan-io/chicane";
import { Router } from "./router";

const Header = () => (
  <div>
    <h1>My super app</h1>
    <Link to={Router.Home()}>Home</Link>
    <Link to={Router.Users()}>Users</Link>
  </div>
);
```

The `Link` component takes a few props:

```ts
type LinkProps = {
  to: string; // The route you're linking to (required)
  replace?: boolean; // Replace instead of push (defaults to `false`)
  activeClassName?: string;
  activeStyle?: React.CSSProperties;
  // …and any prop <a> takes
};
```

## Creating your own Link component

We provide a default `Link` component, but you can also create yours if needed using the `useLinkProps` hook:

```tsx {5} title="src/Link.tsx"
import { useLinkProps } from "@swan-io/chicane";
import cx from "classnames";

const Link = ({ className, activeClassName, to, ...props }) => {
  const { active, onClick } = useLinkProps({ href: to, replace });

  return (
    <a
      {...props}
      href={to}
      onClick={onClick}
      className={cx(className, active && activeClassName)}
    />
  );
};
```

## Programmatic navigation

The router also provides two functions to navigate programmatically (from your JS code):

- `Router.push(routeName, routeParams)`
- `Router.replace(routeName, routeParams)` (doesn't create a new entry in the browser history)
