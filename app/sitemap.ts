import type { MetadataRoute } from "next";
import { kitchens } from "@/lib/kitchens";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/for-kitchens", "/how-it-works", "/order", "/group-orders", "/about", "/faq", "/contact", "/join-updates", "/marketing-preferences", "/privacy", "/terms", "/order-policy", "/marketing-notice"];
  return [...routes.map((route) => ({ url: `${siteConfig.url}${route}`, lastModified: new Date(), changeFrequency: route === "" ? "weekly" as const : "monthly" as const, priority: route === "" ? 1 : 0.7 })), ...kitchens.map((kitchen) => ({ url: `${siteConfig.url}/kitchens/${kitchen.slug}`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 }))];
}
