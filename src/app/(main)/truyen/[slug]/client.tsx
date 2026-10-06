"use client";

import { useStoryDetail, useStoryChapters, useExploreStories } from "@/hooks/use-stories";
import { DetailHero } from "@/components/story-detail/detail-hero";
import { ChapterList } from "@/components/story-detail/chapter-list";
import { DetailComments } from "@/components/story-detail/detail-comments";
import { StoryTopDonators } from "@/components/story-detail/story-top-donators";
import { AffiliateBanner } from "@/components/ads/affiliate-banner";
import { Skeleton } from "@/components/ui/skeleton";
import { getImageUrl } from "@/lib/utils";
import Link from "next/link";

export function StoryDetailClient({ slug }: { slug: string }) {
  const { data: story, isLoading: isStoryLoading } = useStoryDetail(slug);
  const { data: chapters, isLoading: isChaptersLoading } = useStoryChapters(slug);

  const firstCategory = story?.categories?.[0];
  const { data: exploreData, isLoading: isRelatedLoading } = useExploreStories({
    category_slug: firstCategory?.slug,
    limit: 8,
  });

  const relatedStories = (exploreData?.stories || [])
    .filter((s: any) => s.id !== slug && s.id !== story?.id)
    .slice(0, 5);

  if (isStoryLoading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
        <Skeleton className="w-full h-80 rounded-2xl" />
        <Skeleton className="w-full h-40 rounded-xl" />
        <Skeleton className="w-full h-96 rounded-xl" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Không tìm thấy truyện</h1>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* 1. Hero Header */}
      <DetailHero story={story} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* 2. Giới thiệu truyện */}
          <div className="bg-card rounded-xl border p-6 shadow-sm">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 mb-4">
              <span className="w-1.5 h-6 bg-primary rounded-full inline-block"></span>
              Giới Thiệu
            </h2>
            <div className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {story.summary}
            </div>
          </div>

          {/* 3. Danh sách chương */}
          {isChaptersLoading ? (
            <Skeleton className="w-full h-96 rounded-xl" />
          ) : (
            <ChapterList chapters={chapters || []} storyId={slug} />
          )}

          {/* 4. Bình luận & Đánh giá */}
          <DetailComments slug={slug} />
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Top Ủng Hộ / Bảng Vàng Donate */}
          <StoryTopDonators storyId={story.id} />

          {/* Quảng cáo / Tiếp thị Shopee, TikTok Shop liên quan */}
          <AffiliateBanner placement="STORY_SIDEBAR" variant="card" />

          {/* Sidebar chứa Truyện Cùng Thể Loại thật */}
          <div className="bg-card rounded-xl border p-6 shadow-sm sticky top-24">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-primary rounded-full inline-block"></span>
              Cùng Thể Loại {firstCategory ? `(${firstCategory.name})` : ""}
            </h3>
            {isRelatedLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <Skeleton className="w-12 h-16 rounded-md flex-shrink-0" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : relatedStories.length > 0 ? (
              <div className="space-y-4">
                {relatedStories.map((item: any) => (
                  <Link 
                    key={item.id} 
                    href={`/truyen/${item.slug}`} 
                    className="flex gap-3 items-center group cursor-pointer transition-colors"
                  >
                    <img 
                      src={getImageUrl(item.cover_image || item.coverImage)} 
                      alt={item.title} 
                      className="w-12 h-16 object-cover rounded-md group-hover:scale-105 transition-transform bg-muted flex-shrink-0 border" 
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {item.author?.pen_name || item.author || "Đang cập nhật"}
                      </p>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        {item.view_count || item.views || 0} lượt đọc
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground py-4 text-center">
                Chưa có thêm truyện nào cùng thể loại
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
