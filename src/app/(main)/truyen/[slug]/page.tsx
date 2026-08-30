import { Metadata } from 'next';
import { StoryDetailClient } from './client';
import axios from 'axios';

// Base API URL could be from environment variable. For now using localhost or default.
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  try {
    const res = await fetch(`${API_URL}/reader/stories/${slug}`, { next: { revalidate: 60 } });
    const data = await res.json();
    
    if (!data || !data.data) {
      return { title: 'Không tìm thấy truyện' };
    }
    
    const story = data.data;
    
    return {
      title: story.title,
      description: story.summary?.substring(0, 160) || `Đọc truyện ${story.title} tại Hệ Thống Truyện Premium.`,
      openGraph: {
        title: story.title,
        description: story.summary?.substring(0, 160),
        images: [story.cover_image || '/default-cover.jpg'],
        type: 'book',
        authors: [story.author?.pen_name || 'Tác giả'],
      },
    };
  } catch (error) {
    return { title: 'Đọc truyện' };
  }
}

export default async function StoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // JSON-LD Schema
  let jsonLd = null;
  try {
    const res = await fetch(`${API_URL}/reader/stories/${slug}`, { next: { revalidate: 60 } });
    const data = await res.json();
    
    if (data && data.data) {
      const story = data.data;
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "Book",
        "name": story.title,
        "author": {
          "@type": "Person",
          "name": story.author?.pen_name || 'Unknown'
        },
        "description": story.summary,
        "image": story.cover_image,
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": story.rating || 0,
          "reviewCount": story.review_count || 0
        }
      };
    }
  } catch (error) {}

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <StoryDetailClient slug={slug} />
    </>
  );
}
