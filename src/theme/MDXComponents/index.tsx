import React, {
  Children,
  createContext,
  isValidElement,
  useContext,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";
import clsx from "clsx";
import Head from "@docusaurus/Head";
import MDXCode from "@theme/MDXComponents/Code";
import MDXA from "@theme/MDXComponents/A";
import MDXPre from "@theme/MDXComponents/Pre";
import MDXDetails from "@theme/MDXComponents/Details";
import MDXUl from "@theme/MDXComponents/Ul";
import MDXLi from "@theme/MDXComponents/Li";
import MDXImg from "@theme/MDXComponents/Img";
import ThemeHeading from "@theme/Heading";
import Admonition from "@theme/Admonition";
import Mermaid from "@theme/Mermaid";
import type { MDXComponentsObject } from "@theme/MDXComponents";
import {
  Header,
  Icon,
  InlineCode,
  Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  IconUndo,
  Section,
  Text,
} from "@mittwald/flow-react-components";
import {
  emojiIcons,
  replaceLeadingEmojiIcon,
  splitLeadingEmojiIcon,
} from "./emojiIcons";
import { replaceBreakingMarker } from "./breakingBadge";
import { TitleActionsContext, TitleDetailsContext } from "./titleActions";
import styles from "./styles.module.css";

/**
 * Renders Markdown content with Flow components (headings, text, links,
 * inline code, lists, tables). Ejected from @docusaurus/theme-classic; code
 * blocks, details, images, admonitions and mermaid keep their theme
 * components.
 */

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Headings have no inline code: code in a heading (e.g. CLI command names) is
 * rendered as plain heading text.
 */
function unwrapHeadingCode(children: ReactNode): ReactNode {
  return Children.map(children, (node) =>
    isValidElement<{ children?: ReactNode }>(node) &&
    node.type === MDXInlineOrBlockCode
      ? node.props.children
      : node,
  );
}

function MDXHeading({
  level,
  id,
  children,
  className,
}: ComponentProps<"h2"> & { level: HeadingLevel }) {
  return (
    <ThemeHeading
      as={`h${level}`}
      id={id}
      className={clsx(styles.heading, className)}
    >
      {unwrapHeadingCode(children)}
    </ThemeHeading>
  );
}

/**
 * The page title; with actions for the page (e.g. on doc pages), title and
 * actions form the header of the section the title is in. Details for the
 * page (e.g. the tags on doc pages) follow directly below.
 */
function MDXTitle(props: ComponentProps<"h1">) {
  const actions = useContext(TitleActionsContext);
  const details = useContext(TitleDetailsContext);
  const heading = <MDXHeading level={1} {...props} />;
  const title = actions ? (
    <Header className={styles.titleHeader}>
      {heading}
      {actions}
    </Header>
  ) : (
    heading
  );
  if (!details) {
    return title;
  }
  // Closer to the title than the section's spacing
  return (
    <div className={styles.titleWithDetails}>
      {title}
      {details}
    </div>
  );
}

function MDXParagraph(props: ComponentProps<"p">) {
  return (
    <Text elementType="p" className={props.className}>
      {props.children}
    </Text>
  );
}

/**
 * Flow inline link that renders through Docusaurus' MDX link, which keeps
 * base URL handling, external link targets and broken link detection.
 */
function MDXLink({ href, children, className, ...rest }: ComponentProps<"a">) {
  // Back reference of a footnote: a Flow icon instead of the "↩" character
  if ("data-footnote-backref" in rest) {
    return (
      <Link
        inline
        href={href}
        linkComponent={MDXA}
        className={clsx(styles.footnoteBackref, className)}
        {...(rest as ComponentProps<typeof Link>)}
      >
        <IconUndo />
      </Link>
    );
  }

  // External links open in a new tab, which also shows Flow's external link
  // icon (as with all other external Flow links)
  const isExternal = !!href && /^(https?:)?\/\//.test(href);
  // Footnote references (superscript numbers) are standalone Flow links: bold,
  // without underline
  const isFootnoteRef = "data-footnote-ref" in rest;

  return (
    <Link
      inline={!isFootnoteRef}
      href={href}
      target={isExternal ? "_blank" : undefined}
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

/** Whether the items of the current list are icon items (see MDXList) */
const IconListContext = createContext(false);

/**
 * Unordered list; when every item starts with an emoji icon, the icons
 * replace the bullets
 */
function MDXList(props: ComponentProps<"ul">) {
  const items = elementChildren(props.children);
  const isIconList =
    items.length > 0 &&
    items.every(
      (item) =>
        // Items with a breaking change badge keep their bullet
        !replaceBreakingMarker(item.props.children) &&
        splitLeadingEmojiIcon(item.props.children),
    );
  return (
    <Text elementType="div" className={styles.list}>
      <IconListContext.Provider value={isIconList}>
        <MDXUl
          {...props}
          className={clsx(props.className, isIconList && styles.iconList)}
        />
      </IconListContext.Provider>
    </Text>
  );
}

/**
 * List item with an emoji at its start replaced by its icon: in an icon list
 * in place of the bullet, otherwise inline at the start of the text. A
 * breaking change marker becomes an alert badge (see breakingBadge.tsx).
 */
function MDXListItem(props: ComponentProps<"li">) {
  const isIconList = useContext(IconListContext);

  const withBreakingBadge = replaceBreakingMarker(props.children);
  if (withBreakingBadge !== undefined) {
    return (
      <MDXLi {...props} className={clsx(props.className, styles.listItem)}>
        {withBreakingBadge}
      </MDXLi>
    );
  }

  if (!isIconList) {
    const children = replaceLeadingEmojiIcon(props.children, (icon) => (
      <span className={styles.leadingStatusIcon}>{icon}</span>
    ));
    return (
      <MDXLi {...props} className={clsx(props.className, styles.listItem)}>
        {children ?? props.children}
      </MDXLi>
    );
  }

  const split = splitLeadingEmojiIcon(props.children);
  if (!split) {
    return <MDXLi {...props} />;
  }
  return (
    <MDXLi {...props} className={clsx(props.className, styles.iconListItem)}>
      <span className={styles.listItemIcon}>{split.icon}</span>
      <span>{split.rest}</span>
    </MDXLi>
  );
}

function MDXOrderedList(props: ComponentProps<"ol">) {
  return (
    <Text elementType="div" className={styles.list}>
      <ol {...props} />
    </Text>
  );
}

/** Blockquote styled by Flow's text component, as in Flow's Markdown */
function MDXBlockquote(props: ComponentProps<"blockquote">) {
  return (
    <Text elementType="div" className={styles.blockquote}>
      <blockquote {...props} />
    </Text>
  );
}

/**
 * Whether the content is only the page title (Docusaurus wraps the Markdown
 * title in a header element)
 */
function containsOnlyTitle(children: ReactNode): boolean {
  const nodes = Children.toArray(children).filter(
    (node) => !(typeof node === "string" && !node.trim()),
  );
  return (
    nodes.length > 0 &&
    nodes.every(
      (node) =>
        isValidElement<{ children?: ReactNode }>(node) &&
        (node.type === MDXTitle ||
          (node.type === "header" && containsOnlyTitle(node.props.children))),
    )
  );
}

/** Sections created by the rehypeFlowSections plugin (including the
 * footnotes); other sections stay plain */
function MDXSection(
  props: ComponentProps<"section"> & Record<string, unknown>,
) {
  const {
    "data-flow-section": isFlowSection,
    "data-footnotes": isFootnotes,
    children,
    ...rest
  } = props;
  if (isFlowSection === undefined) {
    return <section {...rest}>{children}</section>;
  }
  // A section with only the page title gets no separator below it, like the
  // title from the front matter (see DocItem/Content)
  const isTitleOnly = containsOnlyTitle(children);
  return (
    <Section
      hideSeparator={isTitleOnly}
      className={clsx(
        styles.section,
        isFootnotes !== undefined && styles.footnotes,
      )}
    >
      {children}
    </Section>
  );
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

/** The icon of a cell consisting only of an emoji icon */
function statusIcon(cell: ElementWithChildren): ReactNode | undefined {
  return emojiIcons[textContent(cell.props.children).trim()];
}

/** Cell content with a leading emoji replaced by its icon */
function cellContent(cell: ElementWithChildren): ReactNode {
  const icon = statusIcon(cell);
  if (icon) {
    return icon;
  }

  const split = splitLeadingEmojiIcon(cell.props.children);
  if (split) {
    return (
      <>
        <span className={styles.leadingStatusIcon}>{split.icon}</span>{" "}
        {split.rest}
      </>
    );
  }
  return cell.props.children;
}

/**
 * Maps a Markdown table (table > thead/tbody > tr > th/td) onto a Flow table.
 * Tables Flow cannot represent (no header, spanning cells) stay plain HTML.
 * Columns containing only status icons (and empty cells) are centered.
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
  const rows = bodyRows.map((row) => elementChildren(row.props.children));

  const isIconColumn = headerCells.map((_, index) => {
    const cells = rows.map((cells) => cells[index]).filter(Boolean);
    const icons = cells.filter((cell) => statusIcon(cell!) !== undefined);
    return (
      icons.length > 0 &&
      cells.every(
        (cell) =>
          statusIcon(cell!) !== undefined ||
          !textContent(cell!.props.children).trim(),
      )
    );
  });
  const align = (index: number) =>
    isIconColumn[index] ? ("center" as const) : undefined;

  return (
    <div className={styles.table}>
      <Table aria-label={label.join(", ")}>
        <TableHeader>
          {headerCells.map((cell, index) => (
            <TableColumn
              key={index}
              isRowHeader={index === 0}
              horizontalAlign={align(index)}
            >
              {cell.props.children}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {rows.map((cells, rowIndex) => (
            <TableRow key={rowIndex}>
              {cells.map((cell, cellIndex) => (
                <TableCell key={cellIndex} horizontalAlign={align(cellIndex)}>
                  {cellContent(cell)}
                </TableCell>
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
  li: MDXListItem,
  blockquote: MDXBlockquote,
  img: MDXImg,
  table: MDXTable,
  section: MDXSection,
  h1: MDXTitle,
  h2: (props: ComponentProps<"h2">) => <MDXHeading level={2} {...props} />,
  h3: (props: ComponentProps<"h3">) => <MDXHeading level={3} {...props} />,
  h4: (props: ComponentProps<"h4">) => <MDXHeading level={4} {...props} />,
  h5: (props: ComponentProps<"h5">) => <MDXHeading level={5} {...props} />,
  h6: (props: ComponentProps<"h6">) => <MDXHeading level={6} {...props} />,
  admonition: Admonition,
  mermaid: Mermaid,
};

export default MDXComponents;
