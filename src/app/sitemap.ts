import type { MetadataRoute } from "next";
import { banks } from "@/lib/banks";
import { useCases } from "@/lib/use-cases";
import { SITE_URL } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/convert`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/use-cases`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const bankPages: MetadataRoute.Sitemap = banks.map((bank) => ({
    url: `${baseUrl}/convert/${bank.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority:
      bank.segment === "national-retail"
        ? 0.85
        : bank.segment === "regional-bank"
          ? 0.8
          : 0.75,
  }));

  const useCasePages: MetadataRoute.Sitemap = useCases.map((useCaseItem) => ({
    url: `${baseUrl}/use-cases/${useCaseItem.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...bankPages, ...useCasePages];
}
