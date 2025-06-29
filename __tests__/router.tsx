import { act, render } from "@testing-library/react";
import * as React from "react";
import { beforeEach, expect, test } from "vitest";
import { createRouter, pushUnsafe, useFocusReset } from "../src";
import { setInitialHasLocationChanged } from "../src/history";

const expectToHaveFocus = (element: Element) => {
  expect(element.ownerDocument.activeElement).toBe(element);
};

const routes = {
  Home: "/",
  Profiles: "/profile/*",
  Profile: "/profile/:username",
} as const;

const { getRoute, useRoute } = createRouter(routes);
const routesToMatch: (keyof typeof routes)[] = ["Home", "Profiles", "Profile"];

beforeEach(() => {
  pushUnsafe("/");
  setInitialHasLocationChanged(false);
});

test("useRoute: should match the correct route", () => {
  const App = () => {
    const route = useRoute(routesToMatch);

    if (route === undefined) {
      return <div> Not found </div>;
    }

    return (
      <>
        {route.name === "Home" ? (
          <div> Home </div>
        ) : route.name === "Profile" ? (
          <div> Profile {route.params.username} </div>
        ) : null}
      </>
    );
  };

  const { container } = render(<App />);

  expect(container.textContent).toContain("Home");

  act(() => {
    pushUnsafe("/profile/zoontek");
  });

  expect(container.textContent).toContain("Profile zoontek");

  act(() => {
    pushUnsafe("/unknown");
  });

  expect(container.textContent).toContain("Not found");
});

test("getRoute: should match the correct route", () => {
  const App = () => {
    const route = getRoute(routesToMatch);

    if (route === undefined) {
      return <div> Not found </div>;
    }

    return (
      <>
        {route.name === "Home" ? (
          <div> Home </div>
        ) : route.name === "Profile" ? (
          <div> Profile {route.params.username} </div>
        ) : null}
      </>
    );
  };

  const { container, rerender } = render(<App />);

  expect(container.textContent).toContain("Home");

  act(() => {
    pushUnsafe("/profile/zoontek");
  });

  rerender(<App />);
  expect(container.textContent).toContain("Profile zoontek");

  act(() => {
    pushUnsafe("/unknown");
  });

  rerender(<App />);
  expect(container.textContent).toContain("Not found");
});

test("getRoute: should match the correct route for given location", () => {
  const route = getRoute(routesToMatch, "/profile/zoontek");

  expect(route).toStrictEqual({
    key: "1pkttpl-0",
    name: "Profile",
    params: {
      username: "zoontek",
    },
  });
});

test("useFocusReset: should focus the correct element", () => {
  const App = () => {
    const route = useRoute(routesToMatch);
    const containerRef = React.useRef(null);

    useFocusReset({ route, containerRef });

    if (route === undefined) {
      return <div> Not found </div>;
    }

    return (
      <div ref={containerRef} data-testid="routeContainer">
        {route.name === "Home" ? (
          <div> Home </div>
        ) : route.name === "Profile" ? (
          <div> Profile {route.params.username} </div>
        ) : null}
      </div>
    );
  };

  const { getByTestId, baseElement } = render(<App />);
  const body = baseElement as HTMLBodyElement;
  const routeContainer = getByTestId("routeContainer");

  // doesn't take focus initially
  expectToHaveFocus(body);

  act(() => {
    pushUnsafe("/profile/zoontek");
  });

  // takes focus after a route change
  expectToHaveFocus(routeContainer);

  act(() => {
    // doesn't switch focus if route remains the same
    body.setAttribute("tabIndex", "-1");
    body.focus();
  });

  expectToHaveFocus(body);

  act(() => {
    pushUnsafe("/profile/zoontek");
  });

  expectToHaveFocus(body);

  act(() => {
    pushUnsafe("/profile/bloodyowl");
  });

  // takes focus when only a param changes
  expectToHaveFocus(routeContainer);
});
