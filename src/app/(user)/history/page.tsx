"use client";

import { useLibrary } from "@/hooks/use-stories";
import { useAuthStore } from "@/store/auth-store";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { History, Search } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { StoryCard } from "@/components/story/story-card";

export default function HistoryPage() {
  const { data: library, isLoading } = useLibrary();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const histories = library?.readingHistories || [];

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
            <History className="w-8 h-8 text-indigo-600" />
            Lịch sử đọc truyện
          </h1>
          <p className="text-gray-500 mt-2">Các truyện bạn đang đọc dở sẽ được lưu ở đây</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="aspect-[2/3] w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))
          : histories.length === 0 ? (
            <div className="col-span-full py-20 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg">Bạn chưa đọc truyện nào.</p>
              <Link href="/explore">
                <Button className="mt-4">Khám phá ngay</Button>
              </Link>
            </div>
          ) : (
            histories.map((item: any) => {
              const story = {
                id: item.story.slug || item.story.id,
                title: item.story.title,
                coverImage: getImageUrl(item.story.cover_image),
                author: item.story.author?.pen_name || "Vô danh",
              };
              const badgeText = item.chapter ? `Chương ${item.chapter.chapter_number}` : undefined;
              return <StoryCard key={item.id} story={story} badgeTopLeft={badgeText} />;
            })
          )}
      </div>
    </div>
  );
}
