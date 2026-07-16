import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Home } from "lucide-react";
import { siteCopy } from "@/content";

export const metadata: Metadata = { ...siteCopy.pages.confirmation.metadata, robots: { index: false, follow: false } };

const confirmationCopy = {
  "kitchen-application": {
    title: "Your kitchen application is in.",
    description: "Omala will review the fit details and contact the decision-maker about the one-month pilot.",
    next: "Keep the receipt ID for your records. Do not send customer lists or documents until a protected onboarding step is agreed.",
    primaryHref: "/for-kitchens",
    primaryLabel: "Review the kitchen pilot",
  },
  order: {
    title: "Your order request is in.",
    description: "Omala will check the current menu, price and fulfilment details before anything becomes a confirmed order.",
    next: "Watch the service channel you provided. Do not send payment credentials; payment instructions come only after confirmation.",
    primaryHref: "/order",
    primaryLabel: "Start another request",
  },
  "group-order": {
    title: "Your group request is in.",
    description: "Omala will review the headcount, timing and location, then return with live availability and a coordinated quote.",
    next: "The request is not yet a confirmed order. Keep the receipt ID for follow-up.",
    primaryHref: "/group-orders",
    primaryLabel: "Review group orders",
  },
  contact: {
    title: "Your message is in the right place.",
    description: "Omala will route it to the person handling that topic and reply through the contact details you provided.",
    next: "If the message concerns an order, keep the receipt ID ready for follow-up.",
    primaryHref: "/faq",
    primaryLabel: "Read common answers",
  },
  preferences: {
    title: "Your marketing choices were received.",
    description: "Omala will update the matching contact record with the channels—or withdrawal—you selected.",
    next: "This does not cancel active orders or prevent necessary service communication about an existing request.",
    primaryHref: "/marketing-preferences",
    primaryLabel: "Review preferences",
  },
} as const;

export default async function ConfirmationPage({ params, searchParams }: { params: Promise<{ type: string }>; searchParams: Promise<{ id?: string }> }) {
  const [{ type }, query] = await Promise.all([params, searchParams]);
  const copy = confirmationCopy[type as keyof typeof confirmationCopy];
  if (!copy) notFound();
  const receipt = typeof query.id === "string" ? query.id.replace(/[^A-Za-z0-9-]/g, "").slice(0, 40) : "received";

  return <section className="confirmation-page"><div className="confirmation-card"><span className="confirmation-icon"><Check size={30} /></span><span className="eyebrow">Request received</span><h1>{copy.title}</h1><p>{copy.description}</p><span className="receipt">Receipt: {receipt}</span><p>{copy.next}</p><div className="confirmation-actions"><Link className="button button--ink" href={copy.primaryHref}>{copy.primaryLabel} <ArrowRight size={16} /></Link><Link className="button button--outline" href="/"><Home size={16} /> Home</Link></div></div></section>;
}
