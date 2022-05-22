/**
 * @jest-environment node
 */

import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import { createRouter, Link } from "../src";
import { ServerSideUrlProvider } from "../src/server";

const Router = createRouter({
  Home: "/",
  UserList: "/users",
  UserDetail: "/users/:userId",
});

const App = () => {
  const route = Router.useRoute(["UserList", "UserDetail"]);

  return (
    <>
      <Link to={Router.UserDetail({ userId: "123" })} activeClassName="active">
        User
      </Link>

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
    </>
  );
};

test("Should render correctly", () => {
  expect(
    ReactDOMServer.renderToString(
      <ServerSideUrlProvider
        value={{ pathname: "/users/123", search: "", hash: "" }}
      >
        <App />
      </ServerSideUrlProvider>,
    ),
  ).toMatchSnapshot();
});

// Will test hydration later
// test("Should hydrate correctly", () => {
//   const rendered = ReactDOMServer.renderToString(
//     <ServerSideUrlProvider
//       value={{ pathname: "/users/123", search: "", hash: "" }}
//     >
//       <App />
//     </ServerSideUrlProvider>,
//   );
//   const div = document.createElement("div");
//   div.innerHTML = rendered;
//   expect(() => ReactDOM.hydrate(<App />, div)).not.toThrow();
// });
