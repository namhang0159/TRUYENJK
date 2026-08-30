"use client";

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, ArrowLeft, GripVertical } from 'lucide-react';
import { useAuthorStory } from '@/hooks/use-author';
import { Skeleton } from '@/components/ui/skeleton';

export default function StoryChaptersPage() {
  const params = useParams();
  const storyId = params.storyId as string;
  const { data: story, isLoading } = useAuthorStory(storyId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-zinc-900 pb-4">
        <Link href="/studio/stories">
          <Button variant="ghost" size="icon" className="rounded-none hover:bg-zinc-900 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white">Quản lý Chương</h1>
          {story && <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">{story.title}</p>}
        </div>
        <div className="ml-auto">
          <Link href={`/studio/stories/${storyId}/chapters/new`}>
            <Button variant="outline" className="rounded-none border-zinc-800 bg-transparent hover:bg-white hover:text-black font-mono text-xs uppercase tracking-widest transition-colors">
              <Plus className="mr-2 h-4 w-4" />
              Thêm Chương Mới
            </Button>
          </Link>
        </div>
      </div>

      <div className="border border-zinc-900 bg-black">
        <Table>
          <TableHeader className="border-b border-zinc-900 bg-zinc-950">
            <TableRow className="border-zinc-900 hover:bg-transparent">
              <TableHead className="w-12 text-center font-mono text-[10px] uppercase tracking-widest text-zinc-500">STT</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Tên chương</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Loại</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Giá (Coin)</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Trạng thái</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Ngày cập nhật</TableHead>
              <TableHead className="text-right font-mono text-[10px] uppercase tracking-widest text-zinc-500">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <Skeleton className="h-10 w-full" />
                </TableCell>
              </TableRow>
            ) : story?.chapters?.map((chapter: any, index: number) => (
              <TableRow key={chapter.id} className="border-zinc-900 hover:bg-zinc-900/50 transition-colors group">
                <TableCell className="text-center font-mono text-zinc-400">
                  {chapter.chapter_number}
                </TableCell>
                <TableCell className="font-medium max-w-xs truncate text-zinc-300 group-hover:text-white transition-colors">
                  {chapter.title}
                </TableCell>
                <TableCell>
                  {chapter.type === 'VIP' ? (
                    <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 border border-amber-500/50 bg-amber-500/10 text-amber-500">VIP</span>
                  ) : (
                    <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 border border-zinc-800 text-zinc-400">FREE</span>
                  )}
                </TableCell>
                <TableCell className="font-mono text-amber-500">
                  {chapter.type === 'VIP' ? chapter.coin_price : '-'}
                </TableCell>
                <TableCell>
                  {chapter.status === 'PUBLISHED' ? (
                    <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 border border-emerald-500/50 bg-emerald-500/10 text-emerald-500">Đã xuất bản</span>
                  ) : chapter.status === 'PENDING' ? (
                    <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 border border-amber-500/50 bg-amber-500/10 text-amber-500">Chờ duyệt</span>
                  ) : (
                    <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 border border-zinc-800 text-zinc-500">Bản nháp</span>
                  )}
                </TableCell>
                <TableCell className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">{new Date(chapter.created_at).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/studio/stories/${storyId}/chapters/${chapter.id}/edit`}>
                    <Button variant="ghost" size="sm" className="rounded-none hover:bg-white hover:text-black font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                      <Edit className="h-3 w-3 mr-2" />
                      Sửa
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && (!story?.chapters || story.chapters.length === 0) && (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest">
                  Truyện này chưa có chương nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
