import React, { PropsWithChildren, useEffect } from "react";
import {
  createInstance,
  MatomoProvider,
  useMatomo,
} from "@datapunt/matomo-tracker-react";
import { useHistory, useLocation } from "@docusaurus/router";
import { useBaseUrlUtils } from "@docusaurus/useBaseUrl";
import { RouterProvider } from "@mittwald/flow-react-components";
import "@mittwald/flow-react-components/all.css";

/**
 * Lets Flow links navigate through the Docusaurus router and resolves their
 * hrefs against the base URL, which includes the locale prefix (e.g. `/de/`).
 */
function FlowRouterProvider({ children }: PropsWithChildren<{}>) {
  const history = useHistory();
  const { withBaseUrl } = useBaseUrlUtils();

  return (
    <RouterProvider
      navigate={(href) => history.push(withBaseUrl(href))}
      useHref={(href) => withBaseUrl(href)}
    >
      {children}
    </RouterProvider>
  );
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
        <FlowRouterProvider>{children}</FlowRouterProvider>
      </PageViewTracker>
    </MatomoProvider>
  );
}
