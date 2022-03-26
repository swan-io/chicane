import React from "react";
import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "Easy to use",
    svg: (
      <svg
        className={styles.svg}
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.25 7a.75.75 0 0 1 .11 1.492l-.11.008H7a3.5 3.5 0 0 0-.206 6.994L7 15.5h2.25a.75.75 0 0 1 .11 1.492L9.25 17H7a5 5 0 0 1-.25-9.994L7 7h2.25ZM17 7a5 5 0 0 1 .25 9.994L17 17h-2.25a.75.75 0 0 1-.11-1.492l.11-.008H17a3.5 3.5 0 0 0 .206-6.994L17 8.5h-2.25a.75.75 0 0 1-.11-1.492L14.75 7H17ZM7 11.25h10a.75.75 0 0 1 .102 1.493L17 12.75H7a.75.75 0 0 1-.102-1.493L7 11.25h10H7Z"
          fill="#6240B5"
        />
      </svg>
    ),
    description: (
      <>
        With <strong>named, typed routes</strong>, your development experience
        is much simpler than passing unsafe URLs around.
      </>
    ),
  },
  {
    title: "Built for React Components",
    svg: (
      <svg
        className={styles.svg}
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 12a5 5 0 1 0-4.337-2.51l-2.714 1.808a4 4 0 1 0 .23 5.13l3.887 1.943a3 3 0 1 0 .671-1.341l-3.886-1.943a4.004 4.004 0 0 0-.113-2.513l2.863-1.907A4.982 4.982 0 0 0 16 12Zm0-1.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Zm-10 6a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5ZM17.5 19a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
          fill="#6240B5"
        />
      </svg>
    ),
    description: (
      <>
        The API we provide can be consumed <strong>from any component</strong>.
        We're not here to tell you how to organize your code.
      </>
    ),
  },
  {
    title: "Completely typesafe",
    svg: (
      <svg
        className={styles.svg}
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 2a4 4 0 0 1 4 4v2h1.75A2.25 2.25 0 0 1 18 10.25V11c-.319 0-.637.11-.896.329l-.107.1c-.164.17-.33.323-.496.457L16.5 10.25a.75.75 0 0 0-.75-.75H4.25a.75.75 0 0 0-.75.75v9.5c0 .414.336.75.75.75h9.888a6.024 6.024 0 0 0 1.54 1.5H4.25A2.25 2.25 0 0 1 2 19.75v-9.5A2.25 2.25 0 0 1 4.25 8H6V6a4 4 0 0 1 4-4Zm8.284 10.122c.992 1.036 2.091 1.545 3.316 1.545.193 0 .355.143.392.332l.008.084v2.501c0 2.682-1.313 4.506-3.873 5.395a.385.385 0 0 1-.253 0c-2.476-.86-3.785-2.592-3.87-5.13L14 16.585v-2.5c0-.23.18-.417.4-.417 1.223 0 2.323-.51 3.318-1.545a.389.389 0 0 1 .566 0ZM10 13.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm0-10A2.5 2.5 0 0 0 7.5 6v2h5V6A2.5 2.5 0 0 0 10 3.5Z"
          fill="#6240B5"
        />
      </svg>
    ),
    description: (
      <>
        Your routes are <strong>fully-typed</strong>, making it{" "}
        <strong>safe</strong> to create links and consume routes. You'll{" "}
        <strong>never forget a param</strong> again.
      </>
    ),
  },
];

function Feature({ svg, title, description }) {
  return (
    <div className="col col--4">
      <div className={styles.svgContainer}>{svg}</div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
