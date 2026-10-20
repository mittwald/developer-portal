import React, {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useRef,
} from "react";
import clsx from "clsx";
import { ThemeClassNames } from "@docusaurus/theme-common";
import {
  sanitizeTabsChildren,
  TabsProvider,
  useScrollPositionBlocker,
  useTabsContextValue,
} from "@docusaurus/theme-common/internal";
import useIsBrowser from "@docusaurus/useIsBrowser";
import type { Props } from "@theme/Tabs";
import type { Props as TabItemProps } from "@theme/TabItem";
import { Tab, Tabs as FlowTabs, TabTitle } from "@mittwald/flow-react-components";
import styles from "./styles.module.css";

/**
 * Tabs as Flow tabs. Docusaurus' tab state is kept (default tab, tab groups
 * synced via `groupId`, query string), only the rendering is Flow's; the
 * contents of the `TabItem` children become the tab panels. Ejected from
 * @docusaurus/theme-classic (unsafe, uses its internal tabs utilities).
 */
export default function Tabs(props: Props): ReactNode {
  const isBrowser = useIsBrowser();
  const value = useTabsContextValue(props);
  const { selectedValue, selectValue, tabValues } = value;
  const { blockElementScrollPositionUntilNextRender } =
    useScrollPositionBlocker();

  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelectionChange = (key: string) => {
    // Keep the tabs in place while synced tab groups above them change their
    // height, as in the original component (which keeps the clicked tab in
    // place; the tab list is at the top of the container)
    if (containerRef.current) {
      blockElementScrollPositionUntilNextRender(containerRef.current);
    }
    selectValue(key);
  };

  const items = Children.toArray(sanitizeTabsChildren(props.children)).filter(
    (child): child is ReactElement<TabItemProps> => isValidElement(child),
  );

  return (
    <TabsProvider
      value={value}
      // Remount tabs after hydration, as in the original component
      key={String(isBrowser)}
    >
      <div
        ref={containerRef}
        className={clsx(
          ThemeClassNames.tabs.container,
          "tabs-container",
          props.className,
        )}
      >
        <FlowTabs
          selectedKey={selectedValue}
          onSelectionChange={(key) => handleSelectionChange(String(key))}
        >
          {tabValues.map(({ value: tabValue, label }) => (
            <Tab key={tabValue} id={tabValue}>
              <TabTitle>{label ?? tabValue}</TabTitle>
              <div className={styles.panel}>
                {
                  items.find((item) => item.props.value === tabValue)?.props
                    .children
                }
              </div>
            </Tab>
          ))}
        </FlowTabs>
      </div>
    </TabsProvider>
  );
}
