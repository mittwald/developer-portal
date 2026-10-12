import React from "react";
import Layout from "@theme/Layout";
import {
  Heading,
  Image,
  InlineCode,
  Text,
} from "@mittwald/flow-react-components";
import { IconBrandGithub, IconNotebook, IconRocket } from "@tabler/icons-react";

import styles from "./cli.module.css";
import demo from "@site/static/img/cli-demo.png";
import Translate, { translate } from "@docusaurus/Translate";
import Hero, { HeroEntries, HeroEntry } from "@site/src/components/Hero";
import ScriptingFeature from "@site/src/components/CLIFeatures/ScriptingFeature";
import DevelopmentFeature from "@site/src/components/CLIFeatures/DevelopmentFeature";

function CLIPageHeader() {
  return (
    <Hero>
      <Heading level={1} size="xxl">
        <InlineCode>mw</InlineCode> –{" "}
        <Translate id={"cli.title"}>the mittwald command-line tool</Translate>
      </Heading>
      <Text elementType="p" align="center">
        <Translate id={"cli.description"}>
          The mittwald CLI is a powerful, easy-to-use tool for managing your
          mittwald products and services. It allows you to interact with our
          API, manage your resources and automate your workflows.
        </Translate>
      </Text>
      <Image
        src={demo}
        withRoundedCorners={false}
        className={styles.demo}
        alt={translate({
          id: "cli.img.alt",
          message:
            "An example usage of the mittwald CLI. The screenshot shows how to list projects and how to install a new Wordpress instance using the CLI.",
        })}
      />
      <HeroEntries>
        <HeroEntry
          href="/docs/v2/cli/usage/intro"
          icon={<IconRocket />}
          title={<Translate id={"cli.cta"}>Get started with our CLI</Translate>}
          description={
            <Translate id="cli.cta.description">
              Install the CLI, log in and run your first commands.
            </Translate>
          }
        />
        <HeroEntry
          href="/docs/v2/cli"
          icon={<IconNotebook />}
          title={<Translate id={"cli.full-docs"}>Full documentation</Translate>}
          description={
            <Translate id="cli.full-docs.description">
              All commands and options of the CLI at a glance.
            </Translate>
          }
        />
        <HeroEntry
          href="https://github.com/mittwald/cli"
          target="_blank"
          icon={<IconBrandGithub />}
          title="GitHub"
          description={
            <Translate id="cli.github.description">
              Browse the source code of the CLI and report issues.
            </Translate>
          }
        />
      </HeroEntries>
    </Hero>
  );
}

export default function Home() {
  return (
    <Layout
      title="mittwald CLI"
      description={translate({ id: "cli.description" })}
    >
      <CLIPageHeader />
      <main className={"index"}>
        <ScriptingFeature />
        <DevelopmentFeature />
      </main>
    </Layout>
  );
}
