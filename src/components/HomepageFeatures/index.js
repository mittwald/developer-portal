import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Translate from "@docusaurus/Translate";
import Link from "@docusaurus/Link";

const FeatureList = [
    {
        title: <Translate id="index.getting-started.title">Getting started</Translate>,
        description: (
            <>
                <p>
                    <Translate id={"index.getting-started.body"}>
                        Follow our tutorial to get started with our API.
                    </Translate>
                </p>
                <ul>
                    <li><Link to={"/docs/v2/intro"}>Connecting and authenticating</Link></li>
                    <li><Link to={"/docs/v2/howtos/create-project"}>Creating and managing projects</Link></li>
                    <li><Link to={"/docs/v2/howtos/manage-mailbox"}>Managing email accounts</Link></li>
                    <li><Link to={"/docs/v2/category/how-tos"}>more</Link></li>
                </ul>
            </>
        ),
    },
    {
        title: <Translate id={"index.reference.title"}>API Reference</Translate>,
        description: (
            <>
                <p>
                    <Translate id={"index.reference.body"}>
                        Find all of our API endpoints and their parameters in our API reference.
                    </Translate>
                </p>
                <ul>
                    <li>
                        <strong><Translate id={"index.reference.v1"}>v1 API (mittwald Customer Center)</Translate></strong><br />
                        <a href={"https://mittwald-api.de"}><Translate id={"index.reference.reference"}>Reference</Translate></a> | <a href={"https://mittwald-api.de/docs/swagger-public.json"}><Translate id={"index.reference.swagger"}>Swagger 2.0 specification</Translate></a>
                    </li>
                    <li>
                        <strong><Translate id={"index.reference.v2"}>v2 API (mittwald mStudio)</Translate></strong><br />
                        <a href={"https://api.mittwald.de/v2/docs/#/"}><Translate id={"index.reference.reference"}>Reference</Translate></a> | <a href={"https://api.mittwald.de/openapi"}><Translate id={"index.reference.openapi"}>OpenAPI 3.0 specification</Translate></a>
                    </li>
                </ul>
                <p>
                    <Translate id={"index.reference.explanation"}>
                        All of our API references are available in both human-readable form, and as a machine-readable OpenAPI specification.
                    </Translate>
                </p>
            </>
        ),
    },
    {
        title: <Translate id={"index.sdks.title"}>SDKs and Libraries</Translate>,
        description: (
            <>
                <p>
                    <Translate id={"index.sdks.body"}>
                        We strive to provide you with comprehensive and easy-to-use SDKs and
                        libraries for all of our products in the future. Stay tuned!
                    </Translate>
                </p>
                <p>
                    <strong><Translate id={"index.sdks.coming-soon"}>Coming soon</Translate>: 🪄</strong>
                </p>
                <ul>
                    <li>mittwald Node.JS SDK</li>
                    <li>mittwald PHP SDK</li>
                    <li>mittwald Go SDK</li>
                </ul>
                <p>
                    <strong><Translate id={"index.sdks.own-sdks"}>Have you built your own library that uses our API? Let us know, and we'll link it here!</Translate> 💙</strong>
                </p>
            </>
        ),
    },
];

function Feature({title, description}) {
    return (
        <div className={clsx('col col--4')}>
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
