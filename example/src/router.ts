import { createRouter } from "../../src";

export const Router = createRouter({
  Home: "/",
  Users: "/users",
  User: "/users/:userId",
  RepositoriesArea: "/users/:userId/repositories/*",
  Repositories: "/users/:userId/repositories",
  Repository: "/users/:userId/repositories/:repositoryId",
});
