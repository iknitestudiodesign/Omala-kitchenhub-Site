import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AnalyticsLoader } from "@/components/analytics-loader";
import { defaultLocale, siteCopy } from "@/content";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteCopy.pages.home.metadata.title,
    template: "%s | Omala Kitchen Hub",
  },
  description: siteConfig.description,
  keywords: [
    "Buea food ordering",
    "Cameroon kitchens",
    "restaurant order management",
    "kitchen customer communication",
    "group food orders Buea",
  ],
  openGraph: {
    type: "website",
    locale: "en_CM",
    title: "Omala Kitchen Hub",
    description: siteConfig.description,
    siteName: "Omala Kitchen Hub",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Omala Kitchen Hub — You cook. We handle the customers and orders.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Omala Kitchen Hub",
    description: siteConfig.description,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#10150d",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Omala Kitchen Hub",
    url: siteConfig.url,
    logo: `${siteConfig.url}/brand/omala-kitchen-lockup-wide.svg`,
    areaServed: {
      "@type": "City",
      name: "Buea",
      containedInPlace: { "@type": "Country", name: "Cameroon" },
    },
    description: siteConfig.description,
  };

  return (
    <html lang={defaultLocale}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <AnalyticsLoader />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
