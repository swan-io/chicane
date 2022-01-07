import * as React from "react";
import * as ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import { createRouter } from "../src";

const routes = {
  home: "/",
  profile: "/profile/:username",
} as const;

const { useRoute, unsafeNavigate, getLocation, useRouteFocus } =
  createRouter(routes);

export type RouteName = keyof typeof routes;

const routesToMatch: RouteName[] = ["home", "profile"];

describe("router", () => {
  let container;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.append(container);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
    container = undefined;
  });

  test("useRoute: should match the correct route", () => {
    function App() {
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
    }

    act(() => {
      ReactDOM.render(<App />, container);
    });

    expect(container.textContent).toContain("Home");

    act(() => {
      unsafeNavigate("/profile/Zoontek");
    });

    expect(container.textContent).toContain("Profile Zoontek");

    act(() => {
      unsafeNavigate("/unknown");
    });

    expect(container.textContent).toContain("Not found");
  });

  test("useRouteFocus: should focus the correct element", () => {
    function App() {
      const route = useRoute(routesToMatch);
      const containerRef = React.useRef(null);

      useRouteFocus({
        containerRef,
        route,
      });

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
    }

    act(() => {
      ReactDOM.render(<App />, container);
    });

    // doesn't take focus initially
    expect(document.activeElement).toBe(document.body);

    act(() => {
      unsafeNavigate("/profile/Zoontek");
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
      unsafeNavigate("/profile/Zoontek");
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
