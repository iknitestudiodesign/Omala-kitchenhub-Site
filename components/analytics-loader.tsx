"use client";

import Script from "next/script";

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
const analyticsApproved = process.env.NEXT_PUBLIC_ANALYTICS_CONSENT_APPROVED === "true";

export function AnalyticsLoader() {
  if (!analyticsApproved || !gtmId || !/^GTM-[A-Z0-9]+$/i.test(gtmId)) return null;

  return (
    <>
      <Script id="omala-gtm-bootstrap" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});`}
      </Script>
      <Script
        id="omala-gtm"
        src={`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`}
        strategy="afterInteractive"
      />
    </>
  );
}
