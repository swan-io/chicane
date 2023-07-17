# @swan-io/chicane usage with other routers

This is an example on how you can incrementaly adopt [`@swan-io/chicane`](https://github.com/swan-io/chicane) in a codebase using another router (here, `react-router-dom`), in order to add type safety on your internal links creation.

👉 Note that [`@swan-io/chicane`](https://github.com/swan-io/chicane) is a fully featured router that provides type safety on link creation **and** on route matching (and other cool features!).

### How to adopt @swan-io/chicane incrementaly in your codebase

First create a `router.ts` file:

```ts
import { createRouter } from "@swan-io/chicane";

// Here we list all our application pages
const routes = {
  Home: "/",
  Teams: "/teams?:created", // chicane support search / hash params declaration
  Team: "/teams/:teamId",
  NewTeam: "/teams/new",
  // Note that chicane "createGroup" works perfectly here! (for routes nesting)
} as const;

// We avoid exporting chicane routing functions
const { getRoute, useRoute, push, replace, ...rest } = createRouter(routes);

// We exports all the link creation functions
export const Router = rest;

// We export paths (without search and hash params, as react-router-dom doesn't support them)
export const paths = (Object.keys(routes) as (keyof typeof routes)[]).reduce(
  (acc, key) => ({ ...acc, [key]: routes[key].replace(/[?#].*/, "") }),
  {} as Record<keyof typeof routes, string>,
);
```

Then, replace your `react-router-dom` `Route` component paths declarations:

```tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { paths } from "./router";

<BrowserRouter>
  <Routes>
    {/* we use paths from router.ts */}
    <Route path={paths.Home} element={<Home />} />
    <Route path={paths.Teams} element={<Teams />} />
    <Route path={paths.Team} element={<Team />} />
    <Route path={paths.NewTeam} element={<NewTeam />} />
  </Routes>
</BrowserRouter>;
```

Finally, enjoy safe link creation!

```tsx
import { Link, useNavigate } from "react-router-dom";
import { Router } from "./router";

const SomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Link to={Router.Home()}>Back to home page</Link>
      <Link to={Router.Team({ teamId: "foo" })}>Team foo page</Link>
      <Link to={Router.Team({ teamId: "bar" })}>Team bar page</Link>

      <button
        onClick={(event) => {
          event.preventDefault();
          navigate(Router.Teams({ created: "baz" }), { replace: true });
        }}
      >
        Click me
      </button>
    </>
  );
};
```

✨ Once your links are type safe, you can start migrating your [routes matching](https://swan-io.github.io/chicane/matching-some-routes).
