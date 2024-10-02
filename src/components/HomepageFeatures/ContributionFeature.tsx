import Intro, { IntroHeader } from "../Intro";
import Translate from "@docusaurus/Translate";
import React from "react";
import FeatureRow from "../FeatureRow";
import clsx from "clsx";
import styles from "@site/src/components/HomepageFeatures/styles.module.css";
import Icon from "@mittwald/flow-react-components/Icon";
import { IconHeartHandshake } from "@tabler/icons-react";
import Link from "@docusaurus/Link";

function ContributionIntro() {
  return (
    <Intro>
      <IntroHeader>
        <Icon>
          <IconHeartHandshake />
        </Icon>
        <h3>
          <Translate id={"index.contribution.title"}>
            Build your own extensions for the mStudio marketplace
          </Translate>
        </h3>
      </IntroHeader>
      <p>
        <Translate id={"index.contribution.body"}>
          The mStudio marketplace is a platform for developers to build and
          distribute their own extensions. You can create extensions that
          integrate with the mStudio API and add new features to the mStudio
          platform.
        </Translate>
      </p>
    </Intro>
  );
}

function ExtensionsFeature() {
  return (
    <>
      <h3>
        <Translate id="index.contribution.extensions.title">
          Integrating extensions
        </Translate>
      </h3>
      <p>
        <Translate id={"index.contribution.extensions.body"}>
          These guides will help you get started with building extensions for
          the mStudio marketplace.
        </Translate>
      </p>
      <ul>
        <li>
          <Link to="/docs/v2/contribution">
            <Translate id="index.contribution.extensions.link-overview">
              Introduction and overview
            </Translate>
          </Link>
        </li>
        <li>
          <Link to="/docs/v2/contribution/overview/concepts/authentication/">
            <Translate id="index.contribution.extensions.link-auth">
              Integrating with mStudio access controls
            </Translate>
          </Link>
        </li>
        <li>
          <Link to="/docs/v2/category/reference/">
            <Translate id="index.contribution.extensions.link-api">
              API and webhook specifications
            </Translate>
          </Link>
        </li>
      </ul>
      <p>
        <Translate id="index.contribution.extensions.more">
          Check the complete documentation.
        </Translate>{" "}
        <Link to="/docs/v2/contribution">
          <Translate id="index.contribution.extensions.more.link">
            Read more!
          </Translate>
        </Link>
      </p>
    </>
  );
}

function ToolsFeature() {
  return (
    <>
      <h3>
        <Translate id="index.contribution.tools.title">
          Contributor tools
        </Translate>
      </h3>
      <p>
        <Translate id={"index.contribution.tools.body"}>
          These guides will help you get started with building extensions for
          the mStudio marketplace.
        </Translate>
      </p>
      <ul>
        <li>
          <strong>Flow</strong>:{" "}
          <Translate id="index.contribution.tools.flow">
            The mittwald design system and React component library.
          </Translate>
          <br />
          <Link href="https://github.com/mittwald/flow">GitHub</Link> |{" "}
          <Link href="https://mittwald.github.io/flow">Documentation</Link>
        </li>
      </ul>
      <p>
        <strong>
          <Translate id={"index.sdks.coming-soon"}>Coming soon</Translate>: 🪄
        </strong>
      </p>
      <ul>
        <li>
          <strong>Extension Deployment Manager</strong>:{" "}
          <Translate id="index.contribution.tools.edm">
            A utility application to help you implement the required extension
            webhooks and manage the lifecycle of your extension installations.
          </Translate>
        </li>
      </ul>
    </>
  );
}

export default function ContributionFeature() {
  return (
    <FeatureRow>
      <div className="container">
        <div className="row">
          <div className={clsx("col col--4")}>
            <ContributionIntro />
          </div>
          <div className={clsx("col col--4")}>
            <div className={clsx("padding--md", styles.feature)}>
              <ExtensionsFeature />
            </div>
          </div>
          <div className={clsx("col col--4")}>
            <div className={clsx("padding--md", styles.feature)}>
              <ToolsFeature />
            </div>
          </div>
        </div>
      </div>
    </FeatureRow>
  );
}
