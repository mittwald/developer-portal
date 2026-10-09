import React, { type ReactNode } from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
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

import styles from "./index.module.css";
import Translate, { translate } from "@docusaurus/Translate";
import APIFeature from "@site/src/components/HomepageFeatures/APIFeature";
import PlatformFeature from "@site/src/components/HomepageFeatures/PlatformFeature";
import ContributionFeature from "@site/src/components/HomepageFeatures/ContributionFeature";

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
          <Heading level={2} size="s">
            {title}
          </Heading>
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
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">
          <Translate id={"index.title"}>mittwald Developer Portal</Translate>
        </h1>
        <ColumnLayout s={[1]} m={[1, 1, 1]} className={styles.entries}>
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
      <div className={styles.wrapper}>
        <HomepageHeader />
        <main className={"index"}>
          <PlatformFeature />
          <APIFeature />
          <ContributionFeature />
        </main>
      </div>
    </Layout>
  );
}
