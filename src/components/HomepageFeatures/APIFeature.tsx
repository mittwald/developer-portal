import FeatureRow from "../FeatureRow";
import Intro from "../Intro";
import Translate, { translate } from "@docusaurus/Translate";
import React, { ReactNode } from "react";
import { IssueTrackerLink } from "@site/src/components/IssueTrackerLink";
import LinkGroup from "@site/src/components/LinkGroup";
import FeatureCard from "@site/src/components/HomepageFeatures/FeatureCard";
import { Heading, Icon, Link, Text } from "@mittwald/flow-react-components";
import { IconPlug } from "@site/src/icons";
import { NewBadge } from "@site/src/components/NewBadge";

interface ReferenceLinkProps {
  version: string;
  title: string;
  additionalLinks?: ReactNode[];
  spec: {
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
    <Link key="ref" href={`/docs/${version}/reference`}>
      <Translate id={"index.reference.reference"}>Reference</Translate>
    </Link>,
    ...additionalLinks,
    <Link key="spec" href={spec.url} target="_blank">
      {spec.typeLabel}
    </Link>,
  ];
  return <LinkGroup title={title} links={links} />;
}

function APIIntro() {
  return (
    <Intro>
      <Icon>
        <IconPlug />
      </Icon>
      <Heading level={2} size="l">
        <Translate id={"index.api.title"}>
          Automate and integrate with our API
        </Translate>
      </Heading>
      <Text>
        <Translate id={"index.api.body"}>
          Our API allows you to manage your mittwald products and services
          programmatically. You can use it to automate tasks, integrate our
          services into your own applications, or build entirely new
          applications on top of our platform.
        </Translate>
      </Text>
    </Intro>
  );
}

function APIDocumentation() {
  return (
    <FeatureCard>
      <Heading level={3}>
        <Translate id="index.reference.title">API Reference</Translate>
      </Heading>
      <Text elementType="p">
        <Translate id={"index.reference.body"}>
          All endpoints and parameters of our API at a glance, including human
          readable references and machine readable specifications in the OpenAPI
          format.
        </Translate>
      </Text>
      <Text elementType="div">
        <ul>
          <li>
            <ReferenceLink
              version="v1"
              title={translate({ id: "index.reference.v1" })}
              spec={{
                url: "https://api.mittwald.de/v1/openapi.json",
                typeLabel: translate({ id: "index.reference.openapi" }),
              }}
            />
          </li>
          <li>
            <ReferenceLink
              version="v2"
              title={translate({ id: "index.reference.v2" })}
              additionalLinks={[
                <Link key="into" href="/docs/v2/api/intro">
                  <Translate id="index.reference.intro">Introduction</Translate>
                </Link>,
              ]}
              spec={{
                url: "https://api.mittwald.de/openapi",
                typeLabel: translate({ id: "index.reference.openapi" }),
              }}
            />
          </li>
        </ul>
      </Text>
      <Text elementType="p">
        <Translate id="index.reference.tutorials">
          We also provide tutorials and examples to help you get started with
          our API.
        </Translate>{" "}
        <Link href="/docs/v2/category/how-tos">
          <Translate id="index.reference.tutorials-link">
            Check them out!
          </Translate>
        </Link>
      </Text>
    </FeatureCard>
  );
}

function APILibraries() {
  return (
    <FeatureCard>
      <Heading level={3}>
        <Translate id="index.sdks.title">SDKs and libraries</Translate>
      </Heading>
      <Text elementType="p">
        <Translate id={"index.sdks.body"}>
          Make it easy for yourself and use one of our SDKs or libraries to
          integrate our API into your application:
        </Translate>
      </Text>
      <Text elementType="div">
        <ul>
          <li>
            <Link href="/cli">mittwald CLI</Link>
          </li>
          <li>
            <Link href="/docs/v2/api/sdks/php">mittwald PHP SDK</Link>
          </li>
          <li>
            <Link href="/docs/v2/api/sdks/javascript">
              mittwald JavaScript SDK
            </Link>{" "}
            <Translate id="index.sdks.javascript.platforms">
              (Node.js + browser)
            </Translate>
          </li>
          <li>
            <Link href="/docs/v2/api/sdks/python">mittwald Python SDK</Link>{" "}
            <NewBadge />
          </li>
          <li>
            <Link href="/docs/v2/api/sdks/go">mittwald Go SDK</Link>
          </li>
        </ul>
      </Text>
      <Text elementType="p">
        <strong>
          <Translate id={"index.sdks.own-sdks"}>
            Have you built your own library that uses our API?
          </Translate>
        </strong>{" "}
        <IssueTrackerLink type="suggestion">
          <Translate id="index.sdks.issue">
            Let us know, and we'll link it here!
          </Translate>
        </IssueTrackerLink>
      </Text>
    </FeatureCard>
  );
}

export default function APIFeature() {
  return (
    <FeatureRow variant intro={<APIIntro />}>
      <APIDocumentation />
      <APILibraries />
    </FeatureRow>
  );
}
