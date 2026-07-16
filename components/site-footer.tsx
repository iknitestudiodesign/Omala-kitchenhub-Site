import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { BrandMark } from "./brand-mark";
import { TrackedAnchor } from "./tracked-anchor";
import { whatsappHref } from "@/lib/site";

export function SiteFooter() {
  const whatsapp = whatsappHref("Hello Omala, I would like to learn more.");

  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <BrandMark inverse />
          <p>
            The customer communication and order desk built for small and growing
            kitchens.
          </p>
          <span className="footer-location">
            <MapPin size={15} aria-hidden="true" /> Buea, Cameroon
          </span>
        </div>
        <div>
          <h2>Explore</h2>
          <Link href="/how-it-works">How it works</Link>
          <Link href="/order">Order food</Link>
          <Link href="/group-orders">Group orders</Link>
          <Link href="/about">About Omala</Link>
        </div>
        <div>
          <h2>For kitchens</h2>
          <Link href="/for-kitchens">Why Omala</Link>
          <Link href="/for-kitchens#expect">What to expect</Link>
          <Link href="/for-kitchens#apply">Apply for the pilot</Link>
          <Link href="/faq">Questions</Link>
        </div>
        <div>
          <h2>Stay connected</h2>
          <Link href="/join-updates">Get menus & updates</Link>
          {whatsapp ? (
            <TrackedAnchor href={whatsapp} target="_blank" rel="noreferrer" eventName="whatsapp_click" eventContext="footer">
              WhatsApp Omala <ArrowUpRight size={14} aria-hidden="true" />
            </TrackedAnchor>
          ) : null}
          <Link href="/contact">Contact us</Link>
          <Link href="/marketing-preferences">Marketing preferences</Link>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} Omala Kitchen Hub</span>
        <nav aria-label="Legal">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/order-policy">Order policy</Link>
          <Link href="/marketing-notice">Marketing notice</Link>
        </nav>
      </div>
    </footer>
  );
}
