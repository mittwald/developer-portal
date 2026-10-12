import { createContext, type ReactNode } from "react";

/**
 * Actions shown next to the page title (the Markdown h1 or the title from
 * the front matter), e.g. the edit link on doc pages (see DocItem/Content).
 */
export const TitleActionsContext = createContext<ReactNode>(null);
