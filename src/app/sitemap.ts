import { MetadataRoute } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://duantruyen.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let stories = [];
  try {
    // Fetch top 1000 latest stories for sitemap
    const res = await fetch(`${API_URL}/reader/stories?limit=1000&sort_by=updated_at`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    if (data && data.data && data.data.stories) {
      stories = data.data.stories;
    }
  } catch (error) {
    console.error("Failed to fetch stories for sitemap:", error);
  }

  const storyUrls = stories.map((story: any) => ({
    url: `${SITE_URL}/truyen/${story.slug}`,
    lastModified: new Date(story.updated_at || new Date()),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    {
      url: `${SITE_URL}/explore`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/rankings`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/categories`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    ...storyUrls,
  ];
}
