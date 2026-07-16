import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { siteCopy } from "@/content";

export const metadata: Metadata = siteCopy.pages.orderPolicy.metadata;

export default function OrderPolicyPage() {
  return <LegalPage {...siteCopy.pages.orderPolicy.hero}>
    <h2>Starting a request</h2><p>You may ask for today’s menu, describe a meal, request a kitchen or ask Omala to match the request. Provide a reachable phone number, timing, quantity, neighborhood and landmark.</p>
    <h2>Confirmation</h2><p>Omala checks the kitchen’s current availability, price and preparation window. The fulfilment method—delivery, third-party delivery, customer-arranged delivery or pickup—is stated before confirmation. The request is not final until you accept those details.</p>
    <h2>Payment</h2><p>The website does not collect payment or Mobile Money credentials. If prepayment is required, instructions are sent only after confirmation through the agreed service channel. Verify that the instruction refers to your Omala receipt before paying.</p>
    <h2>Changes and cancellation</h2><p>Before confirmation, you may withdraw a request. After confirmation, cancellation, refund and change options depend on preparation status, food already purchased or prepared, the kitchen’s policy and any delivery cost already incurred. Omala will communicate the applicable outcome rather than promise an automatic refund.</p>
    <h2>Delivery and pickup</h2><p>Omala does not claim to own a delivery fleet during the pilot. The confirmed message will identify the fulfilment arrangement. Customers should provide a usable landmark and be reachable during the agreed window.</p>
    <h2>Problems with an order</h2><p>Use the <Link href="/contact">contact form</Link>, choose “Order support,” and include the receipt ID. Do not include payment PINs, account credentials or identity documents.</p>
  </LegalPage>;
}
