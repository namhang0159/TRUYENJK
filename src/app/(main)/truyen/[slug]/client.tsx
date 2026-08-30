"use client";

import { useStoryDetail, useStoryChapters } from "@/hooks/use-stories";
import { DetailHero } from "@/components/story-detail/detail-hero";
import { ChapterList } from "@/components/story-detail/chapter-list";
import { DetailComments } from "@/components/story-detail/detail-comments";
import { Skeleton } from "@/components/ui/skeleton";

export function StoryDetailClient({ slug }: { slug: string }) {
  const { data: story, isLoading: isStoryLoading } = useStoryDetail(slug);
  const { data: chapters, isLoading: isChaptersLoading } = useStoryChapters(slug);

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

        <div className="lg:col-span-1 space-y-8">
          {/* Sidebar có thể chứa Truyện Cùng Thể Loại, Top Donate... */}
          <div className="bg-card rounded-xl border p-6 shadow-sm sticky top-24">
            <h3 className="font-bold text-lg mb-4">Cùng Thể Loại</h3>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3 items-center group cursor-pointer">
                  <img 
                    src={`https://i.pravatar.cc/150?u=author${i}`} 
                    alt="Cover" 
                    className="w-12 h-16 object-cover rounded-md group-hover:scale-105 transition-transform" 
                  />
                  <div>
                    <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
                      Truyện Cùng Loại {i + 1}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">Đại Thần {i}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
