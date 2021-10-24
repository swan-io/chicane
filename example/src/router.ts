import { createRouter } from "react-chicane";

export const { createURL, useLink, useLocation, useRoute } = createRouter({
  root: "/",

  users: "/users",
  user: "/users/:userId",

  "repositories*": "/users/:userId/repositories*",
  repositories: "/users/:userId/repositories",
  repository: "/users/:userId/repositories/:repositoryId",
});
