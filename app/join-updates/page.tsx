import type { Metadata } from "next";
import Link from "next/link";
import { BellRing, CheckCircle2, MessageCircleMore, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/ui";
import { SubmissionForm } from "@/components/submission-form";
import { siteCopy } from "@/content";

export const metadata: Metadata = siteCopy.pages.joinUpdates.metadata;

export default function JoinUpdatesPage() {
  return (
    <>
      <PageHero {...siteCopy.pages.joinUpdates.hero} aside={<ul className="aside-list"><li><MessageCircleMore size={18} /> WhatsApp, SMS and email are independent choices.</li><li><ShieldCheck size={18} /> No boxes are selected for you.</li><li><BellRing size={18} /> You can update or withdraw permission at any time.</li></ul>} />
      <section className="form-section"><div className="shell form-layout"><aside className="form-aside"><span className="eyebrow">Join updates</span><h2>Optional means optional.</h2><p>This form is only for menus, offers and Omala news. It is separate from messages needed to confirm or support an order.</p><div className="form-assurance"><span><CheckCircle2 size={16} /> Select at least one channel.</span><span><ShieldCheck size={16} /> Every choice is recorded with time, source and consent-text version.</span></div></aside><SubmissionForm endpoint="/api/forms/marketing-preferences" formName="join-updates" successPath="/confirmation/preferences" submitLabel="Save my choices" eventContext="consent_opt_in" requireOneOf={["consentMarketingWhatsApp", "consentMarketingSms", "consentMarketingEmail"]} submissionNotice="By saving, you confirm only the optional marketing channels selected above. This does not add service-contact permission."><input type="hidden" name="action" value="update" /><fieldset className="form-group"><legend>Your details</legend><div className="field-grid"><label className="field"><span>Name <em>*</em></span><input name="name" autoComplete="name" required /></label><label className="field"><span>WhatsApp or phone <em>*</em></span><input name="phone" inputMode="tel" autoComplete="tel" required /></label><label className="field--full"><span>Email</span><input name="email" type="email" autoComplete="email" /></label></div></fieldset><fieldset className="form-group"><legend>Choose your channels <small>Select only the channels you want Omala to use for optional promotions.</small></legend><label className="check-row"><input type="checkbox" name="consentMarketingWhatsApp" value="true" /><span>WhatsApp menus and offers</span></label><label className="check-row"><input type="checkbox" name="consentMarketingSms" value="true" /><span>SMS menus and offers</span></label><label className="check-row"><input type="checkbox" name="consentMarketingEmail" value="true" /><span>Email menus and offers</span></label></fieldset><div className="consent-block"><h3>Your choice</h3><p>By saving, you give specific permission for the selected channels. This permission can be changed or withdrawn from the <Link href="/marketing-preferences">marketing preferences page</Link>. Read our <Link href="/marketing-notice">marketing notice</Link>.</p></div></SubmissionForm></div></section>
    </>
  );
}
