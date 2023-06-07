import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import Translate from "@docusaurus/Translate";
import Link from "@docusaurus/Link";

const issueTrackerURL =
  "https://github.com/mittwald/developer-portal/issues/new?assignees=&labels=suggestion&projects=&template=suggestion.md";
const FeatureList = [
  {
    title: (
      <Translate id="index.getting-started.title">Getting started</Translate>
    ),
    description: (
      <>
        <p>
          <Translate id={"index.getting-started.body"}>
            Follow our how-tos to get started with our API.
          </Translate>
        </p>
        <ul>
          <li>
            <Link to={"/docs/v2/api/intro"}>
              <Translate id="index.getting-started.connecting">
                Connecting and authenticating
              </Translate>
            </Link>
          </li>
          <li>
            <Link to={"/docs/v2/api/howtos/create-project"}>
              <Translate id="index.getting-started.creating-projects">
                Creating and managing projects
              </Translate>
            </Link>
          </li>
          <li>
            <Link to={"/docs/v2/api/howtos/manage-mailbox"}>
              <Translate id="index.getting-started.manage-mailbox">
                Managing email accounts
              </Translate>
            </Link>
          </li>
          <li>
            <Link to={"/docs/v2/api/howtos/create-nodejs"}>
              <Translate id="index.getting-started.create-nodejs">
                Installing a Node.js application
              </Translate>
            </Link>
          </li>
          {/*
          <li>
            <Link to={"/docs/v2/category/how-tos"}>
              <Translate id="index.getting-started.more">more</Translate>
            </Link>
          </li>
          */}
        </ul>
        <p>
          <strong>
            <Translate id={"index.getting-started.missing"}>
              Missing something?
            </Translate>
          </strong>{" "}
          <Translate id="index.getting-started.more-soon">
            More how-tos are coming soon.
          </Translate>{" "}
          <Link href={issueTrackerURL}>
            <Translate id="index.getting-started.missing.cta">
              Use this project's issue tracker to leave a suggestion.
            </Translate>
          </Link>
        </p>
      </>
    ),
  },
  {
    title: <Translate id={"index.reference.title"}>API Reference</Translate>,
    description: (
      <>
        <p>
          <Translate id={"index.reference.body"}>
            All endpoints and parameters of our API at a glance, including human
            readable references and machine readable specifications in the
            OpenAPI format.
          </Translate>
        </p>
        <ul>
          <li>
            <strong>
              <Translate id={"index.reference.v1"}>
                v1 API (Customer Center)
              </Translate>
            </strong>
            <br />
            <Link to={"https://mittwald-api.de"}>
              <Translate id={"index.reference.reference"}>Reference</Translate>
            </Link>{" "}
            |{" "}
            <a href={"https://mittwald-api.de/docs/swagger-public.json"}>
              <Translate id={"index.reference.swagger"}>
                Swagger 2.0 specification
              </Translate>
            </a>
          </li>
          <li>
            <strong>
              <Translate id={"index.reference.v2"}>v2 API (mStudio)</Translate>
            </strong>
            <br />
            <Link to={"/reference/v2"}>
              <Translate id={"index.reference.reference"}>Reference</Translate>
            </Link>{" "}
            |{" "}
            <a href={"https://api.mittwald.de/openapi"}>
              <Translate id={"index.reference.openapi"}>
                OpenAPI 3.0 specification
              </Translate>
            </a>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: <Translate id={"index.sdks.title"}>SDKs and Libraries</Translate>,
    description: (
      <>
        <p>
          <Translate id={"index.sdks.body"}>
            Make it easy for yourself and use one of our SDKs or libraries to
            integrate our API into your application:
          </Translate>
        </p>
        <ul>
          <li>
            <Link to="/docs/v2/api/sdks/javascript">
              mittwald JavaScript SDK
            </Link>{" "}
            (Node.js + browser)
          </li>
        </ul>
        <p>
          <strong>
            <Translate id={"index.sdks.coming-soon"}>Coming soon</Translate>: 🪄
          </strong>
        </p>
        <ul>
          <li>mittwald PHP SDK</li>
          <li>mittwald Go SDK</li>
        </ul>
        <p>
          <strong>
            <Translate id={"index.sdks.own-sdks"}>
              Have you built your own library that uses our API?
            </Translate>{" "}
            <Link href={issueTrackerURL}>
              <Translate id="index.sdks.issue">
                Let us know, and we'll link it here!
              </Translate>
            </Link>
            💙
          </strong>
        </p>
      </>
    ),
  },
];

function Feature({ title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className={clsx("padding--md", styles.feature)}>
        <h3>{title}</h3>
        {description}
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
