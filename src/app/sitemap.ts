import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://iotpush.com", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: "https://iotpush.com/docs", lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: "https://iotpush.com/privacy", lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: "https://iotpush.com/terms", lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: "https://iotpush.com/login", lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: "https://iotpush.com/signup", lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
  ];
}
