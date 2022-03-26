---
title: Matching some routes
sidebar_label: Matching some routes
---

Great! We have a router with fine grained routes.

Now let's actually **match** those routes in a React component.

:::info
Although you can use a traditionnal `switch` we **heavily recommend** that you use **[ts-pattern](https://github.com/gvergnaud/ts-pattern)** for matching. It will provide you with **exhaustivity checks** and act as [an expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#expressions), where `switch` is [a statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements#statements_and_declarations_by_category), which makes it harder to use syntax-wise.

All of our examples with use `ts-pattern`'s `match` function.
:::

## useRoute

```tsx title="src/App.tsx"
// Let's start by importing our router
import { Header } from "./Header";
import { Home } from "./Home";
import { NotFound } from "./NotFound";
import { Router } from "./router";
import { UserArea } from "./UserArea";

export const App = () => {
  // Then pass the route subset this component should listen to (the order isn't important)
  const route = Router.useRoute(["Home", "UserArea"]);

  // And then, simply make each route return its component
  return (
    <>
      <Header />
      {match(route)
        .with({ name: "Home" }, () => <Home />)
        .with({ name: "UserArea" }, () => <UserArea />)
        .otherwise(() => (
          <NotFound />
        ))}
    </>
  );
};
```

That's it! Nothing more.
