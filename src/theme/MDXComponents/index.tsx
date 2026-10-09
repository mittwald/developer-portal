import React, {
  Children,
  isValidElement,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";
import clsx from "clsx";
import Head from "@docusaurus/Head";
import DocusaurusLink from "@docusaurus/Link";
import useBrokenLinks from "@docusaurus/useBrokenLinks";
import { translate } from "@docusaurus/Translate";
import { useAnchorTargetClassName } from "@docusaurus/theme-common";
import MDXCode from "@theme/MDXComponents/Code";
import MDXA from "@theme/MDXComponents/A";
import MDXPre from "@theme/MDXComponents/Pre";
import MDXDetails from "@theme/MDXComponents/Details";
import MDXUl from "@theme/MDXComponents/Ul";
import MDXLi from "@theme/MDXComponents/Li";
import MDXImg from "@theme/MDXComponents/Img";
import Admonition from "@theme/Admonition";
import Mermaid from "@theme/Mermaid";
import type { MDXComponentsObject } from "@theme/MDXComponents";
import {
  Heading,
  InlineCode,
  Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Section,
  Text,
} from "@mittwald/flow-react-components";
import styles from "./styles.module.css";

/**
 * Renders Markdown content with Flow components (headings, text, links,
 * inline code, lists, tables). Ejected from @docusaurus/theme-classic; code
 * blocks, details, images, admonitions and mermaid keep their theme
 * components.
 */

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/** Compact heading sizes like on flow.mittwald.de; sections carry the structure */
const headingSizes = {
  1: "l",
  2: "s",
  3: "xs",
  4: "xs",
  5: "xs",
  6: "xs",
} as const;

/** Flow heading that keeps Docusaurus' anchor id and hash link */
function MDXHeading({
  level,
  id,
  children,
  className,
}: ComponentProps<"h2"> & { level: HeadingLevel }) {
  const brokenLinks = useBrokenLinks();
  const anchorTargetClassName = useAnchorTargetClassName(id);

  // H1 headings do not need an id because they don't appear in the TOC
  if (level === 1 || !id) {
    return (
      <Heading
        level={level}
        size={headingSizes[level]}
        className={clsx(styles.heading, className)}
      >
        {children}
      </Heading>
    );
  }

  brokenLinks.collectAnchor(id);

  const anchorTitle = translate(
    {
      id: "theme.common.headingLinkTitle",
      message: "Direct link to {heading}",
      description: "Title for link to heading",
    },
    { heading: typeof children === "string" ? children : id },
  );

  return (
    <Heading
      level={level}
      size={headingSizes[level]}
      id={id}
      className={clsx(
        "anchor",
        anchorTargetClassName,
        styles.heading,
        className,
      )}
    >
      {children}
      <DocusaurusLink
        className="hash-link"
        to={`#${id}`}
        aria-label={anchorTitle}
        title={anchorTitle}
        translate="no"
      >
        &#8203;
      </DocusaurusLink>
    </Heading>
  );
}

function MDXParagraph(props: ComponentProps<"p">) {
  return (
    <Text elementType="p" className={clsx(styles.paragraph, props.className)}>
      {props.children}
    </Text>
  );
}

/**
 * Flow inline link that renders through Docusaurus' MDX link, which keeps
 * base URL handling, external link targets and broken link detection.
 */
function MDXLink({ href, children, className, ...rest }: ComponentProps<"a">) {
  return (
    <Link
      inline
      href={href}
      linkComponent={MDXA}
      className={clsx(styles.link, className)}
      // Remaining anchor attributes from MDX (e.g. footnote ids and aria
      // references) are passed on to the rendered link
      {...(rest as ComponentProps<typeof Link>)}
    >
      {children}
    </Link>
  );
}

function isInlineCode(children: ReactNode) {
  // Empty code blocks have no children,
  // see https://github.com/facebook/docusaurus/pull/9704
  return (
    typeof children !== "undefined" &&
    Children.toArray(children).every(
      (el) => typeof el === "string" && !el.includes("\n"),
    )
  );
}

function MDXInlineOrBlockCode(props: ComponentProps<typeof MDXCode>) {
  if (isInlineCode(props.children)) {
    return <InlineCode>{props.children}</InlineCode>;
  }
  return <MDXCode {...props} />;
}

function MDXList(props: ComponentProps<"ul">) {
  return (
    <Text elementType="div" className={styles.list}>
      <MDXUl {...props} />
    </Text>
  );
}

function MDXOrderedList(props: ComponentProps<"ol">) {
  return (
    <Text elementType="div" className={styles.list}>
      <ol {...props} />
    </Text>
  );
}

/** Sections created by the rehypeFlowSections plugin; other sections (e.g.
 * footnotes) stay plain */
function MDXSection(
  props: ComponentProps<"section"> & Record<string, unknown>,
) {
  const { "data-flow-section": isFlowSection, children, ...rest } = props;
  if (isFlowSection === undefined) {
    return <section {...rest}>{children}</section>;
  }
  return <Section className={styles.section}>{children}</Section>;
}

/* Tables */

type ElementWithChildren = ReactElement<{
  children?: ReactNode;
  colSpan?: number;
  rowSpan?: number;
}>;

function elementChildren(node: ReactNode): ElementWithChildren[] {
  return Children.toArray(node).filter(isValidElement) as ElementWithChildren[];
}

function textContent(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) =>
      typeof child === "string" || typeof child === "number"
        ? String(child)
        : isValidElement<{ children?: ReactNode }>(child)
          ? textContent(child.props.children)
          : "",
    )
    .join("");
}

/**
 * Maps a Markdown table (table > thead/tbody > tr > th/td) onto a Flow table.
 * Tables Flow cannot represent (no header, spanning cells) stay plain HTML.
 */
function MDXTable(props: ComponentProps<"table">) {
  const sections = elementChildren(props.children);
  const [head, ...bodies] = sections;
  const headerCells = head
    ? elementChildren(elementChildren(head.props.children)[0]?.props.children)
    : [];
  const bodyRows = bodies.flatMap((body) =>
    elementChildren(body.props.children),
  );
  const allCells = [
    ...headerCells,
    ...bodyRows.flatMap((row) => elementChildren(row.props.children)),
  ];

  const isRepresentable =
    headerCells.length > 0 &&
    allCells.every((cell) => !cell.props.colSpan && !cell.props.rowSpan);

  if (!isRepresentable) {
    return <table {...props} />;
  }

  const label = headerCells.map((cell) => textContent(cell.props.children));

  return (
    <div className={styles.table}>
      <Table aria-label={label.join(", ")}>
        <TableHeader>
          {headerCells.map((cell, index) => (
            <TableColumn key={index} isRowHeader={index === 0}>
              {cell.props.children}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {bodyRows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {elementChildren(row.props.children).map((cell, cellIndex) => (
                <TableCell key={cellIndex}>{cell.props.children}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const MDXComponents: MDXComponentsObject = {
  Head,
  details: MDXDetails, // For MD mode support, see https://github.com/facebook/docusaurus/issues/9092#issuecomment-1602902274
  Details: MDXDetails,
  code: MDXInlineOrBlockCode,
  a: MDXLink,
  pre: MDXPre,
  p: MDXParagraph,
  ul: MDXList,
  ol: MDXOrderedList,
  li: MDXLi,
  img: MDXImg,
  table: MDXTable,
  section: MDXSection,
  h1: (props: ComponentProps<"h1">) => <MDXHeading level={1} {...props} />,
  h2: (props: ComponentProps<"h2">) => <MDXHeading level={2} {...props} />,
  h3: (props: ComponentProps<"h3">) => <MDXHeading level={3} {...props} />,
  h4: (props: ComponentProps<"h4">) => <MDXHeading level={4} {...props} />,
  h5: (props: ComponentProps<"h5">) => <MDXHeading level={5} {...props} />,
  h6: (props: ComponentProps<"h6">) => <MDXHeading level={6} {...props} />,
  admonition: Admonition,
  mermaid: Mermaid,
};

export default MDXComponents;
