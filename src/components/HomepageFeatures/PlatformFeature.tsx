import clsx from "clsx";
import FeatureRow from "../FeatureRow";
import Intro from "../Intro";
import Translate from "@docusaurus/Translate";
import React from "react";
import LinkGroup from "@site/src/components/LinkGroup";
import { NewBadge } from "@site/src/components/NewBadge";
import FeatureCard from "@site/src/components/HomepageFeatures/FeatureCard";
import { Heading, Icon, Link, Text } from "@mittwald/flow-react-components";
import { IconCloudNetwork } from "@tabler/icons-react";

function PlatformIntro() {
  return (
    <Intro>
      <Icon>
        <IconCloudNetwork />
      </Icon>
      <Heading level={2} size="l">
        <Translate id={"index.deploy.title"}>
          Deploy your software easily
        </Translate>
      </Heading>
      <Text>
        <Translate id={"index.deploy.body"}>
          Deploy your applications and services to our platform with ease. We
          support a variety of programming languages, frameworks and databases.
        </Translate>
      </Text>
    </Intro>
  );
}

function PlatformCoreFeatures() {
  return (
    <FeatureCard>
      <Heading level={3}>
        <Translate id="index.deploy.platform.title">
          Platform features
        </Translate>
      </Heading>
      <Text elementType="p">
        <Translate id={"index.deploy.platform.body"}>
          Our platform provides a variety of features to help you deploy your
          applications and services:
        </Translate>
      </Text>
      <Text elementType="div">
        <ul>
          <li>
            <LinkGroup
              title={
                <Translate id="index.deploy.platform.language">
                  Runtime environments
                </Translate>
              }
              links={[
                <Link href="/docs/v2/platform/workloads/php">PHP</Link>,
                <Link href="/docs/v2/platform/workloads/nodejs">Node.js</Link>,
                <Link href="/docs/v2/platform/workloads/python">Python</Link>,
                <>
                  <Link href="/docs/v2/platform/workloads/containers">
                    Container
                  </Link>{" "}
                  <NewBadge />
                </>,
              ]}
            />
          </li>
          <li>
            <LinkGroup
              title={
                <Translate id="index.deploy.platform.databases">
                  Databases
                </Translate>
              }
              links={[
                <Link href="/docs/v2/platform/databases/mysql">MySQL</Link>,
                <Link href="/docs/v2/platform/databases/redis">Redis</Link>,
                <Link href="/docs/v2/platform/databases/opensearch">
                  OpenSearch
                </Link>,
                <Link href="/docs/v2/platform/databases/solr">Solr</Link>,
              ]}
            />
          </li>
          <li>
            <LinkGroup
              title={
                <>
                  <Translate id="index.deploy.platform.aihosting">
                    AI-Hosting
                  </Translate>{" "}
                  <NewBadge />
                </>
              }
              links={[
                <Link href="/docs/v2/platform/aihosting/introduction">
                  <Translate id="index.deploy.platform.aihosting.intro">
                    Introduction
                  </Translate>
                </Link>,
                <Link href="/docs/v2/platform/aihosting/cms">
                  <Translate id="index.deploy.platform.aihosting.cms">
                    CMS and framework integrations
                  </Translate>
                </Link>,
              ]}
            />
          </li>
        </ul>
      </Text>
      <Text elementType="p">
        <Translate id="index.deploy.platform.features">
          Missing features?
        </Translate>{" "}
        <Link
          inline
          target="_blank"
          href="https://github.com/mittwald/feature-requests/issues"
        >
          <Translate id="index.deploy.platform.features-link">
            Request them here!
          </Translate>
        </Link>
      </Text>
    </FeatureCard>
  );
}

function PlatformTools() {
  return (
    <FeatureCard>
      <Heading level={3}>
        <Translate id="index.deploy.tools.title">
          Tooling and Integration
        </Translate>
      </Heading>
      <Text elementType="p">
        <Translate id="index.deploy.tools.body">
          We provide a variety of tools, integrations and tutorials to help you
          deploy your applications and services:
        </Translate>
      </Text>
      <Text elementType="div">
        <ul>
          <li>
            <LinkGroup
              title={
                <Translate id="index.deploy.tools.development">
                  Local development
                </Translate>
              }
              links={[
                <Link href="/cli">CLI</Link>,
                <Link href="/docs/v2/platform/development/ddev">DDEV</Link>,
              ]}
            />
          </li>
          <li>
            <LinkGroup
              title={
                <Translate id="index.deploy.tools.deployment-provisioning">
                  Deployment and Provisioning
                </Translate>
              }
              links={[
                <Link href="/docs/v2/guides/deployment/deployer">
                  Deployer
                </Link>,
                <Link href="/docs/v2/guides/deployment/typo3surf">
                  TYPO3 Surf
                </Link>,
                <>
                  <Link href="/docs/v2/guides/deployment/terraform">
                    Terraform
                  </Link>{" "}
                  <NewBadge />
                </>,
              ]}
            />
          </li>
          <li>
            <LinkGroup
              title={
                <Translate id="index.deploy.tools.agentic">
                  Agentic AI integration
                </Translate>
              }
              links={[
                <Link href="/mcp">MCP</Link>,
                <>
                  <Link href="/docs/v2/agentic-integration/agent-skills/">
                    Skills
                  </Link>{" "}
                  <NewBadge />
                </>,
              ]}
            />
          </li>
        </ul>
      </Text>
    </FeatureCard>
  );
}

export default function PlatformFeature() {
  return (
    <FeatureRow>
      <div className="container">
        <div className="row margin-bottom--lg">
          <div className="col col--12">
            <PlatformIntro />
          </div>
        </div>
        <div className="row">
          <div className={clsx("col col--6")}>
            <PlatformCoreFeatures />
          </div>
          <div className={clsx("col col--6")}>
            <PlatformTools />
          </div>
        </div>
      </div>
    </FeatureRow>
  );
}
