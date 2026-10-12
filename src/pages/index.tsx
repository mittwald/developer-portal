import React, { type ReactNode } from "react";
import clsx from "clsx";
import Translate, { translate } from "@docusaurus/Translate";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Layout from "@theme/Layout";
import ThemedImage from "@theme/ThemedImage";
import {
  AccentBox,
  ColumnLayout,
  Heading,
  Icon,
  IllustratedMessage,
  Link,
  Text,
} from "@mittwald/flow-react-components";
import { IconPlugConnected, IconRobot, IconRocket } from "@tabler/icons-react";

import APIFeature from "@site/src/components/HomepageFeatures/APIFeature";
import ContributionFeature from "@site/src/components/HomepageFeatures/ContributionFeature";
import PlatformFeature from "@site/src/components/HomepageFeatures/PlatformFeature";

import styles from "./index.module.css";

/** An entry point in the hero: a linked accent box with an illustrated message */
function HeroEntry({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: ReactNode;
  title: ReactNode;
  description: ReactNode;
}) {
  return (
    <Link href={href} className={styles.entry}>
      <AccentBox backgroundColor="neutral" className={styles.entryBox}>
        <IllustratedMessage>
          <Icon>{icon}</Icon>
          <Heading level={2}>{title}</Heading>
          <Text>{description}</Text>
          {/* Looks like a link for those who don't expect the whole box to
              be one; a real link inside the linked box would be invalid */}
          <Text className={styles.entryLink}>
            <Translate id={"index.cta.more"}>Learn more</Translate>
          </Text>
        </IllustratedMessage>
      </AccentBox>
    </Link>
  );
}

function HomepageHeader() {
  const lightLogo = useBaseUrl("/img/mittwald-logo-dark.svg");
  const darkLogo = useBaseUrl("/img/mittwald-logo.svg");

  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className={clsx("hero__title", styles.heroTitle)}>
          <ThemedImage
            className={styles.heroLogo}
            sources={{ light: lightLogo, dark: darkLogo }}
            alt="mittwald"
          />
          <Translate id={"index.title"}>Developer Portal</Translate>
        </h1>
        <ColumnLayout
          s={[1]}
          m={[1, 1]}
          l={[1, 1, 1]}
          className={styles.entries}
        >
          <HeroEntry
            href="/docs/v2/guides/deployment"
            icon={<IconRocket />}
            title={
              <Translate id={"index.cta.deploy"}>
                Deploy your first app
              </Translate>
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
              <Translate id={"index.cta.agents"}>
                Connect your AI agent
              </Translate>
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
        </ColumnLayout>
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
