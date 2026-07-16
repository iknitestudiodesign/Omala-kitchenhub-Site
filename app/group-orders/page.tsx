import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, MapPin, PackageCheck, ShieldCheck, UsersRound } from "lucide-react";
import { PageHero, SectionIntro } from "@/components/ui";
import { SubmissionForm } from "@/components/submission-form";
import { siteCopy } from "@/content";

export const metadata: Metadata = siteCopy.pages.groupOrders.metadata;

export default function GroupOrdersPage() {
  return (
    <>
      <PageHero
        {...siteCopy.pages.groupOrders.hero}
        actions={<><Link className="button button--accent" href="#group-form">Request a group order <ArrowRight size={17} /></Link><Link className="button button--ghost-light" href="/order">Ordering for yourself?</Link></>}
        aside={<ul className="aside-list"><li><UsersRound size={18} /> Office lunches, team meals and event requests.</li><li><MapPin size={18} /> One clear location and landmark for coordinated fulfilment.</li><li><PackageCheck size={18} /> Manual quote and availability check before confirmation.</li></ul>}
      />

      <section className="content-section content-section--cream">
        <div className="shell group-feature__grid">
          <div className="photo-placeholder photo-placeholder--group" role="img" aria-label="Prepared group meals in individual containers" />
          <div>
            <SectionIntro eyebrow="Plan earlier, deliver together" title="Group demand is easier to cook for—and easier to receive." description="A coordinated order gives the kitchen a clearer quantity and preparation window while the customer avoids managing many separate chats." />
            <ul className="plain-checks">
              <li><CheckCircle2 size={18} /> One contact person for the request</li>
              <li><CheckCircle2 size={18} /> Headcount and meal direction captured up front</li>
              <li><CheckCircle2 size={18} /> Quote, payment and fulfilment agreed before confirmation</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="form-section" id="group-form">
        <div className="shell form-layout">
          <aside className="form-aside">
            <span className="eyebrow">Group order request</span>
            <h2>Give us the shape of the meal.</h2>
            <p>We will use these details to find the right fit and return with live availability and a coordinated quote.</p>
            <div className="form-assurance">
              <span><Building2 size={16} /> Suitable for offices, teams, meetings and events.</span>
              <span><ShieldCheck size={16} /> No payment information is collected in this form.</span>
              <span><MapPin size={16} /> The quote is confirmed before the order becomes final.</span>
            </div>
          </aside>

          <SubmissionForm endpoint="/api/forms/group-order" formName="group-order" successPath="/confirmation/group-order" submitLabel="Request a group quote" eventContext="group_order">
            <fieldset className="form-group">
              <legend>Group and contact</legend>
              <div className="field-grid">
                <label className="field"><span>Your name <em>*</em></span><input name="contactName" autoComplete="name" required /></label>
                <label className="field"><span>WhatsApp or phone <em>*</em></span><input name="phone" inputMode="tel" autoComplete="tel" placeholder="e.g. 6xx xxx xxx" required /></label>
                <label className="field"><span>Organisation or group <em>*</em></span><input name="organization" autoComplete="organization" required /></label>
                <label className="field"><span>Email</span><input name="email" type="email" autoComplete="email" /></label>
              </div>
            </fieldset>

            <fieldset className="form-group">
              <legend>The meal request</legend>
              <div className="field-grid">
                <label className="field"><span>Number of people <em>*</em></span><input name="headcount" type="number" min="2" required /></label>
                <label className="field"><span>Preferred date and time <em>*</em></span><input name="requestedDateTime" type="datetime-local" required /></label>
                <label className="field"><span>Budget direction</span><input name="budget" placeholder="Per person or total, if known" /></label>
                <label className="field"><span>Fulfilment <em>*</em></span><select name="fulfillmentMode" defaultValue="Delivery" required><option>Delivery</option><option>Pickup</option><option>Help me choose</option></select></label>
                <label className="field--full"><span>Meal preferences <em>*</em></span><textarea name="mealPreferences" placeholder="Describe the meal style, portions, kitchen preference or menu direction." required /></label>
              </div>
            </fieldset>

            <fieldset className="form-group">
              <legend>Location and coordination</legend>
              <div className="field-grid">
                <label className="field"><span>City <em>*</em></span><input name="city" defaultValue="Buea" required /></label>
                <label className="field"><span>Neighborhood</span><input name="neighborhood" /></label>
                <label className="field--full"><span>Location and nearest landmark <em>*</em></span><input name="locationLandmark" required /></label>
                <label className="field--full"><span>Other practical notes</span><textarea name="coordinationNotes" placeholder="Access, serving window, packaging needs or other practical information." /></label>
              </div>
            </fieldset>

            <div className="consent-block">
              <h3>Quote communication and optional updates</h3>
              <p>This request remains unconfirmed until Omala sends the live quote and you accept it.</p>
              <label className="check-row check-row--required"><input type="checkbox" name="orderAcknowledgement" value="true" required /><span>I understand this is a quote request and not yet a confirmed order. *</span></label>
              <label className="check-row check-row--required"><input type="checkbox" name="serviceContactConsent" value="true" required /><span>Omala may contact me about this group order request. *</span></label>
              <label className="check-row"><input type="checkbox" name="consentMarketingWhatsApp" value="true" /><span>Also send me optional future group-order ideas by WhatsApp.</span></label>
              <p>Read our <Link href="/privacy">privacy notice</Link> and <Link href="/order-policy">order policy</Link>.</p>
            </div>
          </SubmissionForm>
        </div>
      </section>
    </>
  );
}
