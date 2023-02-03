import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
    {
        title: 'Easy to Use',
        Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
        description: (
            <>
                Docusaurus was designed from the ground up to be easily installed and
                used to get your website up and running quickly.
            </>
        ),
    },
    {
        title: 'API Reference',
        Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
        description: (
            <>
                Docusaurus lets you focus on your docs, and we&apos;ll do the chores. Go
                ahead and move your docs into the <code>docs</code> directory.
            </>
        ),
    },
    {
        title: 'SDKs and Libraries',
        Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
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

function Feature({Svg, title, description}) {
    return (
        <div className={clsx('col col--4')}>
            <div className="text--center">
                <Svg className={styles.featureSvg} role="img"/>
            </div>
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
