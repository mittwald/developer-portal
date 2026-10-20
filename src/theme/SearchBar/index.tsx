import React, {
  type ComponentProps,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { translate } from "@docusaurus/Translate";
import OriginalSearchBar from "@theme-original/SearchBar";
import { Button, IconClose } from "@mittwald/flow-react-components";
import styles from "./styles.module.css";

/**
 * Wraps the search bar of docusaurus-lunr-search to look like the search in
 * mStudio: a translated placeholder, the keyboard shortcut as a hint on the
 * right (the plugin already focuses the field on Ctrl/Cmd + K, but puts the
 * shortcut into its English placeholder) and, once something is entered, a
 * clear button like in Flow's SearchField instead of the browser's own.
 */
export default function SearchBar(
  props: ComponentProps<typeof OriginalSearchBar>,
): ReactNode {
  const ref = useRef<HTMLDivElement>(null);
  const [shortcut, setShortcut] = useState<string | null>(null);
  const [hasValue, setHasValue] = useState(false);
  const label = translate({
    id: "theme.SearchBar.label",
    message: "Search",
    description: "The ARIA label and placeholder for search button",
  });
  const clearLabel = translate({
    id: "theme.SearchBar.clear",
    message: "Clear search",
    description: "The ARIA label of the button clearing the search field",
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

  // The plugin renders "no results" from a fixed English template; replace
  // it with the translated text, keeping the query bold
  useEffect(() => {
    const root = ref.current;
    if (!root) {
      return;
    }
    const [before, after] = translate(
      {
        id: "theme.SearchBar.noResults",
        message: 'No results found for query "{query}"',
        description: "The text shown when the search has no results",
      },
      { query: "\u0000" },
    ).split("\u0000");
    const translateNoResults = () => {
      const text = root.querySelector<HTMLElement>(
        ".algolia-docsearch-suggestion--no-results .algolia-docsearch-suggestion--text:not([data-translated])",
      );
      const query = text?.querySelector("b")?.textContent?.replace(/^"|"$/g, "");
      if (!text || query === undefined) {
        return;
      }
      const bold = document.createElement("b");
      bold.textContent = query;
      text.replaceChildren(before ?? "", bold, after ?? "");
      text.dataset.translated = "";
    };
    const observer = new MutationObserver(translateNoResults);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const input = ref.current?.querySelector("input");
    if (!input) {
      return;
    }
    const updateHasValue = () => setHasValue(input.value !== "");
    input.addEventListener("input", updateHasValue);
    return () => input.removeEventListener("input", updateHasValue);
  }, []);

  // The autocomplete listens to input events, so it closes its results too
  const clear = () => {
    const input = ref.current?.querySelector("input");
    if (!input) {
      return;
    }
    input.value = "";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.focus();
  };

  return (
    <div ref={ref} className={styles.search}>
      <OriginalSearchBar {...props} />
      {shortcut && (
        <kbd className={styles.shortcut} aria-hidden>
          {shortcut}
        </kbd>
      )}
      {hasValue && (
        <Button
          variant="plain"
          color="secondary"
          size="s"
          className={styles.clear}
          aria-label={clearLabel}
          onPress={clear}
        >
          <IconClose />
        </Button>
      )}
    </div>
  );
}
