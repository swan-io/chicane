import { match } from "ts-pattern";
import { Link } from "./Link";
import { createURL, useRoute } from "./router";

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
  const route = useRoute(["root", "users", "user", "repositoriesArea"]);

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
        <Link to={createURL("root")}>Homepage</Link>
        <Link to={createURL("users")}>Users</Link>
      </nav>

      <main style={{ display: "flex", flexDirection: "column" }}>
        {match(route)
          .with({ name: "root" }, () => <h1>Homepage</h1>)
          .with({ name: "users" }, () => (
            <>
              <h1>Users</h1>

              {Object.keys(EXAMPLE_DATA).map((userId) => (
                <Link key={userId} to={createURL("user", { userId })}>
                  {userId}
                </Link>
              ))}
            </>
          ))
          .with({ name: "user" }, ({ params: { userId } }) => (
            <>
              <h1>{userId}</h1>
              <p>{userId} homepage</p>

              <Link to={createURL("repositories", { userId })}>
                His repositories
              </Link>
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
  const route = useRoute(["repositories", "repository"]);

  return (
    <>
      <h1>{userId} repositories</h1>

      {match(route)
        .with({ name: "repositories" }, () => (
          <ul>
            {EXAMPLE_DATA[userId]?.map((repositoryId) => (
              <li key={repositoryId}>
                <Link to={createURL("repository", { userId, repositoryId })}>
                  {repositoryId}
                </Link>
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
    </>
  );
};
