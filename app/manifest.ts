import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kingdom Culture Academy",
    short_name: "KCA",
    description: "A 10-Week Journey into the Culture of Heaven on Earth.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#faf7ef",
    theme_color: "#123b36",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
    ],
  };
}
