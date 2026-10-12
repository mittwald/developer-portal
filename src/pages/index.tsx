import React from "react";
import Translate, { translate } from "@docusaurus/Translate";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Layout from "@theme/Layout";
import ThemedImage from "@theme/ThemedImage";
import { Heading } from "@mittwald/flow-react-components";
import { IconPlugConnected, IconRobot, IconRocket } from "@tabler/icons-react";

import APIFeature from "@site/src/components/HomepageFeatures/APIFeature";
import ContributionFeature from "@site/src/components/HomepageFeatures/ContributionFeature";
import PlatformFeature from "@site/src/components/HomepageFeatures/PlatformFeature";

import Hero, { HeroEntries, HeroEntry } from "@site/src/components/Hero";

import styles from "./index.module.css";

function HomepageHeader() {
  const lightLogo = useBaseUrl("/img/mittwald-logo-dark.svg");
  const darkLogo = useBaseUrl("/img/mittwald-logo.svg");

  return (
    <Hero>
      <Heading level={1} size="xxl" className={styles.heroTitle}>
        <ThemedImage
          className={styles.heroLogo}
          sources={{ light: lightLogo, dark: darkLogo }}
          alt="mittwald"
        />
        <Translate id={"index.title"}>Developer Portal</Translate>
      </Heading>
      <HeroEntries>
        <HeroEntry
          href="/docs/v2/guides/deployment"
          icon={<IconRocket />}
          title={
            <Translate id={"index.cta.deploy"}>Deploy your first app</Translate>
          }
          description={
            <Translate id={"index.cta.deploy.description"}>
              Get your application running on the mittwald cloud platform.
            </Translate>
          }
        />
        <HeroEntry
          href="/docs/v2/agentic-integration"
          icon={<IconRobot />}
          title={
            <Translate id={"index.cta.agents"}>Connect your AI agent</Translate>
          }
          description={
            <Translate id={"index.cta.agents.description"}>
              Let your AI assistant manage your projects via MCP and agent
              skills.
            </Translate>
          }
        />
        <HeroEntry
          href="/docs/v2/api/intro"
          icon={<IconPlugConnected />}
          title={
            <Translate id={"index.cta"}>Get started with our API</Translate>
          }
          description={
            <Translate id={"index.cta.description"}>
              Automate your workflows with the mStudio API.
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
      description={translate({
        id: "index.description",
        message:
          "The mittwald Developer Portal provides developers with the resources they need to integrate mittwald products into their own applications using our API.",
      })}
    >
      <>
        <HomepageHeader />
        <main className={"index"}>
          <PlatformFeature />
          <APIFeature />
          <ContributionFeature />
        </main>
      </>
    </Layout>
  );
}
