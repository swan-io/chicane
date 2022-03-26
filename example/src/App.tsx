import * as React from "react";
import { match } from "ts-pattern";
import { Router } from "./router";

const EXAMPLE_DATA: Record<string, string[]> = {
  zoontek: [
    "react-chicane",
    "react-ux-form",
    "react-native-permissions",
    "react-native-bootsplash",
    "react-native-localize",
  ],
  bloodyowl: [
    "rescript-recoil",
    "reshowcase",
    "rescript-react-starter-kit",
    "rescript-future",
    "rescript-asyncdata",
  ],
  MoOx: [
    "rescript-react-native",
    "phenomic",
    "pjax",
    "postcss-cssnext",
    "react-multiversal",
  ],
};

export const App = () => {
  const route = Router.useRoute(["root", "users", "user", "repositoriesArea"]);
  const containerRef = React.useRef(null);

  Router.useRouteFocus({ containerRef, route });

  return (
    <div style={{ display: "flex" }}>
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          padding: 20,
          minWidth: 200,
        }}
      >
        <Router.Link
          to={Router.createURL("root")}
          activeStyle={{ fontWeight: 700 }}
        >
          Homepage
        </Router.Link>

        <Router.Link
          to={Router.createURL("users")}
          activeStyle={{ fontWeight: 700 }}
        >
          Users
        </Router.Link>
      </nav>

      <main
        ref={containerRef}
        style={{ display: "flex", flexDirection: "column" }}
      >
        {match(route)
          .with({ name: "root" }, () => <h1>Homepage</h1>)
          .with({ name: "users" }, () => (
            <>
              <h1>Users</h1>

              {Object.keys(EXAMPLE_DATA).map((userId) => (
                <Router.Link
                  key={userId}
                  to={Router.createURL("user", { userId })}
                >
                  {userId}
                </Router.Link>
              ))}
            </>
          ))
          .with({ name: "user" }, ({ params: { userId } }) => (
            <>
              <h1>{userId}</h1>
              <p>{userId} homepage</p>

              <Router.Link to={Router.createURL("repositories", { userId })}>
                His repositories
              </Router.Link>
            </>
          ))
          .with({ name: "repositoriesArea" }, ({ params }) => (
            <Repositories userId={params.userId} />
          ))
          .with(undefined, () => <h1>404 - Page not found</h1>)
          .exhaustive()}
      </main>
    </div>
  );
};

const Repositories = ({ userId }: { userId: string }) => {
  const route = Router.useRoute(["repositories", "repository"]);
  const containerRef = React.useRef(null);

  Router.useRouteFocus({ containerRef, route });

  return (
    <div ref={containerRef}>
      <h1>{userId} repositories</h1>

      {match(route)
        .with({ name: "repositories" }, () => (
          <ul>
            {EXAMPLE_DATA[userId]?.map((repositoryId) => (
              <li key={repositoryId}>
                <Router.Link
                  to={Router.createURL("repository", { userId, repositoryId })}
                >
                  {repositoryId}
                </Router.Link>
              </li>
            ))}
          </ul>
        ))
        .with(
          { name: "repository" },
          ({ params: { userId, repositoryId } }) => (
            <h2>
              {userId}/{repositoryId}
            </h2>
          ),
        )
        .with(undefined, () => <div>404 - Repository not found</div>)
        .exhaustive()}
    </div>
  );
};
