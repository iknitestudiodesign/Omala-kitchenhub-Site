import type { Metadata } from "next";
import Link from "next/link";
import { BellOff, ListChecks, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/ui";
import { SubmissionForm } from "@/components/submission-form";
import { siteCopy } from "@/content";

export const metadata: Metadata = siteCopy.pages.marketingPreferences.metadata;

export default function MarketingPreferencesPage() {
  return (
    <>
      <PageHero {...siteCopy.pages.marketingPreferences.hero} aside={<ul className="aside-list"><li><ListChecks size={18} /> Choose update to save a new channel selection.</li><li><BellOff size={18} /> Choose withdraw to stop optional promotions on every channel.</li><li><ShieldCheck size={18} /> Contact Omala separately for access, correction or deletion requests.</li></ul>} />
      <section className="form-section"><div className="shell form-layout"><aside className="form-aside"><span className="eyebrow">Manage preferences</span><h2>Your last instruction should be the one we follow.</h2><p>We will match the phone number to the contact record and update the consent audit trail.</p></aside><SubmissionForm endpoint="/api/forms/marketing-preferences" formName="marketing-preferences" successPath="/confirmation/preferences" submitLabel="Update my preferences" eventContext="marketing_preferences" submissionNotice="By sending, you instruct Omala to update or withdraw only the optional marketing choices above."><fieldset className="form-group"><legend>Identify your record</legend><div className="field-grid"><label className="field"><span>Name <em>*</em></span><input name="name" autoComplete="name" required /></label><label className="field"><span>WhatsApp or phone <em>*</em></span><input name="phone" inputMode="tel" autoComplete="tel" required /></label><label className="field--full"><span>Email</span><input name="email" type="email" autoComplete="email" /></label></div></fieldset><fieldset className="form-group"><legend>What should Omala do?</legend><div className="choice-grid"><label className="choice-card"><input type="radio" name="action" value="update" required />Update to the channels selected below</label><label className="choice-card"><input type="radio" name="action" value="withdraw" required />Withdraw all optional marketing permission</label></div></fieldset><fieldset className="form-group"><legend>Channels to keep <small>These choices apply only when “update” is selected.</small></legend><label className="check-row"><input type="checkbox" name="consentMarketingWhatsApp" value="true" /><span>WhatsApp menus and offers</span></label><label className="check-row"><input type="checkbox" name="consentMarketingSms" value="true" /><span>SMS menus and offers</span></label><label className="check-row"><input type="checkbox" name="consentMarketingEmail" value="true" /><span>Email menus and offers</span></label></fieldset><div className="consent-block"><h3>Need a broader privacy request?</h3><p>Use the <Link href="/contact">contact form</Link> and choose “Privacy or data request” for access, correction or deletion. Read our <Link href="/privacy">privacy notice</Link>.</p></div></SubmissionForm></div></section>
    </>
  );
}
