---
title: Linking to a route
sidebar_label: Linking to a route
---

Now that we have created our router, let's create our first link to our route:

```tsx {8,9} title="src/Header.tsx"
import { Link } from "@swan-io/chicane";
import { Router } from "./router";

const Header = () => {
  return (
    <div>
      <h1>My super app</h1>
      <Link to={Router.Home()}>Home</Link>
      <Link to={Router.Users()}>Users</Link>
    </div>
  );
};
```

The `Link` component takes a few props:

- `to`: (**required**): The route you're linking to
- `className`
- `activeClassName`
- `style`
- `activeStyle`
- `replace`: replace instead of push

## Creating your own Link component

We provide a default `Link` component, but you can also create yours if needed using the `useLink` hook:

```tsx {4} title="src/Link.tsx"
import { useLink } from "@swan-io/chicane/useLink";
import cx from "classnames";

const Link = ({ className, activeClassName, to, ...props }) => {
  const { active, onClick } = useLink({ href: to, replace });

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

## Programmatic links

The router also provides two functions to navigate programmatically (from your JS code):

- `Router.push(routeName, routeParams)`
- `Router.replace(routeName, routeParams)` (doesn't create a new entry in the browser history)
