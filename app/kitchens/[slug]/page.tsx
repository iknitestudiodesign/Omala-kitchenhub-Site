import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Clock3, MapPin, PackageCheck, ShieldCheck } from "lucide-react";
import { CtaBand, PageHero, SectionIntro } from "@/components/ui";
import { siteCopy } from "@/content";
import { getKitchen, kitchens } from "@/lib/kitchens";
import { siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return kitchens.map((kitchen) => ({ slug: kitchen.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const kitchen = getKitchen(slug);
  if (!kitchen) return { title: siteCopy.pages.kitchenProfile.metadata.notFoundTitle };
  return { title: kitchen.name, description: kitchen.description };
}

export default async function KitchenPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const kitchen = getKitchen(slug);
  if (!kitchen) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: kitchen.name,
    description: kitchen.description,
    areaServed: kitchen.serviceArea,
    url: `${siteConfig.url}/kitchens/${kitchen.slug}`,
    servesCuisine: kitchen.cuisine,
  };

  return (
    <>
      <PageHero eyebrow={kitchen.verified ? siteCopy.pages.kitchenProfile.hero.verifiedEyebrow : siteCopy.pages.kitchenProfile.hero.pilotEyebrow} title={kitchen.name} description={kitchen.description} actions={<><Link className="button button--accent" href={`/order?kitchen=${kitchen.slug}`}>Request from this kitchen <ArrowRight size={17} /></Link><Link className="button button--ghost-light" href="/order">See order options</Link></>} aside={<ul className="aside-list"><li><MapPin size={18} /> {kitchen.serviceArea}</li><li><Clock3 size={18} /> {kitchen.hours}</li><li><PackageCheck size={18} /> {kitchen.fulfillment.join(" · ")}</li></ul>} />
      <section className="content-section content-section--cream"><div className="shell group-feature__grid"><div className="photo-placeholder" style={{ minHeight: 430, borderRadius: 30, backgroundImage: `linear-gradient(to top, rgba(23,63,50,.2), transparent), url(${kitchen.image})` }} role="img" aria-label={kitchen.imageAlt} /><div><SectionIntro eyebrow="Kitchen profile" title="The stable details, with live availability confirmed for every request." description="Omala publishes verified service information here. Daily menu items, final prices and fulfilment are confirmed before the customer commits." /><ul className="plain-checks">{kitchen.cuisine.map((item) => <li key={item}><CheckCircle2 size={18} />{item}</li>)}<li><ShieldCheck size={18} /> Order requests are confirmed live</li></ul></div></div></section>
      <CtaBand eyebrow="Start with a request" title={`Ask ${kitchen.name} what is available today.`} description="Share the meal, quantity, timing and location. Omala will return with the confirmed details." primaryHref={`/order?kitchen=${kitchen.slug}`} primaryLabel="Start an order request" secondaryHref="/group-orders" secondaryLabel="Plan a group order" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
