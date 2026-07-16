import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HelpCircle, MessageCircleMore, ShieldCheck } from "lucide-react";
import { CtaBand, PageHero, SectionIntro } from "@/components/ui";
import { siteCopy } from "@/content";

export const metadata: Metadata = siteCopy.pages.faq.metadata;

const customerFaqs = [
  ["Is my website request already a confirmed order?", "No. Omala first checks the live menu, price, availability and fulfilment plan. The order is confirmed only after you receive those details and accept them."],
  ["Can I pay on the website?", "Not during the first pilot. The website never asks for Mobile Money credentials or account numbers. Payment instructions are shared only after the order is confirmed."],
  ["Does Omala deliver the food?", "During the pilot, fulfilment may be handled by the kitchen, a delivery partner, the customer or pickup. Omala confirms the method for each order and does not claim to own a delivery fleet."],
  ["What if I do not know which kitchen to choose?", "Choose “Let Omala match my request.” We will look for a verified kitchen that fits the meal, area and timing."],
  ["Can I order for an office or event?", "Yes. Use the group-order form so we can capture headcount, location and timing before preparing a coordinated quote."],
];

const kitchenFaqs = [
  ["What does Omala handle?", "Omala handles agreed customer outreach, initial questions, order information, confirmations, service updates, customer organisation, feedback and reporting."],
  ["What does my kitchen still handle?", "The kitchen owns menu truth, prices, availability, food safety, quality, preparation, packaging, timely status updates and the agreed fulfilment method."],
  ["How much does it cost?", "Commercial terms are not published during the pilot. Qualified kitchens complete a one-month test first, then review the real operating fit and results before discussing a longer arrangement."],
  ["Do I need a customer list?", "Omala works best when a kitchen has customers or an audience it is lawfully allowed to contact. We ask about the source during qualification, but never accept customer-list uploads through the public application form."],
  ["Will Omala post as if I personally wrote every message?", "Communication can carry the kitchen’s approved voice, but Omala will not make deceptive claims about who personally wrote a message. Our privacy information also explains where automation supports the service."],
  ["What happens after I apply?", "A decision-maker completes a fit conversation. If the kitchen is ready, we agree the menu, channels, response times, fulfilment rules, consented contacts and measures for a one-month pilot."],
];

function FaqGroup({ items }: { items: string[][] }) {
  return <div className="faq-list">{items.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>;
}

export default function FaqPage() {
  return (
    <>
      <PageHero {...siteCopy.pages.faq.hero} actions={<><Link className="button button--accent" href="#customers">Customer questions <ArrowRight size={17} /></Link><Link className="button button--ghost-light" href="#kitchens">Kitchen questions</Link></>} aside={<ul className="aside-list"><li><HelpCircle size={18} /> No order is final before a live confirmation.</li><li><ShieldCheck size={18} /> Optional marketing remains separate from service communication.</li><li><MessageCircleMore size={18} /> Contact Omala if your situation is not covered below.</li></ul>} />
      <section className="content-section content-section--cream" id="customers"><div className="shell"><SectionIntro eyebrow="For customers" title="Ordering and fulfilment" align="center" /><FaqGroup items={customerFaqs} /></div></section>
      <section className="content-section" id="kitchens"><div className="shell"><SectionIntro eyebrow="For kitchens" title="The pilot and partnership" align="center" /><FaqGroup items={kitchenFaqs} /></div></section>
      <CtaBand eyebrow="Still deciding?" title="Tell us the question behind the question." description="We’ll respond about an order, kitchen application or general Omala enquiry." primaryHref="/contact" primaryLabel="Contact Omala" secondaryHref="/how-it-works" secondaryLabel="Review the flow" />
    </>
  );
}
