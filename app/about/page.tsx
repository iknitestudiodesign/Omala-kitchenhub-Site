import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, HeartHandshake, MapPin, MessageCircleMore, ShieldCheck } from "lucide-react";
import { CtaBand, PageHero, SectionIntro } from "@/components/ui";
import { ResponsiveImage } from "@/components/responsive-image";
import { siteCopy } from "@/content";

export const metadata: Metadata = siteCopy.pages.about.metadata;

export default function AboutPage() {
  return (
    <>
      <PageHero
        {...siteCopy.pages.about.hero}
        actions={<><Link className="button button--accent" href="/for-kitchens#apply">Build with Omala <ArrowRight size={17} /></Link><Link className="button button--ghost-light" href="/how-it-works">See how it works</Link></>}
        aside={<ul className="aside-list"><li><MapPin size={18} /> Starting with a focused pilot in Buea.</li><li><MessageCircleMore size={18} /> Designed around phone and messaging habits that already exist.</li><li><HeartHandshake size={18} /> Built to strengthen—not erase—the relationship between a kitchen and its customers.</li></ul>}
      />

      <section className="content-section content-section--cream">
        <div className="shell two-column-copy">
          <div className="sticky-copy">
            <SectionIntro eyebrow="Why we exist" title="Good food should not be buried under scattered order chats." />
          </div>
          <div className="prose">
            <p>
              A small kitchen can receive an order through a personal WhatsApp
              message, a group, a phone call, a social post or a referral. Every
              order can require the same questions again: what is available,
              where is the customer, what should change, how will payment work
              and who will deliver it?
            </p>
            <p>
              That work is important, but it should not consume the person who
              must also price the menu, manage the team, buy ingredients and make
              the meal. Omala turns the customer side into a clearer routine.
            </p>
            <div className="prose-note">
              <strong>Our practical promise:</strong> help the kitchen communicate
              consistently, collect complete order details and build useful
              customer history—without pretending that technology replaces the
              trust behind a local food business.
            </div>
          </div>
        </div>
      </section>

      <section className="content-section content-section--tint">
        <div className="shell group-feature__grid">
          <div className="brand-story-visual">
            <ResponsiveImage
              className="brand-story-photo"
              avif="/images/brand/omala-packaging-concept.avif"
              fallback="/images/brand/omala-packaging-concept.png"
              alt="Two white Omala-branded takeaway boxes shown in an early packaging concept"
              width={1800}
              height={1200}
            />
            <p className="media-caption">Early Omala packaging concept from the brand archive.</p>
          </div>
          <div>
            <SectionIntro
              eyebrow="Brand heritage"
              title="A food experience people can recognise and trust."
              description="Omala has always been about the moment around the meal: a clear promise, thoughtful presentation and a warm connection between kitchen and customer."
            />
            <div className="prose-note">
              This archival mockup communicates the brand direction. It does not promise that every pilot order will use Omala-branded packaging; each kitchen remains responsible for safe, suitable packaging during the pilot.
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="shell group-feature__grid">
          <div>
            <SectionIntro eyebrow="Starting in Buea" title="Learn locally, prove the flow, then earn the right to grow." description="The first Omala release is deliberately focused. A smaller service area lets the team understand real kitchen operations, order patterns and fulfilment constraints before expanding the promise." />
            <ul className="plain-checks">
              <li><CheckCircle2 size={18} /> Begin with verified kitchen partners</li>
              <li><CheckCircle2 size={18} /> Measure engagement and completed orders honestly</li>
              <li><CheckCircle2 size={18} /> Improve the workflow around real service conditions</li>
            </ul>
          </div>
          <div>
            <div className="photo-placeholder photo-placeholder--food" style={{ minHeight: 430, borderRadius: 30 }} role="img" aria-label="Ndolè royal Sawa with crab and plantain" />
            <p className="field-note" style={{ marginTop: 9 }}>
              Photo: <a href="https://commons.wikimedia.org/wiki/File:Ndol%C3%A8_royal_sawa_au_crabe.jpg" target="_blank" rel="noreferrer">BACHELOR45 / Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>. Cropped for layout.
            </p>
          </div>
        </div>
      </section>

      <section className="content-section content-section--tint">
        <div className="shell">
          <SectionIntro eyebrow="How we intend to work" title="Useful, honest and respectful by design." align="center" />
          <div className="content-grid-3" style={{ marginTop: 45 }}>
            <article className="content-card"><span className="icon-tile"><HeartHandshake size={22} /></span><h3>Human relationships first</h3><p>Omala should feel like reliable support around the kitchen, not a faceless replacement for it.</p></article>
            <article className="content-card"><span className="icon-tile icon-tile--warm"><ShieldCheck size={22} /></span><h3>Permission before promotion</h3><p>Customer contact data is not a shortcut. The source, permission and selected channels must be clear.</p></article>
            <article className="content-card"><span className="icon-tile"><MessageCircleMore size={22} /></span><h3>Clarity before scale</h3><p>A smaller flow that confirms real orders is more valuable than a large list of messages with no outcome.</p></article>
          </div>
        </div>
      </section>

      <section className="content-section" id="photo-credits">
        <div className="shell prose" style={{ maxWidth: 820 }}>
          <h2>Photography credits</h2>
          <p>
            Kitchen-and-phone photo by <a href="https://www.pexels.com/photo/woman-cooking-at-kitchen-using-smartphone-12911615/" target="_blank" rel="noreferrer">Mizuno K on Pexels</a>. Group-meal photo by <a href="https://www.pexels.com/photo/packed-food-in-containers-6995262/" target="_blank" rel="noreferrer">Julia M Cameron on Pexels</a>. Ndolè royal Sawa photo by <a href="https://commons.wikimedia.org/wiki/File:Ndol%C3%A8_royal_sawa_au_crabe.jpg" target="_blank" rel="noreferrer">BACHELOR45 via Wikimedia Commons</a>. Fish-kitchen photo by <a href="https://commons.wikimedia.org/wiki/File:Braiseuse_de_Poisson.jpg" target="_blank" rel="noreferrer">Minette Lontsie via Wikimedia Commons</a>. The Wikimedia photos use the <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0 license</a>. Adobe Stock assets 829989781, 612519432 and 380809213 were supplied by Omala / Iknite Studio under their license. The 612519432 background was adapted to the official Omala palette. Some images are cropped for layout. Stock subjects are illustrative and are not presented as Omala partners or endorsers.
          </p>
        </div>
      </section>

      <CtaBand eyebrow="Join the pilot" title="Help shape a customer desk that fits the kitchens it serves." description="Applications are open for qualified Buea kitchens and customer order requests." primaryHref="/for-kitchens#apply" primaryLabel="Apply as a kitchen" secondaryHref="/order" secondaryLabel="Start an order" />
    </>
  );
}
