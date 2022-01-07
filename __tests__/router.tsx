import * as React from "react";
import * as ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import { createRouter } from "../src";
import { resetInitialHasLocationChanged } from "../src/history";

const routes = {
  home: "/",
  profiles: "/profile/*",
  profile: "/profile/:username",
} as const;

describe("router", () => {
  const { useRoute, useRoutes, unsafeNavigate, useRouteFocus } =
    createRouter(routes);

  type RouteName = keyof typeof routes;

  const routesToMatch: RouteName[] = ["home", "profiles", "profile"];

  let container;
  beforeEach(() => {
    unsafeNavigate("/");
    resetInitialHasLocationChanged();

    container = document.createElement("div");
    document.body.append(container);
  });

  afterEach(() => {
    act(() => {
      ReactDOM.unmountComponentAtNode(container);
    });
    container.remove();
    container = undefined;
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

    act(() => {
      ReactDOM.render(<App />, container);
    });

    expect(container.textContent).toContain("Home");

    act(() => {
      unsafeNavigate("/profile/zoontek");
    });

    expect(container.textContent).toContain("Profile zoontek");

    act(() => {
      unsafeNavigate("/unknown");
    });

    expect(container.textContent).toContain("Not found");
  });

  test("useRoutes: should match multiple routes (DESC order)", () => {
    const App = () => {
      const routes = useRoutes(routesToMatch);
      return <>{routes.map((item) => `[${item.name}]`).join("")}</>;
    };

    act(() => {
      ReactDOM.render(<App />, container);
    });

    act(() => {
      unsafeNavigate("/profile/zoontek");
    });

    expect(container.textContent).toContain("[profile][profiles]");
  });

  test("useRoutes: should match multiple routes (ASC order)", () => {
    const App = () => {
      const routes = useRoutes(routesToMatch);
      return <>{routes.map((item) => `[${item.name}]`).join("")}</>;
    };

    act(() => {
      ReactDOM.render(<App />, container);
    });

    act(() => {
      unsafeNavigate("/profile/zoontek");
    });

    expect(container.textContent).toContain("[profiles][profile]");
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
        <div ref={containerRef} data-test-id="routeContainer">
          {route.name === "home" ? (
            <div> Home </div>
          ) : route.name === "profile" ? (
            <div> Profile {route.params.username} </div>
          ) : null}
        </div>
      );
    };

    act(() => {
      ReactDOM.render(<App />, container);
    });

    // doesn't take focus initially
    expect(document.activeElement).toBe(document.body);

    act(() => {
      unsafeNavigate("/profile/zoontek");
    });

    // takes focus after a route change
    expect(document.activeElement).toBe(
      document.querySelector("[data-test-id='routeContainer']"),
    );

    // doesn't switch focus if route remains the same
    document.body.setAttribute("tabIndex", "-1");
    document.body.focus();
    expect(document.activeElement).toBe(document.body);
    act(() => {
      unsafeNavigate("/profile/zoontek");
    });
    expect(document.activeElement).toBe(document.body);

    act(() => {
      unsafeNavigate("/profile/bloodyowl");
    });
    // takes focus when only a param changes
    expect(document.activeElement).toBe(
      document.querySelector("[data-test-id='routeContainer']"),
    );
  });
});
