import React, {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { Icon } from "@mittwald/flow-react-components";
import {
  IconAlertTriangle,
  IconCash,
  IconCheck,
  IconLock,
  IconPuzzle,
  IconX,
} from "@tabler/icons-react";

// Flow's default icon color; status icons use their status color instead
const defaultIconColor = "var(--icon--color)";

/**
 * Emojis used in the content as icons (in tables and at the start of list
 * items), rendered as Flow icons instead. The emoji stays the accessible
 * name.
 */
export const emojiIcons: Record<string, ReactElement> = {
  "✅": (
    <Icon color="success" aria-label="✅">
      <IconCheck />
    </Icon>
  ),
  "❌": (
    <Icon color="danger" aria-label="❌">
      <IconX />
    </Icon>
  ),
  "⚠️": (
    <Icon color="warning" aria-label="⚠️">
      <IconAlertTriangle />
    </Icon>
  ),
  "🧩": (
    <Icon color={defaultIconColor} aria-label="🧩">
      <IconPuzzle />
    </Icon>
  ),
  "🔐": (
    <Icon color={defaultIconColor} aria-label="🔐">
      <IconLock />
    </Icon>
  ),
  "💸": (
    <Icon color={defaultIconColor} aria-label="💸">
      <IconCash />
    </Icon>
  ),
};

/**
 * Splits off an emoji icon at the start of some content: the icon and the
 * remaining content, or `undefined` if the content does not start with one.
 * The content may also start with an element (e.g. the paragraph of a loose
 * list item) whose content starts with the emoji.
 */
export function splitLeadingEmojiIcon(
  children: ReactNode,
): { icon: ReactElement; rest: ReactNode } | undefined {
  const nodes = Children.toArray(children);
  // Loose list items start with a line break before their paragraph
  while (typeof nodes[0] === "string" && !nodes[0].trim()) {
    nodes.shift();
  }
  const [first, ...rest] = nodes;

  if (isValidElement<{ children?: ReactNode }>(first)) {
    const inner = splitLeadingEmojiIcon(first.props.children);
    if (!inner) {
      return undefined;
    }
    return {
      icon: inner.icon,
      rest: (
        <>
          {cloneElement(first, undefined, inner.rest)}
          {rest}
        </>
      ),
    };
  }

  if (typeof first !== "string") {
    return undefined;
  }

  const text = first.trimStart();
  const emoji = Object.keys(emojiIcons).find((key) => text.startsWith(key));
  if (!emoji) {
    return undefined;
  }

  return {
    icon: emojiIcons[emoji]!,
    rest: (
      <>
        {text.slice(emoji.length).trimStart()}
        {rest}
      </>
    ),
  };
}

/**
 * Replaces an emoji icon at the start of some content in place (also inside
 * a leading element like a paragraph), keeping the structure of the content;
 * `undefined` if the content does not start with one
 */
export function replaceLeadingEmojiIcon(
  children: ReactNode,
  render: (icon: ReactElement) => ReactNode,
): ReactNode | undefined {
  const nodes = Children.toArray(children);
  const index = nodes.findIndex(
    (node) => !(typeof node === "string" && !node.trim()),
  );
  const first = nodes[index];

  if (isValidElement<{ children?: ReactNode }>(first)) {
    const inner = replaceLeadingEmojiIcon(first.props.children, render);
    if (inner === undefined) {
      return undefined;
    }
    nodes[index] = cloneElement(first, undefined, inner);
    return nodes;
  }

  const split = splitLeadingEmojiIcon(first);
  if (!split) {
    return undefined;
  }
  nodes[index] = (
    <React.Fragment key="leadingEmojiIcon">
      {render(split.icon)} {split.rest}
    </React.Fragment>
  );
  return nodes;
}
