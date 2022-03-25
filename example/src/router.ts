import { createRouter } from "../../src";

export const Router = createRouter({
  root: "/",
  users: "/users",
  user: "/users/:userId",
  repositoriesArea: "/users/:userId/repositories/*",
  repositories: "/users/:userId/repositories",
  repository: "/users/:userId/repositories/:repositoryId",
});
