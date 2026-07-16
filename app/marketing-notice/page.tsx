import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { siteCopy } from "@/content";

export const metadata: Metadata = siteCopy.pages.marketingNotice.metadata;

export default function MarketingNoticePage() {
  return <LegalPage {...siteCopy.pages.marketingNotice.hero}>
    <h2>Separate channel choices</h2><p>Omala asks separately for WhatsApp, SMS and email permission. Choices are unticked by default. Agreeing to one channel does not agree to the others, and promotion is not required to place an order or apply as a kitchen.</p>
    <h2>What is recorded</h2><p>The consent record includes the chosen channels, wording version, time, source page, language and later withdrawal. This is used to check permission before a promotional workflow sends.</p>
    <h2>What you may receive</h2><p>Selected channels may receive daily menus, participating-kitchen updates, group-order ideas, offers and Omala pilot news. Frequency will depend on the selected programme and active kitchen menus.</p>
    <h2>Withdraw or update</h2><p>Use the <Link href="/marketing-preferences">marketing preferences page</Link> at any time. A withdrawal stops optional promotions after the matching contact record is updated. It does not cancel an active order or prevent necessary service communication.</p>
    <h2>Existing contact lists</h2><p>Omala will not treat possession of a phone number as permission. Existing kitchen or campaign contacts must have documented, lawful outreach provenance before promotional use.</p>
    <h2>Questions</h2><p>Use the <Link href="/contact">contact page</Link> and choose “Marketing preferences” or “Privacy or data request.”</p>
  </LegalPage>;
}
