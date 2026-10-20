import React, { type ReactNode } from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Translate from "@docusaurus/Translate";
import {
  useActivePlugin,
  useDocVersionSuggestions,
  useDocsPreferredVersion,
  useDocsVersion,
} from "@docusaurus/plugin-content-docs/client";
import type {
  GlobalVersion,
  PropVersionMetadata,
} from "@docusaurus/plugin-content-docs/client";
import { ThemeClassNames } from "@docusaurus/theme-common";
import type { Props } from "@theme/DocVersionBanner";
import {
  Alert,
  Content,
  Heading,
  Link,
  Text,
} from "@mittwald/flow-react-components";
import styles from "./styles.module.css";

/**
 * Banner on unmaintained or unreleased doc versions (e.g. the API v1 docs) as
 * Flow warning alert: the version notice is the heading, the link to the
 * latest version the content. Ejected from @docusaurus/theme-classic.
 */

function BannerLabel({
  siteTitle,
  versionMetadata,
}: {
  siteTitle: string;
  versionMetadata: PropVersionMetadata;
}) {
  const values = { siteTitle, versionLabel: versionMetadata.label };
  if (versionMetadata.banner === "unreleased") {
    return (
      <Translate
        id="theme.docs.versions.unreleasedVersionLabel"
        description="The label used to tell the user that he's browsing an unreleased doc version"
        values={values}
      >
        {
          "This is unreleased documentation for {siteTitle} {versionLabel} version."
        }
      </Translate>
    );
  }
  return (
    <Translate
      id="theme.docs.versions.unmaintainedVersionLabel"
      description="The label used to tell the user that he's browsing an unmaintained doc version"
      values={values}
    >
      {
        "This is documentation for {siteTitle} {versionLabel}, which is no longer actively maintained."
      }
    </Translate>
  );
}

function DocVersionBannerEnabled({
  className,
  versionMetadata,
}: Props & { versionMetadata: PropVersionMetadata }) {
  const {
    siteConfig: { title: siteTitle },
  } = useDocusaurusContext();
  const { pluginId } = useActivePlugin({ failfast: true })!;
  const getVersionMainDoc = (version: GlobalVersion) =>
    version.docs.find((doc) => doc.id === version.mainDocId)!;
  const { savePreferredVersionName } = useDocsPreferredVersion(pluginId);
  const { latestDocSuggestion, latestVersionSuggestion } =
    useDocVersionSuggestions(pluginId);
  // Try to link to same doc in latest version (not always possible), falling
  // back to main doc of latest version
  const latestVersionSuggestedDoc =
    latestDocSuggestion ?? getVersionMainDoc(latestVersionSuggestion);

  return (
    <Alert
      status="warning"
      className={clsx(
        className,
        ThemeClassNames.docs.docVersionBanner,
        styles.banner,
      )}
    >
      <Heading>
        <BannerLabel siteTitle={siteTitle} versionMetadata={versionMetadata} />
      </Heading>
      <Content>
        <Text>
          <Translate
            id="theme.docs.versions.latestVersionSuggestionLabel"
            description="The label used to tell the user to check the latest version"
            values={{
              versionLabel: latestVersionSuggestion.label,
              latestVersionLink: (
                <Link
                  inline
                  href={latestVersionSuggestedDoc.path}
                  onPress={() =>
                    savePreferredVersionName(latestVersionSuggestion.name)
                  }
                >
                  <Translate
                    id="theme.docs.versions.latestVersionLinkLabel"
                    description="The label used for the latest version suggestion link label"
                  >
                    latest version
                  </Translate>
                </Link>
              ),
            }}
          >
            {
              "For up-to-date documentation, see the {latestVersionLink} ({versionLabel})."
            }
          </Translate>
        </Text>
      </Content>
    </Alert>
  );
}

export default function DocVersionBanner({ className }: Props): ReactNode {
  const versionMetadata = useDocsVersion();
  if (!versionMetadata.banner) {
    return null;
  }
  return (
    <DocVersionBannerEnabled
      className={className}
      versionMetadata={versionMetadata}
    />
  );
}
