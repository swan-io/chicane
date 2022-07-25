import { render } from "@testing-library/react";
import * as React from "react";
import { test } from "vitest";
import { createRouter, Link } from "../src";

const Router = createRouter({
  Home: "/",
  Users: "/users",
  User: "/users/:userId",
});

const App = () => {
  const route = Router.useRoute(["Home", "Users", "User"]);

  return (
    <div>
      <Link to={Router.Home()} activeClassName="active">
        Home
      </Link>

      <Link to={Router.Users()} activeClassName="active">
        Users
      </Link>

      <Link to={Router.User({ userId: "123" })} activeClassName="active">
        User
      </Link>

      <div>
        {(() => {
          switch (route?.name) {
            case "Home":
              return "Home";
            case "Users":
              return "Users";
            case "User":
              return `User ${route.params.userId}`;
            default:
              return "404";
          }
        })()}
      </div>
    </div>
  );
};

test("Should hydrate correctly", () => {
  const container = document.createElement("div");

  // from server test snapshot
  container.innerHTML =
    '<div><a href="/" class="active">Home</a><a href="/users">Users</a><a href="/users/123">User</a><div>Home</div></div>';

  document.body.appendChild(container);
  render(<App />, { container, hydrate: true });
});
