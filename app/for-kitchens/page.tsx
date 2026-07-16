import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChefHat,
  Clock3,
  Handshake,
  ListChecks,
  LockKeyhole,
  MessageCircleMore,
  Phone,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { PageHero, SectionIntro } from "@/components/ui";
import { BrandIcon } from "@/components/brand-mark";
import { SubmissionForm } from "@/components/submission-form";
import { siteCopy } from "@/content";

export const metadata: Metadata = siteCopy.pages.forKitchens.metadata;

const pilotSteps = [
  ["Apply and meet", "A decision-maker tells us how the kitchen currently receives orders, communicates and fulfils meals."],
  ["Confirm the fit", "We review service area, menu rhythm, customer channels and whether the kitchen can support a focused pilot."],
  ["Set up the flow", "Together we confirm the menu process, order details, response times, fulfilment rules and lawful customer sources."],
  ["Prepare the pilot", "Omala configures communication, customer organisation, order stages and the weekly scorecard."],
  ["Run for one month", "The kitchen cooks and fulfils; Omala manages the customer desk and keeps the order information moving."],
  ["Review the truth", "We compare messages sent, engagement, purchases, response time and operational fit before discussing longer terms."],
];

export default function ForKitchensPage() {
  return (
    <>
      <PageHero
        {...siteCopy.pages.forKitchens.hero}
        actions={
          <>
            <Link className="button button--accent" href="#apply">
              Apply for the pilot <ArrowRight size={17} />
            </Link>
            <Link className="button button--ghost-light" href="#expect">
              See what to expect
            </Link>
          </>
        }
        aside={
          <ul className="aside-list">
            <li><MessageCircleMore size={18} /> Daily menus and customer follow-up stay consistent.</li>
            <li><ListChecks size={18} /> Addresses, preferences and order details are collected clearly.</li>
            <li><Phone size={18} /> The kitchen stays involved from the phone without living in every chat.</li>
            <li><BarChart3 size={18} /> Weekly results show what was sent, engaged with and purchased.</li>
          </ul>
        }
      />

      <section className="content-section content-section--cream">
        <div className="shell">
          <SectionIntro
            eyebrow="Built around the real work"
            title="The kitchen keeps its identity. Omala makes the customer work repeatable."
            description="The goal is not to add another complicated app. It is to remove the repetitive work that keeps owners answering the same questions all day."
            align="center"
          />
          <div className="content-grid-3" style={{ marginTop: 48 }}>
            <article className="content-card">
              <span className="icon-tile"><Clock3 size={22} /></span>
              <h3>Fewer interruptions</h3>
              <p>Omala handles first questions, repeat details and follow-up so kitchen time stays kitchen time.</p>
            </article>
            <article className="content-card">
              <span className="icon-tile icon-tile--warm"><UsersRound size={22} /></span>
              <h3>Customers stay warm</h3>
              <p>Menus and reminders can go out consistently without the owner manually chasing every contact.</p>
            </article>
            <article className="content-card">
              <span className="icon-tile"><BarChart3 size={22} /></span>
              <h3>Demand gets clearer</h3>
              <p>Confirmed order information helps the kitchen prepare around real requests instead of cooking and hoping.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="content-section" id="expect">
        <div className="shell">
          <SectionIntro
            eyebrow="The one-month pilot"
            title="Know exactly what happens before the first customer message goes out."
            description="The pilot starts small, measures what changes and protects both Omala and the kitchen from promising more than the operation can deliver."
          />
          <div className="timeline">
            {pilotSteps.map(([title, description], index) => (
              <article className="timeline-card" key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section content-section--tint">
        <div className="shell content-grid-2">
          <article className="responsibility-card responsibility-card--green">
            <div className="responsibility-title">
              <BrandIcon />
              <div><small>Omala owns</small><h3>The customer desk</h3></div>
            </div>
            <ul className="check-list check-list--light">
              <li><Check size={16} /> Menu sharing and approved outreach</li>
              <li><Check size={16} /> Initial questions and order information</li>
              <li><Check size={16} /> Confirmation and customer status messages</li>
              <li><Check size={16} /> Customer records, feedback and weekly reporting</li>
            </ul>
          </article>
          <article className="responsibility-card responsibility-card--sand">
            <div className="responsibility-title">
              <span className="icon-tile icon-tile--warm"><ChefHat size={22} /></span>
              <div><small>The kitchen owns</small><h3>The meal & fulfilment</h3></div>
            </div>
            <ul className="check-list">
              <li><Check size={16} /> Accurate menus, prices and availability</li>
              <li><Check size={16} /> Food safety, quality and preparation times</li>
              <li><Check size={16} /> Packaging and prompt status updates</li>
              <li><Check size={16} /> Delivery or pickup as agreed for the pilot</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="content-section">
        <div className="shell group-feature__grid">
          <div className="photo-placeholder photo-placeholder--fish" role="img" aria-label="A Cameroonian kitchen operator grilling fish" />
          <div>
            <SectionIntro
              eyebrow="A good pilot fit"
              title="We are looking for kitchens ready to communicate clearly and fulfil consistently."
              description="Omala works best when the kitchen has a real offer, a decision-maker who can act, and customers or an audience it is lawfully allowed to contact."
            />
            <ul className="plain-checks">
              <li><CheckCircle2 size={18} /> An active menu or repeat meal offer</li>
              <li><CheckCircle2 size={18} /> Reliable phone and a clear decision-maker</li>
              <li><CheckCircle2 size={18} /> Defined service area and fulfilment method</li>
              <li><CheckCircle2 size={18} /> Timely availability and status updates</li>
              <li><ShieldCheck size={18} /> Lawful permission for any existing contact list</li>
            </ul>
            <p className="field-note">
              Photo: <a href="https://commons.wikimedia.org/wiki/File:Braiseuse_de_Poisson.jpg" target="_blank" rel="noreferrer">Minette Lontsie / Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>. Cropped for layout.
            </p>
          </div>
        </div>
      </section>

      <section className="form-section" id="apply">
        <div className="shell form-layout">
          <aside className="form-aside">
            <span className="eyebrow">Apply for the pilot</span>
            <h2>Tell us how your kitchen works today.</h2>
            <p>
              This is a fit application, not a contract. We will review the
              basics and contact the kitchen decision-maker about a focused one-month pilot.
            </p>
            <div className="form-assurance">
              <span><LockKeyhole size={16} /> No customer lists, IDs or sensitive documents are uploaded here.</span>
              <span><Handshake size={16} /> Pricing and long-term terms are discussed only after the fit review.</span>
              <span><ShieldCheck size={16} /> Marketing permission is optional and separate.</span>
            </div>
          </aside>

          <SubmissionForm
            endpoint="/api/forms/kitchen-application"
            formName="kitchen-application"
            successPath="/confirmation/kitchen-application"
            submitLabel="Send kitchen application"
            eventContext="kitchen_application"
          >
            <fieldset className="form-group">
              <legend>Kitchen and decision-maker</legend>
              <div className="field-grid">
                <label className="field">
                  <span>Your name <em>*</em></span>
                  <input name="decisionMakerName" autoComplete="name" required />
                </label>
                <label className="field">
                  <span>Kitchen name <em>*</em></span>
                  <input name="kitchenName" autoComplete="organization" required />
                </label>
                <label className="field">
                  <span>WhatsApp or phone <em>*</em></span>
                  <input name="phone" inputMode="tel" autoComplete="tel" placeholder="e.g. 6xx xxx xxx" required />
                </label>
                <label className="field">
                  <span>Email</span>
                  <input name="email" type="email" autoComplete="email" />
                </label>
                <label className="field">
                  <span>Your role</span>
                  <select name="role" defaultValue="Owner / founder">
                    <option>Owner / founder</option><option>General manager</option><option>Operations lead</option><option>Other decision-maker</option>
                  </select>
                </label>
                <label className="field">
                  <span>City <em>*</em></span>
                  <input name="city" defaultValue="Buea" required />
                </label>
                <label className="field--full">
                  <span>Neighborhood or nearest landmark</span>
                  <input name="neighborhood" placeholder="Help us understand where the kitchen operates" />
                </label>
              </div>
            </fieldset>

            <fieldset className="form-group">
              <legend>How the kitchen operates <small>Short estimates are fine.</small></legend>
              <div className="field-grid">
                <label className="field">
                  <span>Cuisine or main offer</span>
                  <input name="cuisine" placeholder="e.g. Cameroonian meals, grills" />
                </label>
                <label className="field">
                  <span>Operating hours</span>
                  <input name="operatingHours" placeholder="e.g. Mon–Sat, 10am–7pm" />
                </label>
                <label className="field">
                  <span>Approximate daily orders</span>
                  <select name="dailyOrderBand" defaultValue="">
                    <option value="" disabled>Select a range</option><option>0–5</option><option>6–15</option><option>16–30</option><option>31–60</option><option>60+</option><option>Not sure</option>
                  </select>
                </label>
                <label className="field">
                  <span>Customer list or audience</span>
                  <select name="customerListType" defaultValue="">
                    <option value="" disabled>Select what exists today</option><option>WhatsApp contacts or chats</option><option>Broadcast list</option><option>WhatsApp group</option><option>Spreadsheet / CRM list</option><option>Social audience only</option><option>No retrievable list yet</option>
                  </select>
                </label>
                <label className="field">
                  <span>Approximate contact count</span>
                  <input name="approximateCustomerListSize" inputMode="numeric" placeholder="An estimate is enough" />
                </label>
                <label className="field">
                  <span>Preferred contact time</span>
                  <input name="preferredContactTime" placeholder="e.g. weekdays after 3pm" />
                </label>
                <label className="field--full">
                  <span>Service area <em>*</em></span>
                  <input name="serviceArea" placeholder="Neighborhoods or areas you currently serve" required />
                </label>
              </div>
              <div style={{ marginTop: 20 }}>
                <span className="field-note">How do orders reach you today?</span>
                <div className="choice-grid" style={{ marginTop: 8 }}>
                  {[
                    "WhatsApp messages", "Phone calls", "WhatsApp group", "Instagram / Facebook", "Walk-in", "Referrals",
                  ].map((label) => (
                    <label className="choice-card" key={label}><input type="checkbox" name="currentOrderChannels" value={label} />{label}</label>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 20 }}>
                <span className="field-note">How do customers receive orders?</span>
                <div className="choice-grid" style={{ marginTop: 8 }}>
                  {[
                    "Kitchen-arranged delivery", "Third-party delivery", "Customer-arranged delivery", "Pickup",
                  ].map((label) => (
                    <label className="choice-card" key={label}><input type="checkbox" name="fulfillmentModel" value={label} />{label}</label>
                  ))}
                </div>
              </div>
            </fieldset>

            <fieldset className="form-group">
              <legend>Why now?</legend>
              <label className="field--full">
                <span>What would you most like Omala to improve?</span>
                <textarea name="pilotGoals" placeholder="Tell us where communication or order handling is costing the kitchen time today." />
              </label>
            </fieldset>

            <div className="consent-block">
              <h3>Permission and communication</h3>
              <p>We only ask whether a lawful customer source exists. Do not paste or upload any customer information in this application.</p>
              <label className="check-row check-row--required">
                <input type="checkbox" name="contactAuthorityAttestation" value="true" required />
                <span>I confirm that I am authorised to discuss this kitchen and that any customer contacts later provided will have a lawful basis for use. *</span>
              </label>
              <label className="check-row check-row--required">
                <input type="checkbox" name="serviceContactConsent" value="true" required />
                <span>Omala may contact me about this application and possible pilot. *</span>
              </label>
              <label className="check-row">
                <input type="checkbox" name="consentMarketingWhatsApp" value="true" />
                <span>Also send me optional Omala news and kitchen opportunities by WhatsApp.</span>
              </label>
              <p>Read our <Link href="/privacy">privacy notice</Link> and <Link href="/marketing-notice">marketing notice</Link>.</p>
            </div>
          </SubmissionForm>
        </div>
      </section>
    </>
  );
}
