"use client";

import mixpanel from "mixpanel-browser";

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
const MIXPANEL_CONSENT_KEY = "justin_portfolio_mixpanel_consent";

type ConsentState = "accepted" | "declined" | null;

type AnalyticsProperties = Record<
  string,
  boolean | number | string | null | undefined
>;

let initialized = false;

function hasWindow() {
  return typeof window !== "undefined";
}

export function getAnalyticsConsent(): ConsentState {
  if (!hasWindow()) {
    return null;
  }

  const storedConsent = window.localStorage.getItem(MIXPANEL_CONSENT_KEY);

  if (storedConsent === "accepted" || storedConsent === "declined") {
    return storedConsent;
  }

  return null;
}

export function isAnalyticsEnabled() {
  return Boolean(MIXPANEL_TOKEN);
}

export function initAnalytics() {
  if (!MIXPANEL_TOKEN || initialized || !hasWindow()) {
    return;
  }

  mixpanel.init(MIXPANEL_TOKEN, {
    autocapture: {
      block_selectors: [
        ".analytics-consent",
        ".chat-dock",
        ".contact-panel",
        ".social-block",
      ],
      capture_text_content: false,
      click: true,
      dead_click: true,
      input: false,
      pageview: false,
      rage_click: true,
      scroll: true,
      submit: false,
    },
    debug: process.env.NODE_ENV !== "production",
    ignore_dnt: false,
    opt_out_tracking_by_default: true,
    persistence: "localStorage",
    property_blacklist: [
      "$current_url",
      "$initial_referrer",
      "$initial_referring_domain",
      "$referrer",
      "$referring_domain",
      "current_url_search",
    ],
    save_referrer: false,
    skip_first_touch_marketing: true,
    stop_utm_persistence: true,
    track_pageview: false,
  });

  initialized = true;

  if (getAnalyticsConsent() === "accepted") {
    mixpanel.opt_in_tracking();
  }
}

export function setAnalyticsConsent(consent: Exclude<ConsentState, null>) {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.setItem(MIXPANEL_CONSENT_KEY, consent);
  initAnalytics();

  if (!MIXPANEL_TOKEN) {
    return;
  }

  if (consent === "accepted") {
    mixpanel.opt_in_tracking();
    trackEvent("analytics_consent_updated", { consent_status: "accepted" });
    return;
  }

  mixpanel.opt_out_tracking();
}

export function trackEvent(eventName: string, properties: AnalyticsProperties = {}) {
  if (!MIXPANEL_TOKEN || getAnalyticsConsent() !== "accepted") {
    return;
  }

  initAnalytics();
  mixpanel.track(eventName, {
    ...properties,
    page_path: hasWindow() ? window.location.pathname : undefined,
  });
}

export function messageLengthBucket(length: number) {
  if (length <= 60) {
    return "short";
  }

  if (length <= 180) {
    return "medium";
  }

  return "long";
}

const chatIntentRules = [
  { category: "contact", keywords: ["contact", "email", "phone", "linkedin", "github"] },
  { category: "projects", keywords: ["project", "urbangrid", "built", "portfolio"] },
  { category: "skills", keywords: ["skill", "stack", "technology", "framework", "language"] },
  { category: "experience", keywords: ["experience", "work", "job", "citc", "contract"] },
  { category: "education", keywords: ["education", "degree", "university", "certification", "worldskills"] },
  { category: "availability", keywords: ["available", "availability", "start", "schedule"] },
  { category: "hiring_fit", keywords: ["hire", "fit", "role", "candidate", "qualified"] },
  { category: "resume", keywords: ["resume", "cv"] },
] as const;

export function chatIntentCategory(message: string) {
  const normalized = message.toLowerCase();
  return (
    chatIntentRules.find(({ keywords }) =>
      keywords.some((keyword) => normalized.includes(keyword)),
    )?.category || "other"
  );
}
