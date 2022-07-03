/**
 * @vitest-environment node
 */

import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import { expect, test } from "vitest";
import { createRouter, Link, ServerUrlProvider } from "../src";

const Router = createRouter({
  Home: "/",
  UserList: "/users",
  UserDetail: "/users/:userId",
});

const App = () => {
  const route = Router.useRoute(["UserList", "UserDetail"]);

  return (
    <div>
      <Link to={Router.UserDetail({ userId: "123" })} activeClassName="active">
        User
      </Link>

      <div>
        {(() => {
          switch (route?.name) {
            case "UserList":
              return "UserList";
            case "UserDetail":
              return "UserDetail";
            default:
              return "404";
          }
        })()}
      </div>
    </div>
  );
};

test("Should render correctly", () => {
  expect(
    ReactDOMServer.renderToString(
      <ServerUrlProvider value="/users/123">
        <App />
      </ServerUrlProvider>,
    ),
  ).toMatchSnapshot();
});

// TODO: Add an hydration test once this library targets React 18+
