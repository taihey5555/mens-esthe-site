import type { MetadataRoute } from "next"

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    { url: `${BASE_URL}/`, lastModified },
    { url: `${BASE_URL}/therapists`, lastModified },
    { url: `${BASE_URL}/schedule`, lastModified },
    { url: `${BASE_URL}/pricing`, lastModified },
    { url: `${BASE_URL}/access`, lastModified },
    { url: `${BASE_URL}/recruit`, lastModified },
  ]
}
