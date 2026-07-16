import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  HandCoins,
  MapPin,
  MessageCircleMore,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { PageHero, SectionIntro } from "@/components/ui";
import { ResponsiveImage } from "@/components/responsive-image";
import { SubmissionForm } from "@/components/submission-form";
import { siteCopy } from "@/content";
import { kitchens } from "@/lib/kitchens";

export const metadata: Metadata = siteCopy.pages.order.metadata;

export default async function OrderPage({ searchParams }: { searchParams: Promise<{ kitchen?: string }> }) {
  const query = await searchParams;
  const selectedKitchen = kitchens.some((kitchen) => kitchen.slug === query.kitchen)
    ? query.kitchen
    : "Let Omala match my request";
  return (
    <>
      <PageHero
        {...siteCopy.pages.order.hero}
        actions={
          <>
            <Link className="button button--accent" href="#order-form">Start your request <ArrowRight size={17} /></Link>
            <Link className="button button--ghost-light" href="/group-orders">Ordering for a group?</Link>
          </>
        }
        aside={
          <ul className="aside-list">
            <li><MessageCircleMore size={18} /> Choose “send today’s menu” if you are still deciding.</li>
            <li><HandCoins size={18} /> No payment information is collected on this website.</li>
            <li><PackageCheck size={18} /> Your order is final only after Omala confirms the total and fulfilment.</li>
          </ul>
        }
      />

      <section className="content-section content-section--cream">
        <div className="shell">
          <SectionIntro
            eyebrow="Verified details first"
            title="The order starts here, but confirmation still matters."
            description="Daily menus, prices and delivery conditions can change. We collect a clear request, then confirm the real offer with the kitchen before you commit."
            align="center"
          />
          <div className="content-grid-3" style={{ marginTop: 46 }}>
            <article className="content-card"><span className="icon-tile"><ShoppingBag size={22} /></span><h3>1. Share the request</h3><p>Tell us the meal, quantity, preferred time and where it needs to go.</p></article>
            <article className="content-card"><span className="icon-tile icon-tile--warm"><Clock3 size={22} /></span><h3>2. We check live details</h3><p>Omala confirms availability, final price and the delivery or pickup plan.</p></article>
            <article className="content-card"><span className="icon-tile"><CheckCircle2 size={22} /></span><h3>3. You confirm</h3><p>Only then do you receive payment instructions and a confirmed fulfilment plan.</p></article>
          </div>
        </div>
      </section>

      <section className="content-section content-section--tint">
        <div className="shell group-feature__grid order-experience">
          <ResponsiveImage
            avif="/images/brand/customer-phone-brand-studio-v1.avif"
            fallback="/images/brand/customer-phone-brand-studio-v1.jpg"
            alt="Smiling customer holding a smartphone and a slice of pizza"
            width={1800}
            height={1198}
          />
          <div>
            <SectionIntro
              eyebrow="Phone-first by design"
              title="Start in seconds. Confirm with a person."
              description="The phone gets your request moving; Omala checks the changing details before asking you to commit or pay."
            />
            <ul className="plain-checks">
              <li><CheckCircle2 size={18} /> Ask for the current menu when you are still deciding</li>
              <li><CheckCircle2 size={18} /> Receive the real total and fulfilment plan before payment</li>
              <li><ShieldCheck size={18} /> Keep Mobile Money credentials off the website</li>
            </ul>
            <p className="media-caption">
              Illustrative customer image. Meals shown are not a statement of current kitchen availability.
            </p>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="shell">
          {kitchens.length ? null : (
            <div className="empty-state">
              <div>
                <ShieldCheck size={35} />
                <h3>Pilot kitchen profiles are being verified.</h3>
                <p>
                  We do not publish a kitchen until its name, service details and
                  availability are confirmed. You can still submit a request and let Omala match it.
                </p>
                <a className="button button--outline" href="#order-form">Let Omala help</a>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="form-section" id="order-form">
        <div className="shell form-layout">
          <aside className="form-aside">
            <span className="eyebrow">Start an order request</span>
            <h2>A few clear details save a long back-and-forth.</h2>
            <p>
              We will use your preferred service channel to confirm the current
              menu, total, payment instructions and fulfilment.
            </p>
            <div className="form-assurance">
              <span><ShieldCheck size={16} /> This is a request, not a confirmed or paid order.</span>
              <span><MapPin size={16} /> A neighborhood and landmark help plan delivery accurately.</span>
              <span><HandCoins size={16} /> Never enter Mobile Money credentials or account numbers here.</span>
            </div>
          </aside>

          <SubmissionForm
            endpoint="/api/forms/order-request"
            formName="order-request"
            successPath="/confirmation/order"
            submitLabel="Send order request"
            eventContext="order_request"
          >
            <fieldset className="form-group">
              <legend>What would you like?</legend>
              <div className="choice-grid" style={{ marginBottom: 18 }}>
                <label className="choice-card"><input type="radio" name="requestType" value="Send today's menu" required />Send me today’s menu</label>
                <label className="choice-card"><input type="radio" name="requestType" value="Start an order" required />I know what I want to order</label>
              </div>
              <div className="field-grid">
                <label className="field">
                  <span>Kitchen preference <em>*</em></span>
                  <select name="kitchenPreference" defaultValue={selectedKitchen} required>
                    <option>Let Omala match my request</option>
                    {kitchens.map((kitchen) => <option key={kitchen.slug} value={kitchen.slug}>{kitchen.name}</option>)}
                  </select>
                </label>
                <label className="field">
                  <span>Approximate quantity <em>*</em></span>
                  <input name="quantity" type="number" min="1" defaultValue="1" required />
                </label>
                <label className="field--full">
                  <span>Meal or menu request <em>*</em></span>
                  <textarea name="requestedItems" placeholder="Write ‘today’s menu’ if you want to see what is available, or list the meal and quantity you have in mind." required />
                </label>
              </div>
            </fieldset>

            <fieldset className="form-group">
              <legend>Your fulfilment details</legend>
              <div className="choice-grid" style={{ marginBottom: 18 }}>
                <label className="choice-card"><input type="radio" name="fulfillmentMode" value="Delivery" required />Delivery</label>
                <label className="choice-card"><input type="radio" name="fulfillmentMode" value="Pickup" required />Pickup</label>
              </div>
              <div className="field-grid">
                <label className="field">
                  <span>Preferred date and time <em>*</em></span>
                  <input name="requestedDateTime" type="datetime-local" required />
                </label>
                <label className="field">
                  <span>Payment preference</span>
                  <select name="paymentPreference" defaultValue="Confirm options with me">
                    <option>Confirm options with me</option><option>Mobile Money after confirmation</option><option>Cash if available</option>
                  </select>
                </label>
                <label className="field">
                  <span>City <em>*</em></span>
                  <input name="city" defaultValue="Buea" required />
                </label>
                <label className="field">
                  <span>Neighborhood <em>*</em></span>
                  <input name="neighborhood" placeholder="e.g. Molyko" required />
                </label>
                <label className="field--full">
                  <span>Nearest landmark <em>*</em></span>
                  <input name="landmark" placeholder="A clear landmark helps the fulfilment check" required />
                </label>
                <label className="field--full">
                  <span>Preparation notes</span>
                  <textarea name="preparationNotes" placeholder="Keep this to practical meal instructions. Do not include medical records, account details or other sensitive information." />
                </label>
              </div>
            </fieldset>

            <fieldset className="form-group">
              <legend>How should we reach you?</legend>
              <div className="field-grid">
                <label className="field">
                  <span>Your name <em>*</em></span>
                  <input name="customerName" autoComplete="name" required />
                </label>
                <label className="field">
                  <span>WhatsApp or phone <em>*</em></span>
                  <input name="phone" inputMode="tel" autoComplete="tel" placeholder="e.g. 6xx xxx xxx" required />
                </label>
                <label className="field--full">
                  <span>Email</span>
                  <input name="email" type="email" autoComplete="email" />
                </label>
              </div>
            </fieldset>

            <div className="consent-block">
              <h3>Order communication and optional updates</h3>
              <p>Order messages are needed to complete this request. Future promotions are optional.</p>
              <label className="check-row check-row--required"><input type="checkbox" name="orderAcknowledgement" value="true" required /><span>I understand this becomes an order only after Omala confirms availability, total price and fulfilment. *</span></label>
              <label className="check-row check-row--required"><input type="checkbox" name="serviceContactConsent" value="true" required /><span>Omala may contact me about this order request by phone or messaging. *</span></label>
              <label className="check-row"><input type="checkbox" name="consentMarketingWhatsApp" value="true" /><span>Also send me optional menus and offers by WhatsApp.</span></label>
              <label className="check-row"><input type="checkbox" name="consentMarketingSms" value="true" /><span>Also send me optional menus and offers by SMS.</span></label>
              <label className="check-row"><input type="checkbox" name="consentMarketingEmail" value="true" /><span>Also send me optional menus and offers by email.</span></label>
              <p>Read our <Link href="/privacy">privacy notice</Link> and <Link href="/order-policy">order policy</Link>.</p>
            </div>
          </SubmissionForm>
        </div>
      </section>
    </>
  );
}
