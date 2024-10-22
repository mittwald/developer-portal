import React, { PropsWithChildren, useEffect } from "react";
import {
  createInstance,
  MatomoProvider,
  useMatomo,
} from "@datapunt/matomo-tracker-react";
import { useLocation } from "@docusaurus/router";
import "@mittwald/flow-react-components/all.css";

function PageViewTracker({ children }: PropsWithChildren<{}>) {
  const { trackPageView } = useMatomo();
  const location = useLocation();

  useEffect(() => {
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
    },
  });

  return (
    <MatomoProvider value={matomoInstance}>
      <PageViewTracker>{children}</PageViewTracker>
    </MatomoProvider>
  );
}
