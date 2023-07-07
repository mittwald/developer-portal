import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";

import styles from "./index.module.css";
import Translate from "@docusaurus/Translate";
import { translate } from "@docusaurus/Translate";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">
          <Translate id={"index.title"}>Developer Portal</Translate>
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
  const { siteConfig } = useDocusaurusContext();
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
