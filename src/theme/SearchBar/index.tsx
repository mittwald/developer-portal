import React, {
  type ComponentProps,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { translate } from "@docusaurus/Translate";
import OriginalSearchBar from "@theme-original/SearchBar";
import styles from "./styles.module.css";

/**
 * Wraps the search bar of docusaurus-lunr-search to look like the search in
 * mStudio: a translated placeholder and the keyboard shortcut as a hint on the
 * right (the plugin already focuses the field on Ctrl/Cmd + K, but puts the
 * shortcut into its English placeholder).
 */
export default function SearchBar(
  props: ComponentProps<typeof OriginalSearchBar>,
): ReactNode {
  const ref = useRef<HTMLDivElement>(null);
  const [shortcut, setShortcut] = useState<string | null>(null);
  const label = translate({
    id: "theme.SearchBar.label",
    message: "Search",
    description: "The ARIA label and placeholder for search button",
  });

  useEffect(() => {
    setShortcut(
      window.navigator.platform.startsWith("Mac") ? "⌘ + K" : "Ctrl + K",
    );
  }, []);

  // The plugin sets its placeholder once the index is loaded; replace it
  useEffect(() => {
    const input = ref.current?.querySelector("input");
    if (!input) {
      return;
    }
    const applyPlaceholder = () => {
      if (!input.disabled && input.placeholder !== label) {
        input.placeholder = label;
      }
    };
    applyPlaceholder();
    const observer = new MutationObserver(applyPlaceholder);
    observer.observe(input, {
      attributes: true,
      attributeFilter: ["placeholder", "disabled"],
    });
    return () => observer.disconnect();
  }, [label]);

  return (
    <div ref={ref} className={styles.search}>
      <OriginalSearchBar {...props} />
      {shortcut && (
        <kbd className={styles.shortcut} aria-hidden>
          {shortcut}
        </kbd>
      )}
    </div>
  );
}
