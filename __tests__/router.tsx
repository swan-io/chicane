import { act, render } from "@testing-library/react";
import * as React from "react";
import { createRouter } from "../src";
import { resetInitialHasLocationChanged } from "../src/history";

const routes = {
  home: "/",
  profiles: "/profile/*",
  profile: "/profile/:username",
} as const;

describe("router", () => {
  const { useRoute, pushUnsafe, useRouteFocus } = createRouter(routes);

  type RouteName = keyof typeof routes;

  const routesToMatch: RouteName[] = ["home", "profiles", "profile"];

  beforeEach(() => {
    pushUnsafe("/");
    resetInitialHasLocationChanged();
  });

  test("useRoute: should match the correct route", () => {
    const App = () => {
      const route = useRoute(routesToMatch);

      if (route === undefined) {
        return <div> Not found </div>;
      }

      return (
        <>
          {route.name === "home" ? (
            <div> Home </div>
          ) : route.name === "profile" ? (
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

  test("useRouteFocus: should focus the correct element", () => {
    const App = () => {
      const route = useRoute(routesToMatch);
      const containerRef = React.useRef(null);

      useRouteFocus({ containerRef, route });

      if (route === undefined) {
        return <div> Not found </div>;
      }

      return (
        <div ref={containerRef} data-testid="routeContainer">
          {route.name === "home" ? (
            <div> Home </div>
          ) : route.name === "profile" ? (
            <div> Profile {route.params.username} </div>
          ) : null}
        </div>
      );
    };

    const { getByTestId, baseElement } = render(<App />);
    const body = baseElement as HTMLBodyElement;
    const routeContainer = getByTestId("routeContainer");

    // doesn't take focus initially
    expect(body).toHaveFocus();

    act(() => {
      pushUnsafe("/profile/zoontek");
    });

    // takes focus after a route change
    expect(routeContainer).toHaveFocus();

    act(() => {
      // doesn't switch focus if route remains the same
      body.setAttribute("tabIndex", "-1");
      body.focus();
    });

    expect(body).toHaveFocus();

    act(() => {
      pushUnsafe("/profile/zoontek");
    });

    expect(body).toHaveFocus();

    act(() => {
      pushUnsafe("/profile/bloodyowl");
    });

    // takes focus when only a param changes
    expect(routeContainer).toHaveFocus();
  });
});
