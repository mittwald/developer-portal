import clsx from "clsx";
import styles from "@site/src/components/HomepageFeatures/styles.module.css";
import FeatureRow from "../FeatureRow";
import Intro, { IntroHeader } from "../Intro";
import Translate, { translate } from "@docusaurus/Translate";
import Link from "@docusaurus/Link";
import React, { ReactNode } from "react";
import { IssueTrackerLink } from "@site/src/components/IssueTrackerLink";
import LinkGroup from "@site/src/components/LinkGroup";
import Icon from "@mittwald/flow-react-components/Icon";
import { IconPlugConnected } from "@tabler/icons-react";

interface ReferenceLinkProps {
  version: string;
  title: string;
  additionalLinks?: ReactNode[];
  spec: {
    type: "openapi" | "swagger";
    typeLabel: string;
    url: string;
  };
}

function ReferenceLink({
  version,
  title,
  additionalLinks = [],
  spec,
}: ReferenceLinkProps) {
  const links = [
    <Link key="ref" to={`/docs/${version}/reference`}>
      <Translate id={"index.reference.reference"}>Reference</Translate>
    </Link>,
    ...additionalLinks,
    <Link key="spec" href={spec.url}>
      {spec.typeLabel}
    </Link>,
  ];
  return (
    <>
      <LinkGroup title={title} links={links} />
    </>
  );
}

function APIIntro() {
  return (
    <Intro>
      <IntroHeader>
        <Icon>
          <IconPlugConnected />
        </Icon>
        <h3>
          <Translate id={"index.api.title"}>
            Automate and integrate with our API
          </Translate>
        </h3>
      </IntroHeader>
      <p>
        <Translate id={"index.api.body"}>
          Our API allows you to manage your mittwald products and services
          programmatically. You can use it to automate tasks, integrate our
          services into your own applications, or build entirely new
          applications on top of our platform.
        </Translate>
      </p>
    </Intro>
  );
}

function APIDocumentation() {
  return (
    <>
      <h3>
        <Translate id="index.reference.title">API documentation</Translate>
      </h3>
      <p>
        <Translate id={"index.reference.body"}>
          All endpoints and parameters of our API at a glance, including human
          readable references and machine readable specifications in the OpenAPI
          format.
        </Translate>
      </p>
      <ul>
        <li>
          <ReferenceLink
            version="v1"
            title={translate({ id: "index.reference.v1" })}
            spec={{
              url: "https://api.mittwald.de/v1/openapi.json",
              typeLabel: translate({ id: "index.reference.openapi" }),
              type: "openapi",
            }}
          />
        </li>
        <li>
          <ReferenceLink
            version="v2"
            title={translate({ id: "index.reference.v2" })}
            additionalLinks={[
              <Link key="into" to="/docs/v2/api/intro">
                <Translate id="index.reference.intro">Introduction</Translate>
              </Link>,
            ]}
            spec={{
              url: "https://api.mittwald.de/openapi",
              typeLabel: translate({ id: "index.reference.openapi" }),
              type: "openapi",
            }}
          />
        </li>
      </ul>
      <p>
        <Translate id="index.reference.tutorials">
          We also provide tutorials and examples to help you get started with
          our API.
        </Translate>{" "}
        <Link to="/docs/v2/category/how-tos">
          <Translate id="index.reference.tutorials-link">
            Check them out!
          </Translate>
        </Link>
      </p>
    </>
  );
}

function APILibraries() {
  return (
    <>
      <h3>
        <Translate id="index.sdks.title">SDKs and Libraries</Translate>
      </h3>
      <p>
        <Translate id={"index.sdks.body"}>
          Make it easy for yourself and use one of our SDKs or libraries to
          integrate our API into your application:
        </Translate>
      </p>
      <ul>
        <li>
          <Link to="/docs/v2/api/sdks/cli">mittwald CLI</Link>
        </li>
        <li>
          <Link to="/docs/v2/api/sdks/php">mittwald PHP SDK</Link>
        </li>
        <li>
          <Link to="/docs/v2/api/sdks/javascript">mittwald JavaScript SDK</Link>{" "}
          (Node.js + browser)
        </li>
      </ul>
      <p>
        <strong>
          <Translate id={"index.sdks.coming-soon"}>Coming soon</Translate>: 🪄
        </strong>
      </p>
      <ul>
        <li>mittwald Go SDK</li>
      </ul>
      <p>
        <strong>
          <Translate id={"index.sdks.own-sdks"}>
            Have you built your own library that uses our API?
          </Translate>{" "}
          <IssueTrackerLink type="suggestion">
            <Translate id="index.sdks.issue">
              Let us know, and we'll link it here!
            </Translate>
          </IssueTrackerLink>{" "}
          💙
        </strong>
      </p>
    </>
  );
}

export default function APIFeature() {
  return (
    <FeatureRow variant>
      <div className="container">
        <div className="row">
          <div className={clsx("col col--4")}>
            <APIIntro />
          </div>
          <div className={clsx("col col--4")}>
            <div className={clsx("padding--md", styles.feature)}>
              <APIDocumentation />
            </div>
          </div>
          <div className={clsx("col col--4")}>
            <div className={clsx("padding--md", styles.feature)}>
              <APILibraries />
            </div>
          </div>
        </div>
      </div>
    </FeatureRow>
  );
}
