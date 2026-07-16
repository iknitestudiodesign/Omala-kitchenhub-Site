import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "./brand-mark";
import { siteCopy } from "@/content";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner shell">
        <BrandMark />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {siteCopy.navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="text-link header-apply" href="/for-kitchens#apply">
            For kitchens
          </Link>
          <Link className="button button--small button--ink" href="/order">
            {siteCopy.actions.order} <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <details className="mobile-menu">
          <summary aria-label="Open navigation">
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </summary>
          <nav aria-label="Mobile navigation">
            {siteCopy.navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link href="/faq">FAQs</Link>
            <Link href="/contact">Contact</Link>
            <Link className="button button--accent" href="/order">
              {siteCopy.actions.order}
            </Link>
            <Link className="button button--outline" href="/for-kitchens#apply">
              {siteCopy.actions.apply}
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
