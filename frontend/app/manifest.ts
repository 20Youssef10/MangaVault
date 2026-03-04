import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MangaVault",
    short_name: "MangaVault",
    start_url: "/",
    display: "standalone",
    background_color: "#0f0f0f",
    theme_color: "#d9480f",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" }
    ]
  };
}
