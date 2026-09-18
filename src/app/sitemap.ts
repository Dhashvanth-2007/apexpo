import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://apexpo.digital";

  const routes = [
    "",
    "/services",
    "/work",
    "/work/vanguard-athletic-club",
    "/work/spice-route-restaurant",
    "/work/kohaku-japanese-streetwear",
    "/work/vortex-x1-gaming",
    "/work/kai-soren-spatial-director",
    "/work/apex-summit-2027",
    "/work/oakridge-international-academy",
    "/pricing",
    "/about",
    "/contact",
    "/book-a-call",
    "/privacy",
    "/terms",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
