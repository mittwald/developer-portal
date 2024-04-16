import React, { PropsWithChildren, useEffect } from "react";
import { createInstance, MatomoProvider, useMatomo } from "@datapunt/matomo-tracker-react";
import { useLocation } from "@docusaurus/router";

function PageViewTracker({ children }: PropsWithChildren<{}>) {
  const { trackPageView } = useMatomo();
  const location = useLocation();

  useEffect(() => {
    console.log("tracking pageview", location.pathname);
    trackPageView({});
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
    }
  });

  return (
    <MatomoProvider value={matomoInstance}>
      <PageViewTracker>
        {children}
      </PageViewTracker>
    </MatomoProvider>
  );
}