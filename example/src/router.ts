import { createRouter } from "../../src";

export const {
  createURL,
  goBack,
  goForward,
  navigate,
  replace,
  subscribe,
  unsafeNavigate,
  unsafeReplace,
  useLink,
  useLocation,
  useRoute,
  useBlocker,
} = createRouter({
  root: "/",
  users: "/users",
  user: "/users/:userId",
  repositoriesArea: "/users/:userId/repositories/*",
  repositories: "/users/:userId/repositories",
  repository: "/users/:userId/repositories/:repositoryId",
});
