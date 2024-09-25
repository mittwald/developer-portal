import { writeFile } from "fs/promises";
import fs from "fs";

export type SidebarRenderer = (items: any[]) => Promise<void>;

export function exportSidebarItemsAsJson(outputFile: string): SidebarRenderer {
  return async (items: any[]): Promise<void> => {
    await writeFile(outputFile, JSON.stringify(items, null, 2));
  };
}

export function exportCompleteSidebar(outputFile: string): SidebarRenderer {
  return async (items: any[]): Promise<void> => {
    const completeSidebar = {
      apiSidebar: [
        {
          type: "doc",
          id: "intro",
        },
        {
          type: "category",
          label: "Reference (v1)",
          link: {
            type: "generated-index",
            title: "API Reference",
            slug: "/reference",
            keywords: ["api-reference"],
          },
          items,
        },
      ],
    };
    fs.writeFileSync(outputFile, JSON.stringify(completeSidebar, null, 2));
  };
}
