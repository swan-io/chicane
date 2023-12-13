---
title: Route focus
sidebar_label: Route focus
---

In order to improve accessibility for people using **keyboard navigation** and/or **screen readers**, we provide an opt-in hook that can **focus the updated area on page** when the route changes.

That makes navigation easier by moving the navigation to the relevant area, thus removing the need to press the `Tab` key to get there after, as there's an intent to navigate.

```tsx {8}
import { useFocusReset } from "@swan-io/chicane";
import { useRef } from "react";

export const App = () => {
  const route = Router.useRoute(["Home", "UserArea"]);
  const containerRef = useRef(null);

  useFocusReset(containerRef);

  return (
    <>
      <Header />

      <div ref={containerRef}>
        {match(route)
          .with({ name: "Home" }, () => <Home />)
          .with({ name: "UserArea" }, () => <UserArea />)
          .otherwise(() => (
            <NotFound />
          ))}
      </div>
    </>
  );
};
```
