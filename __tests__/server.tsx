/**
 * @vitest-environment node
 */

import { renderToString } from "react-dom/server";
import { expect, test } from "vitest";
import { Link, createRouter } from "../src";
import { UrlProvider } from "../src/server";

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
      <UrlProvider value="/">
        <App />
      </UrlProvider>,
    ),
  ).toMatchSnapshot();
});

test("Should render users page correctly", () => {
  expect(
    renderToString(
      <UrlProvider value="/users">
        <App />
      </UrlProvider>,
    ),
  ).toMatchSnapshot();
});

test("Should render user page correctly", () => {
  expect(
    renderToString(
      <UrlProvider value="/users/123">
        <App />
      </UrlProvider>,
    ),
  ).toMatchSnapshot();
});
