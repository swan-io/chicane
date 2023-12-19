import { Link, useFocusReset } from "@swan-io/chicane/src";
import { useRef } from "react";
import { match } from "ts-pattern";
import { Router } from "./router";

const EXAMPLE_DATA: Record<string, string[]> = {
  zoontek: [
    "react-native-permissions",
    "react-native-bootsplash",
    "react-native-localize",
    "valienv",
    "react-atomic-state",
  ],
  bloodyowl: [
    "rescript-recoil",
    "reshowcase",
    "rescript-react-starter-kit",
    "rescript-future",
    "rescript-asyncdata",
  ],
  mbreton: [
    "ember-router-example",
    "git-dummy-test",
    "hands-on-devoxx-fr-2015",
    "clap-detector",
    "dart_bootstrap",
  ],
};

export const App = () => {
  const route = Router.useRoute(["Home", "UsersArea"]);
  const containerRef = useRef(null);

  useFocusReset(containerRef);

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
        <Link to={Router.Home()} activeStyle={{ fontWeight: 700 }}>
          Home
        </Link>

        <Link to={Router.Users()} activeStyle={{ fontWeight: 700 }}>
          Users
        </Link>
      </nav>

      <main
        ref={containerRef}
        style={{ display: "flex", flexDirection: "column" }}
      >
        {match(route)
          .with({ name: "Home" }, () => <h1>Home</h1>)
          .with({ name: "UsersArea" }, () => <UsersArea />)
          .with(undefined, () => <h1>404 - Page not found</h1>)
          .exhaustive()}
      </main>
    </div>
  );
};

const UsersArea = () => {
  const route = Router.useRoute(["Users", "User", "RepositoriesArea"]);
  const containerRef = useRef(null);

  useFocusReset(containerRef);

  return (
    <div
      ref={containerRef}
      style={{ display: "flex", flexDirection: "column" }}
    >
      {match(route)
        .with({ name: "Users" }, () => (
          <>
            <h1>Users</h1>

            {Object.keys(EXAMPLE_DATA).map((userId) => (
              <Link key={userId} to={Router.User({ userId })}>
                {userId}
              </Link>
            ))}
          </>
        ))
        .with({ name: "User" }, ({ params: { userId } }) => (
          <>
            <h1>{userId}</h1>
            <p>{userId} homepage</p>

            <Link to={Router.Repositories({ userId })}>His repositories</Link>
          </>
        ))
        .with({ name: "RepositoriesArea" }, ({ params }) => (
          <RepositoriesArea userId={params.userId} />
        ))
        .with(undefined, () => <h1>404 - Page not found</h1>)
        .exhaustive()}
    </div>
  );
};

const RepositoriesArea = ({ userId }: { userId: string }) => {
  const route = Router.useRoute(["Repositories", "Repository"]);
  const containerRef = useRef(null);

  useFocusReset(containerRef);

  return (
    <div ref={containerRef}>
      <h1>{userId} repositories</h1>

      {match(route)
        .with({ name: "Repositories" }, () => (
          <ul>
            {EXAMPLE_DATA[userId]?.map((repositoryId) => (
              <li key={repositoryId}>
                <Link to={Router.Repository({ userId, repositoryId })}>
                  {repositoryId}
                </Link>
              </li>
            ))}
          </ul>
        ))
        .with(
          { name: "Repository" },
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
