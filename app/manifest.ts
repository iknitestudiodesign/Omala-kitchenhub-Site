import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ekoraa Kitchen Hub",
    short_name: "Ekoraa",
    description: "Customer communication and order coordination for growing kitchens in Buea.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffefb",
    theme_color: "#10150d",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
