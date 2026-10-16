import React, {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import clsx from "clsx";
import { ThemeClassNames } from "@docusaurus/theme-common";
import {
  sanitizeTabsChildren,
  TabsProvider,
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
        className={clsx(
          ThemeClassNames.tabs.container,
          "tabs-container",
          props.className,
        )}
      >
        <FlowTabs
          selectedKey={selectedValue}
          onSelectionChange={(key) => selectValue(String(key))}
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
