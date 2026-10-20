import React, { PropsWithChildren, useEffect } from "react";
import {
  createInstance,
  MatomoProvider,
  useMatomo,
} from "@datapunt/matomo-tracker-react";
import { useHistory, useLocation } from "@docusaurus/router";
import { useBaseUrlUtils } from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {
  IconSetProvider,
  IntlProvider,
  RouterProvider,
} from "@mittwald/flow-react-components";
import { proIconSet } from "@mittwald/flow-icons-pro";
import IconMasks from "@site/src/icons/IconMasks";
import "@mittwald/flow-react-components/all.css";

/**
 * Lets Flow links navigate through the Docusaurus router and resolves their
 * absolute hrefs against the base URL, which includes the locale prefix (e.g.
 * `/de/`). Relative hrefs (e.g. `./mcp/` in DocCardList items) stay relative
 * to the current page, as with Docusaurus links.
 */
function FlowRouterProvider({ children }: PropsWithChildren<{}>) {
  const history = useHistory();
  const { withBaseUrl } = useBaseUrlUtils();
  const resolveHref = (href: string) =>
    href.startsWith("/") ? withBaseUrl(href) : href;

  return (
    <RouterProvider
      navigate={(href) => history.push(resolveHref(href))}
      useHref={resolveHref}
    >
      {children}
    </RouterProvider>
  );
}

/**
 * Flow texts (e.g. labels of copy buttons) follow the page language instead
 * of the browser language.
 */
function FlowIntlProvider({ children }: PropsWithChildren<{}>) {
  const { i18n } = useDocusaurusContext();
  return <IntlProvider locale={i18n.currentLocale}>{children}</IntlProvider>;
}

function PageViewTracker({ children }: PropsWithChildren<{}>) {
  const { trackPageView } = useMatomo();
  const location = useLocation();

  useEffect(() => {
    if (window?.location?.hostname !== "developer.mittwald.de") {
      // Don't track page views on non-production hosts, to avoid polluting analytics
      return;
    }

    // Strip the language prefix from the URL; this allows us to track page
    // views for both languages under the same URL in Matomo, while still
    // distinguishing between them using a custom dimension.
    trackPageView({
      href:
        "https://developer.mittwald.de" +
        location.pathname.replace(/^\/de/, ""),
      customDimensions: [
        {
          id: 1, // language
          value: location.pathname.startsWith("/de") ? "de" : "en",
        },
      ],
    });
  }, [location]);

  return children;
}

export default function Root({ children }: PropsWithChildren<{}>) {
  const matomoInstance = createInstance({
    urlBase: "https://developer.mittwald.de/stats/",
    siteId: 1,
    configurations: {
      disableCookies: true,
      setSecureCookie: true,
    },
  });

  return (
    <MatomoProvider value={matomoInstance}>
      <PageViewTracker>
        <FlowIntlProvider>
          {/* FontAwesome Pro icons like on flow.mittwald.de; without them
              installed, proIconSet is undefined and Flow keeps its default
              icons (see docusaurus.config.ts) */}
          <IconSetProvider set={proIconSet}>
            <IconMasks />
            <FlowRouterProvider>{children}</FlowRouterProvider>
          </IconSetProvider>
        </FlowIntlProvider>
      </PageViewTracker>
    </MatomoProvider>
  );
}
