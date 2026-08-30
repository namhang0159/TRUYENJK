"use client";

import { Variants } from "framer-motion";
import React, { useState } from 'react';
import Link from 'next/link';
import { useAdminAudioStories } from '@/hooks/use-admin';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Headphones, BookOpen, BarChart3, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function AdminAudioPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data, isLoading } = useAdminAudioStories(page, 20, debouncedSearch);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Headphones className="w-8 h-8 text-indigo-400" />
            Quản Lý Audio
          </h1>
          <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
            Theo dõi và quản lý tiến trình tạo Audio bằng AI (F5-TTS) cho các truyện
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-zinc-900 pb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
          <Input 
            placeholder="Tìm kiếm truyện theo tên..." 
            className="w-full bg-black border-zinc-800 text-white pl-9 rounded-none font-mono text-sm focus-visible:ring-1 focus-visible:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 min-h-[500px]">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-0">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 border-b border-zinc-900">
                <Skeleton className="h-16 w-full bg-zinc-900 rounded-none" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-0"
          >
            <AnimatePresence mode="popLayout">
              {data?.stories?.map((story: any) => {
                const totalChapters = story.total_chapters || 0;
                const audioChapters = story.audio_chapters || 0;
                const progress = totalChapters > 0 ? (audioChapters / totalChapters) * 100 : 0;
                
                return (
                  <motion.div 
                    variants={itemVariants}
                    layout
                    key={story.id}
                    className="group relative bg-black p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between transition-colors hover:bg-zinc-900/50 border-b border-zinc-900 last:border-b-0"
                  >
                    <div className="flex-1 flex gap-4">
                      {story.cover_image && (
                        <div className="w-12 h-16 shrink-0 bg-zinc-900 overflow-hidden">
                          <img src={story.cover_image} alt={story.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        </div>
                      )}
                      <div className="flex flex-col justify-center">
                        <Link href={`/admin/audios/${story.id}`}>
                          <h3 className="text-lg font-medium text-zinc-200 group-hover:text-white transition-colors cursor-pointer hover:underline">
                            {story.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-3 mt-1 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {totalChapters} Chương</span>
                          <span>|</span>
                          <span>Tác giả: <span className="text-zinc-400">{story.author?.pen_name || 'Khuyết danh'}</span></span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 flex flex-col md:items-end w-full md:w-64 gap-2">
                      <div className="flex justify-between items-center w-full">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                          <BarChart3 className="w-3 h-3" /> Tiến độ Audio
                        </span>
                        <span className="font-mono text-[10px] font-bold text-indigo-400">
                          {audioChapters} / {totalChapters} ({progress.toFixed(0)}%)
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full h-1.5 bg-zinc-900 rounded-none overflow-hidden relative">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="absolute top-0 left-0 h-full bg-indigo-500"
                        />
                      </div>
                      
                      <Link href={`/admin/audios/${story.id}`} className="mt-2 w-full">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full rounded-none border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors font-mono text-[10px] uppercase tracking-widest flex items-center justify-between"
                        >
                          Quản lý chi tiết <ChevronRight className="w-3 h-3" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {!isLoading && (!data?.stories || data.stories.length === 0) && (
              <div className="col-span-full py-24 flex flex-col items-center justify-center bg-black">
                <Headphones className="h-8 w-8 text-zinc-800 mb-4" strokeWidth={1} />
                <p className="text-zinc-500 font-mono uppercase tracking-widest text-sm">Không tìm thấy truyện nào.</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
      
      {/* Pagination */}
      <div className="flex justify-between items-center pt-8 border-t border-zinc-900 font-mono">
        <p className="text-xs text-zinc-600 uppercase tracking-widest hidden sm:block">
          Hiển thị trang <span className="text-white">{data?.page || 1}</span> trên {data?.total_pages || 1}
        </p>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            className="flex-1 sm:flex-none rounded-none border-zinc-800 text-zinc-400 hover:text-white hover:bg-white/5"
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            TRƯỚC
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 sm:flex-none rounded-none border-zinc-800 text-zinc-400 hover:text-white hover:bg-white/5"
            disabled={!data || page >= (data.total_pages || 1)}
            onClick={() => setPage(p => p + 1)}
          >
            SAU
          </Button>
        </div>
      </div>
    </div>
  );
}
