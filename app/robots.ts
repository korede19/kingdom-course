import type { MetadataRoute } from "next";

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://kingdomcultureacademy.com").replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/login", "/terms", "/privacy"],
      disallow: ["/dashboard", "/course", "/certificate", "/shop", "/give", "/admin", "/api"],
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
