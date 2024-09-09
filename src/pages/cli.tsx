import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import Icon from "@mittwald/flow-react-components/Icon";
import { IconBrandGithub, IconNotebook, IconRocket } from "@tabler/icons-react";

import styles from "./cli.module.css";
import demo from "@site/static/img/cli-demo.png";
import Translate, { translate } from "@docusaurus/Translate";
import ScriptingFeature from "@site/src/components/CLIFeatures/ScriptingFeature";
import DevelopmentFeature from "@site/src/components/CLIFeatures/DevelopmentFeature";

function CLIPageHeader() {
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">
          <code>mw</code> –{" "}
          <Translate id={"cli.title"}>the mittwald command-line tool</Translate>
        </h1>
        <p className={styles.heroDescription}>
          <Translate id={"cli.description"}>
            The mittwald CLI is a powerful, easy-to-use tool for managing your
            mittwald products and services. It allows you to interact with our
            API, manage your resources and automate your workflows.
          </Translate>
          <img
            src={demo}
            alt={translate({
              id: "cli.img.alt",
              message:
                "An example usage of the mittwald CLI. The screenshot shows how to list projects and how to install a new Wordpress instance using the CLI.",
            })}
          />
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--success button--lg"
            to="/docs/v2/cli/usage/intro"
          >
            <Icon>
              <IconRocket />
            </Icon>
            <Translate id={"cli.cta"}>Get started with our CLI</Translate>
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/v2/category/cli"
          >
            <Icon>
              <IconNotebook />
            </Icon>
            <Translate id={"cli.full-docs"}>Full documentation</Translate>
          </Link>
          <Link
            className="button button--secondary button--lg"
            href="https://github.com/mittwald/cli"
          >
            <Icon>
              <IconBrandGithub />
            </Icon>
            Github
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <Layout
      title="mittwald CLI"
      description={translate({ id: "cli.description" })}
    >
      <div className={styles.wrapper}>
        <CLIPageHeader />
        <main className={"index"}>
          <ScriptingFeature />
          <DevelopmentFeature />
        </main>
      </div>
    </Layout>
  );
}
