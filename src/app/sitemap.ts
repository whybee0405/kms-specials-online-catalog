import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://specials.koreanmotorspares.co.za',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]
}