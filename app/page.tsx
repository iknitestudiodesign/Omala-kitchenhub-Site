import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChefHat,
  ClipboardCheck,
  Clock3,
  HeartHandshake,
  MapPin,
  MessageCircleMore,
  PackageCheck,
  PhoneCall,
  ShoppingBag,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { CtaBand, NumberStep, SectionIntro } from "@/components/ui";
import { BrandIcon } from "@/components/brand-mark";
import { ResponsiveImage } from "@/components/responsive-image";
import { TrackedLink } from "@/components/tracked-link";
import { siteCopy } from "@/content";

const handledItems = [
  "Daily menu outreach and customer follow-up",
  "Questions, preferences and order details",
  "Order confirmation and customer updates",
  "Organised customer history and feedback",
];

const kitchenItems = [
  "Set the menu, availability and final prices",
  "Prepare food safely and consistently",
  "Package orders and share status updates",
  "Fulfil delivery or pickup as agreed",
];

export default function Home() {
  const title = siteCopy.promise.titleParts;

  return (
    <>
      <section className="home-hero">
        <div className="hero-orb hero-orb--one" />
        <div className="hero-orb hero-orb--two" />
        <div className="shell home-hero__grid">
          <div className="home-hero__copy">
            <div className="pilot-pill">
              <span /> Buea pilot · Kitchen applications open
            </div>
            <span className="eyebrow eyebrow--light">{siteCopy.promise.eyebrow}</span>
            <h1>
              {title.lead}
              <em>{title.accent}</em>
              {title.rest}
            </h1>
            <p>{siteCopy.promise.description}</p>
            <div className="hero-actions">
              <TrackedLink
                className="button button--accent"
                href="/order"
                eventName="order_start"
                eventContext="home_hero"
              >
                {siteCopy.actions.order} <ArrowRight size={18} aria-hidden="true" />
              </TrackedLink>
              <TrackedLink
                className="button button--ghost-light"
                href="/for-kitchens#apply"
                eventName="kitchen_application_start"
                eventContext="home_hero"
              >
                {siteCopy.actions.apply}
              </TrackedLink>
            </div>
            <div className="hero-proof">
              <div className="avatar-stack" aria-hidden="true">
                <span className="brand-proof-mark"><BrandIcon /></span>
                <span><MessageCircleMore size={15} /></span>
                <span><CheckCircle2 size={15} /></span>
              </div>
              <p>
                Built around the real way kitchens in Buea sell—by phone,
                message and trusted relationships.
              </p>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-photo">
              <ResponsiveImage
                className="hero-photo__media"
                avif="/images/hero-kitchen.avif"
                fallback="/images/hero-kitchen.jpg"
                alt="A kitchen owner preparing food while checking a phone"
                width={932}
                height={1400}
                eager
              />
              <div className="photo-wash" />
            </div>
            <div className="floating-card floating-card--menu">
              <span className="floating-icon"><Sparkles size={17} /></span>
              <div><small>Today’s menu</small><strong>Shared on time</strong></div>
              <CheckCircle2 size={19} aria-label="Complete" />
            </div>
            <div className="floating-card floating-card--order">
              <span className="floating-icon floating-icon--orange"><ShoppingBag size={17} /></span>
              <div><small>New request</small><strong>Details captured</strong></div>
              <span className="status-dot">New</span>
            </div>
            <div className="hero-stat">
              <strong>1</strong>
              <span>calm place to manage the customer side</span>
            </div>
          </div>
        </div>
      </section>

      <section className="signal-strip">
        <div className="shell signal-grid">
          <span><MessageCircleMore size={18} /> Consistent communication</span>
          <span><ClipboardCheck size={18} /> Clear order details</span>
          <span><PhoneCall size={18} /> Built for the phone</span>
          <span><BarChart3 size={18} /> Useful customer records</span>
        </div>
      </section>

      <section className="section section--cream">
        <div className="shell split-heading">
          <SectionIntro
            eyebrow="Less daily chasing"
            title="Your busiest work should happen in the kitchen—not in endless chats."
          />
          <p className="lead-note">
            When every menu, address, preference and follow-up lives in a
            different conversation, growth feels like more noise. Omala turns
            that noise into a simple, repeatable order flow.
          </p>
        </div>
        <div className="shell benefit-grid">
          {[
            [MessageCircleMore, "Stay visible", "Keep customers informed without personally sending every menu and reminder."],
            [Clock3, "Recover your time", "Spend less of the day repeating prices, collecting addresses and chasing confirmations."],
            [PackageCheck, "Prepare with clarity", "See confirmed demand earlier and reduce the guesswork behind what to cook."],
            [HeartHandshake, "Keep the relationship", "Communication still feels warm, local and connected to the kitchen customers trust."],
          ].map(([Icon, title, text]) => {
            const IconComponent = Icon as typeof MessageCircleMore;
            return (
              <article className="benefit-card" key={String(title)}>
                <span className="icon-tile"><IconComponent size={22} /></span>
                <h3>{String(title)}</h3>
                <p>{String(text)}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section section--white">
        <div className="shell">
          <SectionIntro
            eyebrow="A clear partnership"
            title="Omala runs the customer desk. Your kitchen stays in control of the food."
            description="No vague promises. Everyone knows what they own from the first day of the pilot."
            align="center"
          />
          <div className="responsibility-grid">
            <article className="responsibility-card responsibility-card--green">
              <div className="responsibility-title">
                <BrandIcon />
                <div><small>Omala handles</small><h3>The customer side</h3></div>
              </div>
              <ul className="check-list check-list--light">
                {handledItems.map((item) => <li key={item}><Check size={16} />{item}</li>)}
              </ul>
              <Link href="/how-it-works" className="card-link card-link--light">
                Follow the Omala flow <ArrowRight size={16} />
              </Link>
            </article>
            <article className="responsibility-card responsibility-card--sand">
              <div className="responsibility-title">
                <span className="icon-tile icon-tile--warm"><ChefHat size={22} /></span>
                <div><small>Your kitchen handles</small><h3>The food & fulfilment</h3></div>
              </div>
              <ul className="check-list">
                {kitchenItems.map((item) => <li key={item}><Check size={16} />{item}</li>)}
              </ul>
              <Link href="/for-kitchens#expect" className="card-link">
                See what to expect <ArrowRight size={16} />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="section section--green steps-section">
        <div className="shell steps-layout">
          <div className="steps-copy">
            <SectionIntro
              eyebrow="How it works"
              title="A calmer path from today’s menu to a confirmed order."
              description="Customers get a clear next step. Kitchens get the information they need without living inside the phone all day."
            />
            <Link href="/how-it-works" className="button button--cream">
              See both journeys <ArrowRight size={17} />
            </Link>
          </div>
          <div className="number-steps">
            <NumberStep number="01" title="Share what is available">
              The kitchen gives Omala the current menu, prices, service times and fulfilment rules.
            </NumberStep>
            <NumberStep number="02" title="Bring customers into one flow">
              Omala shares menus, answers initial questions and collects complete order details.
            </NumberStep>
            <NumberStep number="03" title="Confirm before anyone commits">
              The kitchen confirms availability; the customer receives the total and fulfilment details.
            </NumberStep>
            <NumberStep number="04" title="Follow through and learn">
              Omala keeps the customer updated, requests feedback and organises useful order history.
            </NumberStep>
          </div>
        </div>
      </section>

      <section className="section section--cream audience-section">
        <div className="shell audience-grid">
          <article className="audience-card audience-card--customer">
            <ResponsiveImage
              className="audience-photo"
              avif="/images/brand/customers-opening-takeaway.avif"
              fallback="/images/brand/customers-opening-takeaway.jpg"
              alt="Two people opening a takeaway meal together at a table"
              width={1800}
              height={1200}
            />
            <span className="eyebrow">For customers</span>
            <h2>Ask for today’s menu or start your order.</h2>
            <p>
              Tell us what you want, where you are and when you need it. We’ll
              confirm the live menu, total and fulfilment before the order is final.
            </p>
            <Link className="button button--ink" href="/order">
              Start an order <ArrowRight size={17} />
            </Link>
          </article>
          <article className="audience-card audience-card--kitchen">
            <div className="audience-icon"><ChefHat size={33} /></div>
            <span className="eyebrow eyebrow--light">For kitchens</span>
            <h2>Try a focused one-month Omala pilot.</h2>
            <p>
              We set up the customer and order workflow around the way your
              kitchen already works, then review the real results together.
            </p>
            <Link className="button button--cream" href="/for-kitchens#apply">
              Apply for the pilot <ArrowRight size={17} />
            </Link>
          </article>
        </div>
      </section>

      <section className="section section--white group-feature">
        <div className="shell group-feature__grid">
          <div className="group-visual">
            <div className="photo-placeholder photo-placeholder--group" />
            <div className="location-chip"><MapPin size={16} /> One office · One organised drop</div>
          </div>
          <div>
            <SectionIntro
              eyebrow="Office & group orders"
              title="One request for the whole table, team or event."
              description="Group orders help kitchens plan earlier while customers get one coordinated quote and fulfilment plan. Tell us the headcount, location and timing—we’ll organise the next step."
            />
            <ul className="plain-checks">
              <li><CheckCircle2 size={18} /> Office lunches and staff meals</li>
              <li><CheckCircle2 size={18} /> Events and one-location delivery</li>
              <li><CheckCircle2 size={18} /> Manual quote before confirmation</li>
            </ul>
            <TrackedLink className="button button--outline" href="/group-orders" eventName="group_order_start" eventContext="home_group_orders">
              Plan a group order <UsersRound size={17} />
            </TrackedLink>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Ready when you are"
        title="A better food day starts with a clearer order."
        description="Start a meal request, or tell us about the kitchen you want to grow."
        primaryHref="/order"
        primaryLabel="Start an order"
        secondaryHref="/for-kitchens#apply"
        secondaryLabel="Apply as a kitchen"
      />
    </>
  );
}
