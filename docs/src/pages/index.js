import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import CodeBlock from "@theme/CodeBlock";
import Layout from "@theme/Layout";
import clsx from "clsx";

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className={styles.heroLeft}>
        <img
          src={"./img/logo.svg"}
          alt="Chicane logo"
          className={styles.heroLogo}
        />
        <div>
          <h1 className={styles.heroTitle}>{siteConfig.title}</h1>
          <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
          <div className={styles.heroButtons}>
            <Link
              className={clsx("button button--lg", styles.heroButton)}
              to="/getting-started"
            >
              Get started
            </Link>
            <span className={styles.heroButtonSeparator} />
            <Link
              className={clsx("button button--lg", styles.heroButton)}
              to="/top-level-api"
            >
              API reference
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.heroCode}>
        <CodeBlock className={styles.heroCodeBlock} language="typescript">
          {`import { createRouter } from "@swan-io/chicane";
import { match } from "ts-pattern";

export const Router = createRouter({
  Home: "/",
  UserList: "/users",
  UserDetail: "/users/:userId",
});

const App = () => {
  const route = Router.useRoute(["UserList", "UserDetail"]);

  return match(route)
    .with({ name: "UserList" }, () => <UserList />)
    .with({ name: "UserDetail" }, ({ params }) => (
      <UserDetail userId={params.userId} />
    ))
    .otherwise(() => <NotFound />);
};
`}
        </CodeBlock>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Chicane: ${siteConfig.tagline}`}
      description="A safe router for React and TypeScript"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
