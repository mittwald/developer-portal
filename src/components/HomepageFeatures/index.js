import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
    {
        title: 'Getting started',
        description: (
            <>
                <p>
                    Follow our tutorial to get started with our API.
                </p>
                <ul>
                    <li><a href={"/docs/v2/concepts"}>Connecting and authenticating</a></li>
                    <li><a href={"/docs/v2/how-tos/create-project"}>Creating and managing projects</a></li>
                    <li><a href={"/docs/v2/how-tos/manage-mailbox.md"}>Managing email accounts</a></li>
                    <li>more</li>
                </ul>
            </>
        ),
    },
    {
        title: 'API Reference',
        description: (
            <>
                <p>
                    Find all of our API endpoints and their parameters in our API reference.
                </p>
                <ul>
                    <li><a href={"https://mittwald-api.de/"}>v1 API Reference (mittwald Customer Center)</a></li>
                    <li><a href={"https://api.mittwald.de/v2/docs/#/"}>v2 API Reference (mittwald Studio)</a></li>
                </ul>
            </>
        ),
    },
    {
        title: 'SDKs and Libraries',
        description: (
            <>
                <p>
                    We strive to provide you with comprehensive and easy-to-use SDKs and
                    libraries for all of our products in the future. Stay tuned!
                </p>
                <p>
                    <strong>Coming soon: 🪄</strong>
                </p>
                <ul>
                    <li>mittwald Node.JS SDK</li>
                    <li>mittwald PHP SDK</li>
                    <li>mittwald Go SDK</li>
                </ul>
            </>
        ),
    },
];

function Feature({title, description}) {
    return (
        <div className={clsx('col col--4')}>
            <div className="padding-horiz--md">
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
