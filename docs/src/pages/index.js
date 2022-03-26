import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import CodeBlock from "@theme/CodeBlock";
import Layout from "@theme/Layout";
import * as React from "react";
import HomepageFeatures from "../components/HomepageFeatures";
import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={"hero hero--primary " + styles.hero}>
      <img src={"./img/logo.svg"} alt="" className={styles.logo} />
      <div className="container">
        <h1 className={styles.heroTitle}>{siteConfig.title}</h1>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
        <div>
          <Link className="button button--lg" to="/getting-started">
            Get started
          </Link>
          <span className={styles.separator} />
          <Link className="button button--lg" to="/option">
            API reference
          </Link>
        </div>
      </div>
      <div className={styles.code}>
        <CodeBlock className={styles.codeBlock} language={"typescript"}>
          {`import { createRouter } from "@swan-io/chicane";
import { match } from "ts-pattern";

export const Router = createRouter({
  Home: "/",
  UserList: "/users",
  UserDetail: "/users/:userId",
})

const App = () => {
  const route = Router.useRoute(["UserList", "UserDetail"]);

  return match(route)
    .with({name: "UserList"}, () => <UserList />)
    .with({name: "UserDetail"}, ({params: {userId}}) =>
      <UserDetail userId={userId} />
    )
    .otherwise(() => <NotFound />)
}
`}
        </CodeBlock>
      </div>
    </header>
  );
}

const Home = () => {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`Chicane: ${siteConfig.tagline}`}
      description="A router for React that protects you"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
};

export default Home;
