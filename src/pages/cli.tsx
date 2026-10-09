import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import {
  Button,
  Icon,
  Link as FlowLink,
  Text,
} from "@mittwald/flow-react-components";
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
          <FlowLink href="/docs/v2/cli/usage/intro">
            <Button color="primary">
              <Icon>
                <IconRocket />
              </Icon>
              <Text>
                <Translate id={"cli.cta"}>Get started with our CLI</Translate>
              </Text>
            </Button>
          </FlowLink>
          <FlowLink href="/docs/v2/cli">
            <Button color="secondary">
              <Icon>
                <IconNotebook />
              </Icon>
              <Text>
                <Translate id={"cli.full-docs"}>Full documentation</Translate>
              </Text>
            </Button>
          </FlowLink>
          <FlowLink href="https://github.com/mittwald/cli" target="_blank">
            <Button color="secondary">
              <Icon>
                <IconBrandGithub />
              </Icon>
              <Text>Github</Text>
            </Button>
          </FlowLink>
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
