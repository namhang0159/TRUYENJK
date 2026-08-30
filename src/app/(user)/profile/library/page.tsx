"use client";

import { useLibrary } from "@/hooks/use-stories";
import { StoryCard } from "@/components/story/story-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Headphones, Eye, BookOpen, Trash2, Settings, Plus, Search, Filter, Bookmark, Clock } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export default function LibraryPage() {
  const { data: library, isLoading } = useLibrary();

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-8">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl mix-blend-overlay"></div>
        <div className="relative z-10">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">Tủ Sách Của Tôi</h1>
          <p className="text-slate-300 text-lg max-w-2xl">Quản lý những câu chuyện bạn đang theo dõi và lưu trữ các tác phẩm yêu thích của bạn.</p>
        </div>
      </div>

      <Tabs defaultValue="reading" className="w-full">
        <div className="flex justify-center sm:justify-start">
          <TabsList className="bg-slate-100/50 backdrop-blur-sm p-1 rounded-2xl">
            <TabsTrigger value="reading" className="rounded-xl px-6 py-2.5 text-base font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-700 transition-all">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Đang Đọc
              </div>
            </TabsTrigger>
            <TabsTrigger value="bookmarks" className="rounded-xl px-6 py-2.5 text-base font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-700 transition-all">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5" /> Đã Lưu
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="reading" className="mt-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-40 rounded-2xl" />
              ))}
            </div>
          ) : library?.readingHistories?.length === 0 ? (
            <div className="py-20 text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">Chưa có truyện nào</h3>
              <p className="text-slate-500">Bạn chưa bắt đầu đọc cuốn truyện nào cả. Hãy khám phá ngay!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {library?.readingHistories?.map((history: any) => (
                <Link 
                  key={history.id} 
                  href={`/truyen/${history.story.slug}/${history.chapter.chapter_number}`}
                  className="group flex gap-5 p-5 bg-white border border-slate-100 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ring-1 ring-slate-900/5"
                >
                  <div className="relative flex-shrink-0">
                    <img 
                      src={getImageUrl(history.story.cover_image)} 
                      alt={history.story.title} 
                      className="w-24 h-32 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow" 
                    />
                    {history.progress_seconds > 0 && (
                      <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-1.5 rounded-full shadow-lg">
                        <Headphones className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    <h3 className="font-bold text-lg leading-tight line-clamp-2 text-slate-900 group-hover:text-purple-600 transition-colors">
                      {history.story.title}
                    </h3>
                    <p className="text-sm font-medium text-slate-500 mt-2 line-clamp-1 bg-slate-50 inline-block px-2 py-1 rounded-md w-fit">
                      {history.chapter.title || `Chương ${history.chapter.chapter_number}`}
                    </p>
                    <div className="flex items-center gap-2 mt-4 text-xs font-medium text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatDistanceToNow(new Date(history.updated_at), { addSuffix: true, locale: vi })}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="bookmarks" className="mt-8">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[2/3] w-full rounded-2xl" />
              ))}
            </div>
          ) : library?.bookmarks?.length === 0 ? (
             <div className="py-20 text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bookmark className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">Tủ sách trống</h3>
              <p className="text-slate-500">Bạn chưa lưu cuốn truyện nào. Đánh dấu để đọc sau nhé!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {library?.bookmarks?.map((bookmark: any) => {
                const mappedStory = {
                  id: bookmark.story.slug,
                  title: bookmark.story.title,
                  coverImage: getImageUrl(bookmark.story.cover_image),
                  author: bookmark.story.author?.pen_name || "Vô danh",
                };
                return <StoryCard key={bookmark.id} story={mappedStory as any} />;
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
