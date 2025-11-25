/**
 * @vitest-environment node
 */

import { renderToString } from "react-dom/server";
import { expect, test } from "vitest";
import { Link, ServerUrlProvider, createRouter } from "../src";

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

test("Should render home page correctly", () => {
  expect(
    renderToString(
      <ServerUrlProvider value="/">
        <App />
      </ServerUrlProvider>,
    ),
  ).toMatchSnapshot();
});

test("Should render users page correctly", () => {
  expect(
    renderToString(
      <ServerUrlProvider value="/users">
        <App />
      </ServerUrlProvider>,
    ),
  ).toMatchSnapshot();
});

test("Should render user page correctly", () => {
  expect(
    renderToString(
      <ServerUrlProvider value="/users/123">
        <App />
      </ServerUrlProvider>,
    ),
  ).toMatchSnapshot();
});
