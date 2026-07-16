import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { siteCopy } from "@/content";

export const metadata: Metadata = siteCopy.pages.terms.metadata;

export default function TermsPage() {
  return <LegalPage {...siteCopy.pages.terms.hero}>
    <h2>About the pilot</h2><p>Omala Kitchen Hub coordinates customer communication and order information between customers and participating kitchens. The pilot website does not promise nationwide availability, guaranteed kitchen growth, a live marketplace, an Omala-owned delivery fleet or automatic payment processing.</p>
    <h2>Order requests</h2><p>Sending an order or group-order form does not create a confirmed order. An order exists only after current availability, final price, fulfilment, timing and any payment instruction are communicated and accepted. See the <Link href="/order-policy">order policy</Link>.</p>
    <h2>Kitchen responsibilities</h2><p>Participating kitchens remain responsible for menu accuracy, prices, availability, food safety, quality, preparation, packaging and the fulfilment commitments agreed for an order. Omala remains responsible for the communication and coordination services it agrees to provide.</p>
    <h2>Customer responsibilities</h2><p>Customers must provide accurate contact, location and order information; respond to confirmation requests; and follow the payment and fulfilment instructions accepted for the order. Do not use the website to send unlawful, fraudulent or sensitive information.</p>
    <h2>Kitchen applications</h2><p>An application is an invitation to discuss the one-month pilot, not a promise of acceptance or a final commercial contract. A kitchen must have an authorised decision-maker and a lawful basis for any customer contacts later introduced to Omala.</p>
    <h2>Availability and changes</h2><p>Menus, prices, service hours and fulfilment can change. Omala may correct information, pause a request flow or decline an unsafe, unlawful or impractical request.</p>
    <h2>Contact</h2><p>Use the <Link href="/contact">contact page</Link> for questions about these terms or a specific receipt.</p>
  </LegalPage>;
}
