import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";

import styles from "./index.module.css";
import Translate, { translate } from "@docusaurus/Translate";

function HomepageHeader() {
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">
          <Translate id={"index.title"}>mittwald Developer Portal</Translate>
        </h1>
        <div className={styles.buttons}>
          <Link
            className="button button--success button--lg"
            to="/docs/v2/api/intro"
          >
            <Translate id={"index.cta"}>Get started with our API</Translate>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <Layout
      description={translate({
        id: "index.description",
        message:
          "The mittwald Developer Portal provides developers with the resources they need to integrate mittwald products into their own applications using our API.",
      })}
    >
      <div className={styles.wrapper}>
        <HomepageHeader />
        <main className={"index"}>
          <HomepageFeatures />
        </main>
      </div>
    </Layout>
  );
}
