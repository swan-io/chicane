import { createGroup } from "../src";

test("createGroup prefix routes keys / paths", () => {
  const routes = {
    root: "/",
    user: "/:userName",

    ...createGroup("repository", "/:repositoryName", {
      root: "/",
      issues: "/issues",
      pulls: "/pulls",
      actions: "/actions",
      projects: "/projects",
      security: "/security",

      ...createGroup("settings", "/settings", {
        root: "/",
        collaborators: "/access",
        branches: "/branches",
        actions: "/actions",
        webhooks: "/hooks",
        pages: "/pages",
        securityAnalysis: "/security_analysis",
        deployKeys: "/keys",
        secrets: "/secrets",
      }),
    }),
  } as const;

  expect(routes).toEqual({
    root: "/",
    user: "/:userName",

    "repository.root": "/:repositoryName",
    "repository.issues": "/:repositoryName/issues",
    "repository.pulls": "/:repositoryName/pulls",
    "repository.actions": "/:repositoryName/actions",
    "repository.projects": "/:repositoryName/projects",
    "repository.security": "/:repositoryName/security",

    "repository.settings.root": "/:repositoryName/settings",
    "repository.settings.collaborators": "/:repositoryName/settings/access",
    "repository.settings.branches": "/:repositoryName/settings/branches",
    "repository.settings.actions": "/:repositoryName/settings/actions",
    "repository.settings.webhooks": "/:repositoryName/settings/hooks",
    "repository.settings.pages": "/:repositoryName/settings/pages",
    "repository.settings.securityAnalysis":
      "/:repositoryName/settings/security_analysis",
    "repository.settings.deployKeys": "/:repositoryName/settings/keys",
    "repository.settings.secrets": "/:repositoryName/settings/secrets",
  });
});
