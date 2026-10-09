import React, { type ReactNode } from "react";
import clsx from "clsx";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { translate } from "@docusaurus/Translate";
import { useCodeBlockContext } from "@docusaurus/theme-common/internal";
import { Button, CopyButton, Icon } from "@mittwald/flow-react-components";
import { IconTextWrap } from "@tabler/icons-react";
import styles from "./styles.module.css";

/**
 * Code block buttons as Flow buttons, placed and styled like the copy button
 * of Flow's CodeBlock. Ejected from @docusaurus/theme-classic (unsafe, uses
 * the internal code block context); the buttons are not server-rendered, as
 * in the original.
 */

function WordWrapButton() {
  const { wordWrap } = useCodeBlockContext();
  if (!wordWrap.isEnabled && !wordWrap.isCodeScrollable) {
    return null;
  }

  return (
    <Button
      size="s"
      variant={wordWrap.isEnabled ? "solid" : "soft"}
      color="secondary"
      aria-label={translate({
        id: "theme.CodeBlock.wordWrapToggle",
        message: "Toggle word wrap",
        description:
          "The title attribute for toggle word wrapping button of code block lines",
      })}
      aria-pressed={wordWrap.isEnabled}
      onPress={() => wordWrap.toggle()}
    >
      <Icon>
        <IconTextWrap />
      </Icon>
    </Button>
  );
}

function Buttons({ className }: { className?: string }) {
  const {
    metadata: { code },
  } = useCodeBlockContext();

  return (
    <div className={clsx(className, styles.buttons)}>
      <WordWrapButton />
      <CopyButton size="s" variant="soft" text={code} />
    </div>
  );
}

export default function CodeBlockButtons({
  className,
}: {
  className?: string;
}): ReactNode {
  return <BrowserOnly>{() => <Buttons className={className} />}</BrowserOnly>;
}
