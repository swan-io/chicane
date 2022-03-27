---
title: Hooks
sidebar_label: Hooks
---

## useLinkProps

Hook that gives you props for a `<a>` element (useful if you need to make your own [Link component](/components#link)).

```tsx
import { useLinkProps } from "@swan-io/chicane";

const MyCustomLink = ({ to, className, activeClassName, ...props }) => {
  const { active, onClick } = useLinkProps({ href: to, replace, target });

  return (
    <a
      {...props}
      onClick={onClick}
      className={cx(className, active && activeClassName)}
    />
  );
};
```

## useFocusReset

Gives focus to the updated route on screen.

```tsx
import { useFocusReset } from "@swan-io/chicane";
import { useRef } from "react";

export const App = () => {
  const route = Router.useRoute(["Home", "UserArea"]);
  const containerRef = useRef(null);

  useFocusReset({ route, containerRef });

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

## useLocation

Returns the current, up-to-date location, and updates when changed.

```tsx
import { useLocation } from "@swan-io/chicane";

const App = () => {
  const location = useLocation();

  React.useEffect(() => {
    console.log("Location changed!");
    console.log(location);
  }, [location]);

  // …
};
```

## useNavigationBlocker

Block the navigation and ask user for confirmation. Useful to avoid loosing a form state.

```tsx
const App = () => {
  const { formStatus } = useForm(/* … */);

  useNavigationBlocker(
    formStatus === "editing",
    "Are you sure you want to stop editing this profile?",
  );

  // …
};
```
