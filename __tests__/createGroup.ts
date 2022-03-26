import { createGroup } from "../src";

test("createGroup prefix routes keys / paths", () => {
  const routes = {
    Home: "/",
    User: "/:userName",

    ...createGroup("Repository", "/:repositoryName", {
      Root: "/",
      Issues: "/issues",
      Pulls: "/pulls",
      Actions: "/actions",
      Projects: "/projects",
      Security: "/security",

      ...createGroup("Settings", "/settings", {
        Root: "/",
        Collaborators: "/access",
        Branches: "/branches",
        Actions: "/actions",
        Webhooks: "/hooks",
        Pages: "/pages",
        SecurityAnalysis: "/security_analysis",
        DeployKeys: "/keys",
        Secrets: "/secrets",
      }),
    }),
  } as const;

  expect(routes).toEqual({
    Home: "/",
    User: "/:userName",

    RepositoryRoot: "/:repositoryName",
    RepositoryIssues: "/:repositoryName/issues",
    RepositoryPulls: "/:repositoryName/pulls",
    RepositoryActions: "/:repositoryName/actions",
    RepositoryProjects: "/:repositoryName/projects",
    RepositorySecurity: "/:repositoryName/security",

    RepositorySettingsRoot: "/:repositoryName/settings",
    RepositorySettingsCollaborators: "/:repositoryName/settings/access",
    RepositorySettingsBranches: "/:repositoryName/settings/branches",
    RepositorySettingsActions: "/:repositoryName/settings/actions",
    RepositorySettingsWebhooks: "/:repositoryName/settings/hooks",
    RepositorySettingsPages: "/:repositoryName/settings/pages",
    RepositorySettingsSecurityAnalysis:
      "/:repositoryName/settings/security_analysis",
    RepositorySettingsDeployKeys: "/:repositoryName/settings/keys",
    RepositorySettingsSecrets: "/:repositoryName/settings/secrets",
  });
});
