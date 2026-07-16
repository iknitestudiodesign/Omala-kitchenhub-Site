import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return <section className="confirmation-page"><div className="confirmation-card"><span className="confirmation-icon"><SearchX size={30} /></span><span className="eyebrow">Page not found</span><h1>This path is not on today’s menu.</h1><p>The page may have moved, or the kitchen profile may still be waiting for verification.</p><div className="confirmation-actions"><Link className="button button--ink" href="/"><ArrowLeft size={16} /> Back home</Link><Link className="button button--outline" href="/order">Start an order</Link></div></div></section>;
}
