import React, {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { translate } from "@docusaurus/Translate";
import {
  IconCheck,
  IconClose,
  IconExtension,
  IconLock,
  IconPayment,
  IconStarFilled,
  IconWarning,
} from "@mittwald/flow-react-components";

// Flow's default icon color; status icons use their status color instead
const defaultIconColor = "var(--icon--color)";

/**
 * Emojis used in the content as icons (in tables and at the start of list
 * items), rendered as Flow icons instead. Status icons are named like Flow's
 * status icons (screen readers would read the emoji as e.g. "red cross");
 * the other icons are decorative, as they precede a title that says the same,
 * and Flow hides icons without a label from screen readers.
 */
export const emojiIcons: Record<string, () => ReactElement> = {
  "✅": () => (
    <IconCheck
      color="success"
      aria-label={translate({
        id: "theme.emojiIcon.success",
        message: "Success",
        description: "The ARIA label of the ✅ emoji rendered as an icon",
      })}
    />
  ),
  "❌": () => (
    <IconClose
      color="danger"
      aria-label={translate({
        id: "theme.emojiIcon.error",
        message: "Error",
        description: "The ARIA label of the ❌ emoji rendered as an icon",
      })}
    />
  ),
  "⚠️": () => (
    <IconWarning
      color="warning"
      aria-label={translate({
        id: "theme.emojiIcon.warning",
        message: "Warning",
        description: "The ARIA label of the ⚠️ emoji rendered as an icon",
      })}
    />
  ),
  "🧩": () => <IconExtension color={defaultIconColor} />,
  "🔐": () => <IconLock color={defaultIconColor} />,
  "💸": () => <IconPayment color={defaultIconColor} />,
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
    icon: emojiIcons[emoji]!(),
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

/**
 * Replaces star ratings (e.g. "⭐⭐" for the complexity of a setup) in the
 * text of some content with Flow star icons, rendered by `render`. They are
 * decorative, as the text next to them names the rating. `undefined` if the
 * content has no stars.
 */
export function replaceStarRatings(
  children: ReactNode,
  render: (stars: ReactElement) => ReactNode,
): ReactNode | undefined {
  const nodes = Children.toArray(children);
  if (!nodes.some((node) => typeof node === "string" && node.includes("⭐"))) {
    return undefined;
  }

  return nodes.flatMap((node, nodeIndex) => {
    if (typeof node !== "string") {
      return [node];
    }
    // Splitting with a capturing group keeps the star runs at odd indexes
    return node.split(/(⭐+)/).map((part, index) =>
      index % 2 === 0 ? (
        part
      ) : (
        <React.Fragment key={`starRating-${nodeIndex}-${index}`}>
          {render(
            <>
              {Array.from(part).map((_, star) => (
                <IconStarFilled key={star} color={defaultIconColor} />
              ))}
            </>,
          )}
        </React.Fragment>
      ),
    );
  });
}
