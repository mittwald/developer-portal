import { createContext, type ReactNode } from "react";

/**
 * Actions shown next to the page title (the Markdown h1 or the title from
 * the front matter), e.g. the edit link on doc pages (see DocItem/Content).
 */
export const TitleActionsContext = createContext<ReactNode>(null);

/**
 * Details shown directly below the page title, e.g. the tags on doc pages
 * (see DocItem/Content).
 */
export const TitleDetailsContext = createContext<ReactNode>(null);
