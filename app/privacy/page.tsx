import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { siteCopy } from "@/content";

export const metadata: Metadata = siteCopy.pages.privacy.metadata;

export default function PrivacyPage() {
  return <LegalPage {...siteCopy.pages.privacy.hero}>
    <h2>Who is responsible</h2><p>Omala Kitchen Hub determines why and how personal information submitted through this website is used. You can reach the team through the <Link href="/contact">contact form</Link> and select “Privacy or data request.”</p>
    <h2>What we collect</h2><p>Depending on the form, we may collect your name, phone or WhatsApp number, optional email, city, neighborhood, landmark, order or kitchen details, preferred communication channels, campaign source, consent choices, and technical security information needed to protect a submission.</p><p>We do not ask for Mobile Money credentials, account numbers, identity documents, customer-list uploads or medical records through this public website. Please do not place those items in free-text fields.</p>
    <h2>Why we use it</h2><ul><li>To answer a message or support an order request.</li><li>To assess and operate a kitchen pilot application.</li><li>To coordinate quotes, confirmations and fulfilment updates.</li><li>To send optional marketing only through channels you selected.</li><li>To prevent spam, secure the website and keep a consent audit trail.</li><li>To measure the operating funnel without logging form contents in website logs.</li></ul>
    <h2>Service messages and marketing</h2><p>Messages needed to answer or complete your request are separate from optional promotions. Marketing choices are unticked by default and recorded by channel. You can update or withdraw them on the <Link href="/marketing-preferences">marketing preferences page</Link>.</p>
    <h2>Service providers and transfers</h2><p>Omala plans to use GoHighLevel as the operational customer and order system, Railway for website hosting, and Cloudflare Turnstile for form protection when enabled. These providers may process information outside Cameroon. Omala will document the applicable contractual and legal safeguards before production launch.</p>
    <h2>Retention and security</h2><p>Information is kept only for the order, pilot, consent, support and legal purposes that justify it. Access is limited to people and providers supporting those purposes. Website logs use receipt and status identifiers rather than form contents. The final retention schedule will be confirmed before production.</p>
    <h2>Your choices</h2><p>You may ask to access, correct, object to, restrict or delete relevant information, subject to lawful recordkeeping needs. You may withdraw optional marketing permission at any time. Use the <Link href="/contact">contact form</Link> for a broader privacy request.</p>
    <h2>Changes</h2><p>Omala may update this pilot notice as the service, providers and legal review develop. The date above shows the current version.</p>
  </LegalPage>;
}
