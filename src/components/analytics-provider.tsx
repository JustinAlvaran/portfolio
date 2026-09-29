"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  getAnalyticsConsent,
  initAnalytics,
  isAnalyticsEnabled,
  setAnalyticsConsent,
  trackEvent,
} from "@/lib/analytics";

export function AnalyticsProvider() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<ReturnType<typeof getAnalyticsConsent>>(null);

  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      return;
    }

    initAnalytics();

    const timeoutId = window.setTimeout(() => {
      setConsent(getAnalyticsConsent());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      return;
    }

    trackEvent("page_viewed", {
      page_title: document.title,
      url_path: pathname,
    });
  }, [pathname]);

  if (pathname.startsWith("/admin") || !isAnalyticsEnabled() || consent) {
    return null;
  }

  return (
    <aside className="analytics-consent" aria-label="Analytics consent">
      <div>
        <strong>Analytics</strong>
        <p>Help improve this portfolio with anonymous usage events.</p>
      </div>
      <div>
        <button
          onClick={() => {
            setAnalyticsConsent("declined");
            setConsent("declined");
          }}
          type="button"
        >
          Decline
        </button>
        <button
          onClick={() => {
            setAnalyticsConsent("accepted");
            setConsent("accepted");
            trackEvent("page_viewed", {
              consent_source: "analytics_banner",
              page_title: document.title,
              url_path: pathname,
            });
          }}
          type="button"
        >
          Allow
        </button>
      </div>
    </aside>
  );
}
