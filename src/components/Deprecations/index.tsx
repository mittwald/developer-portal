import React from "react";
import MDXComponents from "@theme/MDXComponents";
import {
  AccentBox,
  Badge,
  type BadgeProps,
  Button,
  Content,
  Flex,
  Icon,
  Label,
  LabeledValue,
  Link,
  Section,
  Text,
} from "@mittwald/flow-react-components";
import { IconRss } from "@site/src/icons";
import { scopeLabel } from "@site/src/plugins/deprecations/scopes";
import type {
  DeprecationScope,
  DeprecationStatus,
  DeprecationSummary,
} from "@site/src/plugins/deprecations/types";
import styles from "./styles.module.css";

/*
 * Components used in the MDX the deprecations plugin generates
 * (src/plugins/deprecations/mdx.ts)
 */

/**
 * Formats an ISO date (YYYY-MM-DD). In UTC, so that server and client render
 * the same date.
 */
function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(isoDate));
}

function scopeColor(scope: DeprecationScope): BadgeProps["color"] {
  if (scope === "product") return "violet";
  if (scope === "cli") return "teal";
  return "blue";
}

function ScopeBadges({ scopes }: { scopes: DeprecationScope[] }) {
  return (
    <>
      {scopes.map((scope) => (
        <Badge key={scope} color={scopeColor(scope)}>
          {scopeLabel(scope)}
        </Badge>
      ))}
    </>
  );
}

/** Status and scopes of a deprecation, above its title */
export function DeprecationBadges({
  status,
  scopes,
}: {
  status: DeprecationStatus;
  scopes: DeprecationScope[];
}) {
  return (
    <div className={styles.badges}>
      {status === "active" ? (
        <Badge color="orange">Deprecated</Badge>
      ) : (
        <Badge color="neutral">Sunset reached</Badge>
      )}
      <ScopeBadges scopes={scopes} />
    </div>
  );
}

/** Announcement and sunset date of a deprecation */
export function DeprecationFacts({
  announced,
  sunset,
}: {
  announced: string;
  sunset: string | null;
}) {
  return (
    <div className={styles.facts}>
      <LabeledValue>
        <Label>Announced</Label>
        <Content>{formatDate(announced)}</Content>
      </LabeledValue>
      <LabeledValue>
        <Label>Sunset</Label>
        <Content>{sunset ? formatDate(sunset) : "not scheduled yet"}</Content>
      </LabeledValue>
    </div>
  );
}

function FeedButton({ href, label }: { href: string; label: string }) {
  // A new tab: the feeds are static files, not routes the client-side router
  // could navigate to
  return (
    <Link href={href} target="_blank" className={styles.feedLink}>
      <Button variant="soft" color="secondary">
        <Icon>
          <IconRss />
        </Icon>
        <Text>{label}</Text>
      </Button>
    </Link>
  );
}

/** Subscription box for the feeds of the deprecations */
export function DeprecationFeeds({ rss, atom }: { rss: string; atom: string }) {
  return (
    <AccentBox className={styles.feeds}>
      <Section>
        <Flex align="center" wrap="wrap" gap="m">
          <Flex grow>
            <Text>
              <strong>Stay informed:</strong> subscribe to the feed to be
              notified about new deprecations.
            </Text>
          </Flex>
          <Flex wrap="wrap" gap="s">
            <FeedButton href={rss} label="RSS feed" />
            <FeedButton href={atom} label="Atom feed" />
          </Flex>
        </Flex>
      </Section>
    </AccentBox>
  );
}

/** Deprecations as table, rendered like a Markdown table */
export function DeprecationTable({
  deprecations,
}: {
  deprecations: DeprecationSummary[];
}) {
  const Table = MDXComponents.table;
  const Anchor = MDXComponents.a;

  return (
    <Table>
      <thead>
        <tr>
          <th>Deprecation</th>
          <th>Scope</th>
          <th>Announced</th>
          <th>Sunset</th>
        </tr>
      </thead>
      <tbody>
        {deprecations.map((d) => (
          <tr key={d.slug}>
            <td>
              <Anchor href={d.permalink}>{d.title}</Anchor>
              <span className={styles.summary}>{d.summary}</span>
            </td>
            <td>
              <div className={styles.badges}>
                <ScopeBadges scopes={d.scopes} />
              </div>
            </td>
            <td>{formatDate(d.announced)}</td>
            <td>{d.sunset ? formatDate(d.sunset) : "not scheduled yet"}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
