"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getImageUrl } from "@/lib/utils";
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  MoreVertical, 
  Trash2,
  BookOpen,
  Eye,
  Clock,
  Settings,
  Sparkles,
  Zap
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

import { useAuthorStories } from '@/hooks/use-author';
import { Skeleton } from '@/components/ui/skeleton';

export default function StoriesManagementPage() {
  const { data: stories, isLoading } = useAuthorStories();
  const router = useRouter();

  const handleCardClick = (storyId: number) => {
    router.push(`/studio/stories/${storyId}/chapters`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            Kho Tác Phẩm
          </h1>
          <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
            Quản lý và xuất bản các "đứa con tinh thần" của bạn.
          </p>
        </div>

        <div>
          <Button render={<Link href="/studio/stories/new" />} nativeButton={false} variant="outline" className="rounded-none border-zinc-800 bg-transparent text-white hover:bg-white hover:text-black transition-colors font-mono uppercase text-xs">
            <Zap className="w-3 h-3 mr-2" /> Tạo Truyện Mới
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[400px] w-full rounded-none bg-zinc-900" />
            </div>
          ))}
        </div>
      ) : (!stories || stories.length === 0) ? (
        <div className="flex flex-col items-center justify-center p-12 bg-black border border-zinc-900">
          <BookOpen className="h-12 w-12 text-zinc-800 mb-4" strokeWidth={1} />
          <h3 className="text-xl font-light text-white mb-2">Chưa có tác phẩm nào</h3>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-8 text-center max-w-sm">
            Hành trình vạn dặm bắt đầu từ một chữ. Hãy khai bút sáng tác tác phẩm đầu tay của bạn!
          </p>
          <Button render={<Link href="/studio/stories/new" />} nativeButton={false} variant="outline" className="rounded-none border-zinc-800 bg-transparent text-white hover:bg-white hover:text-black transition-colors font-mono uppercase text-xs">
            Khai bút ngay
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {stories.map((story: any) => (
            <div 
              key={story.id} 
              onClick={() => handleCardClick(story.id)}
              className="group flex flex-col bg-black border border-zinc-900 hover:border-zinc-700 transition-colors cursor-pointer"
            >
              {/* Cover Image */}
              <div className="aspect-[3/4] w-full bg-zinc-950 relative overflow-hidden">
                {story.cover_image ? (
                  <img 
                    src={getImageUrl(story.cover_image)} 
                    alt={story.title}
                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 border-b border-zinc-900">
                    <BookOpen className="h-8 w-8 mb-2 text-zinc-800" strokeWidth={1} />
                    <span className="text-[10px] uppercase tracking-widest font-mono text-zinc-600">No Cover</span>
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span 
                    className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 border bg-black/80 backdrop-blur-md ${
                      story.status === 'COMPLETED' 
                        ? 'border-emerald-500/50 text-emerald-500' 
                        : 'border-zinc-800 text-zinc-300'
                    }`}
                  >
                    {story.status === 'COMPLETED' ? 'Hoàn thành' : 'Đang ra'}
                  </span>
                </div>

                {/* Dropdown Menu */}
                <div className="absolute top-4 right-4 z-20" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none border border-zinc-800 bg-black/80 backdrop-blur hover:bg-white hover:text-black text-white transition-all" />
                    }>
                        <MoreVertical className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-black rounded-none border-zinc-800 text-zinc-300 font-mono text-[10px] uppercase tracking-widest">
                      <DropdownMenuItem className="hover:bg-zinc-900 hover:text-white rounded-none cursor-pointer" render={<Link href={`/studio/stories/${story.id}/edit`} />}>
                          <Settings className="mr-2 h-3 w-3" />
                          Cài đặt truyện
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500 hover:bg-red-500/10 hover:text-red-400 rounded-none cursor-pointer">
                        <Trash2 className="mr-2 h-3 w-3" />
                        Xóa truyện
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Story Info */}
              <div className="p-4 flex flex-col flex-1 border-t border-zinc-900">
                <h3 className="font-medium text-base line-clamp-1 mb-1 text-zinc-100 group-hover:text-white transition-colors">
                  {story.title}
                </h3>
                <div className="flex items-center text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-4">
                  <Clock className="mr-1.5 h-3 w-3" />
                  {new Date(story.updated_at).toLocaleDateString('vi-VN')}
                </div>
                
                <div className="mt-auto grid grid-cols-2 gap-px bg-zinc-900 border border-zinc-900">
                  <div className="flex flex-col bg-black p-3">
                    <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest mb-1">Chương</span>
                    <span className="font-mono text-white flex items-center gap-1.5 text-sm">
                      <BookOpen className="h-3 w-3 text-zinc-400" />
                      {story.chapters?.length || 0}
                    </span>
                  </div>
                  <div className="flex flex-col bg-black p-3">
                    <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest mb-1">Lượt đọc</span>
                    <span className="font-mono text-white flex items-center gap-1.5 text-sm">
                      <Eye className="h-3 w-3 text-emerald-500" />
                      {(story.view_count || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
