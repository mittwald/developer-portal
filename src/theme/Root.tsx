import React, { PropsWithChildren, useEffect } from "react";
import {
  createInstance,
  MatomoProvider,
  useMatomo,
} from "@datapunt/matomo-tracker-react";
import { useLocation } from "@docusaurus/router";
import { setTheme } from "@mittwald/flow-react-components";
import "@mittwald/flow-react-components/all.css";

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
  useEffect(() => {
    const html = document.documentElement;

    const syncFlowTheme = () => {
      const docusaurusTheme = html.getAttribute("data-theme");
      setTheme(docusaurusTheme === "dark" ? "dark" : "light");
    };

    syncFlowTheme();

    const observer = new MutationObserver((changes) => {
      for (const change of changes) {
        if (
          change.type === "attributes" &&
          change.attributeName === "data-theme"
        ) {
          syncFlowTheme();
        }
      }
    });

    observer.observe(html, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

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
      <PageViewTracker>{children}</PageViewTracker>
    </MatomoProvider>
  );
}
