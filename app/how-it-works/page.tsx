import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChefHat,
  ClipboardCheck,
  MessageCircleMore,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { CtaBand, PageHero, SectionIntro } from "@/components/ui";
import { ResponsiveImage } from "@/components/responsive-image";
import { siteCopy } from "@/content";

export const metadata: Metadata = siteCopy.pages.howItWorks.metadata;

const kitchenSteps = [
  ["Share the operating picture", "The kitchen provides its current menu rhythm, service hours, pricing, fulfilment rules and lawful customer sources."],
  ["Set one clear order flow", "Omala configures the information every request needs: meal, quantity, timing, location, preferences and confirmation status."],
  ["Communicate consistently", "Approved menus and reminders go out through the agreed channels while incoming questions are organised."],
  ["Confirm before cooking", "The kitchen confirms current availability and timing before Omala gives the customer a final total and next step."],
  ["Keep everyone updated", "The customer receives service updates while the kitchen can stay focused on preparation and fulfilment."],
  ["Review what happened", "Weekly reporting separates messages sent, customers engaged and customers who actually purchased."],
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        {...siteCopy.pages.howItWorks.hero}
        actions={<><Link className="button button--accent" href="/order">Start an order <ArrowRight size={17} /></Link><Link className="button button--ghost-light" href="/for-kitchens#apply">Apply as a kitchen</Link></>}
        aside={<div className="content-grid-2"><div className="stat-card"><strong>2</strong><span>clear roles: customer desk and kitchen</span></div><div className="stat-card"><strong>1</strong><span>month to test the kitchen partnership</span></div></div>}
      />

      <section className="content-section content-section--cream">
        <div className="shell audience-grid">
          <article className="audience-card audience-card--customer">
            <span className="icon-tile"><ShoppingBag size={22} /></span>
            <span className="eyebrow" style={{ marginTop: 30 }}>For customers</span>
            <h2>Request, confirm, then commit.</h2>
            <p>You share the meal, time and location. Omala checks the live offer with the kitchen and sends the confirmed total and fulfilment plan.</p>
            <Link className="button button--ink" href="#customer-flow">Follow the customer flow</Link>
          </article>
          <article className="audience-card audience-card--kitchen">
            <div className="audience-icon"><ChefHat size={32} /></div>
            <span className="eyebrow eyebrow--light">For kitchens</span>
            <h2>Cook, update, fulfil.</h2>
            <p>You stay responsible for menu truth, food quality and fulfilment. Omala carries the repetitive communication around it.</p>
            <Link className="button button--cream" href="#kitchen-flow">Follow the kitchen flow</Link>
          </article>
        </div>
      </section>

      <section className="content-section" id="kitchen-flow">
        <div className="shell">
          <SectionIntro eyebrow="The kitchen journey" title="From an honest fit check to a measurable one-month pilot." description="The first goal is not scale. It is a working routine that the kitchen can fulfil and Omala can support well." />
          <div className="timeline">
            {kitchenSteps.map(([title, description], index) => <article className="timeline-card" key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{description}</p></article>)}
          </div>
        </div>
      </section>

      <section className="content-section content-section--tint" id="customer-flow">
        <div className="shell steps-layout">
          <div>
            <SectionIntro eyebrow="The customer journey" title="A short request with a clear human confirmation." description="The website starts the order without pretending that a changing menu or delivery situation is already final." />
            <Link className="button button--outline" href="/order">Start your request <ArrowRight size={17} /></Link>
            <div className="journey-visual">
              <ResponsiveImage
                className="journey-photo journey-photo--phone"
                avif="/images/brand/customer-ordering-phone.avif"
                fallback="/images/brand/customer-ordering-phone.jpg"
                alt="A customer choosing a meal on her phone at home"
                width={1800}
                height={948}
              />
              <p className="media-caption">
                Illustrative photo. Omala v1 begins with a request and a human confirmation, not live website checkout.
              </p>
            </div>
          </div>
          <div className="content-grid-2">
            {[
              [MessageCircleMore, "1. Ask or choose", "Request today’s menu or describe the meal you have in mind."],
              [ClipboardCheck, "2. Add useful details", "Share quantity, timing, neighborhood, landmark and fulfilment preference."],
              [CheckCircle2, "3. Receive confirmation", "Omala checks availability and sends the final price and fulfilment plan."],
              [PackageCheck, "4. Get service updates", "Once confirmed, updates continue through the agreed service channel."],
            ].map(([Icon, title, text]) => { const C = Icon as typeof MessageCircleMore; return <article className="content-card" key={String(title)}><span className="icon-tile"><C size={22} /></span><h3>{String(title)}</h3><p>{String(text)}</p></article>; })}
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="shell content-grid-3">
          <article className="content-card"><span className="icon-tile"><ShieldCheck size={22} /></span><h3>Consent stays specific</h3><p>Service messages and optional marketing are separated by channel, with no pre-checked promotional choices.</p></article>
          <article className="content-card"><span className="icon-tile icon-tile--warm"><MessageCircleMore size={22} /></span><h3>Automation stays responsible</h3><p>The experience leads with useful service—not technology—and the privacy notice accurately explains processing.</p></article>
          <article className="content-card"><span className="icon-tile"><BarChart3 size={22} /></span><h3>Results stay honest</h3><p>Omala measures sent, engaged and purchased instead of treating every message as a sale.</p></article>
        </div>
      </section>

      <CtaBand eyebrow="Choose your path" title="A clearer order for customers. A calmer customer desk for kitchens." description="Start with the journey that brought you here." primaryHref="/order" primaryLabel="Start an order" secondaryHref="/for-kitchens#apply" secondaryLabel="Apply as a kitchen" />
    </>
  );
}
