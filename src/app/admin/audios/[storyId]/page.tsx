"use client";

import { Variants } from "framer-motion";
import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAdminStoryAudioChapters } from '@/hooks/use-admin';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Headphones, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '@/lib/axios';

export default function AdminAudioStoryChaptersPage() {
  const params = useParams();
  const storyId = params.storyId as string;
  const router = useRouter();
  
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = useAdminStoryAudioChapters(storyId, page, 50);

  // States cho tiến trình tạo audio
  const [generatingId, setGeneratingId] = useState<number | null>(null);

  const handleGenerateAudio = async (chapterId: number) => {
    try {
      setGeneratingId(chapterId);
      const res = await axiosInstance.post(`/audio/chapters/${chapterId}/audio`, { voice_id: 1 });
      
      // Sẽ nhận được 202 Accepted (đang chạy ngầm)
      console.log("Response:", res.data);
      
      // Chờ 2s rồi refetch để cập nhật trạng thái PROCESSING
      setTimeout(() => {
        refetch();
        setGeneratingId(null);
      }, 2000);
      
    } catch (error: any) {
      console.error(error);
      alert("Lỗi tạo Audio: " + (error.response?.data?.message || error.message));
      setGeneratingId(null);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-zinc-900 pb-4">
        <Link href="/admin/audios">
          <Button variant="ghost" size="icon" className="rounded-none hover:bg-zinc-900 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white">Quản lý Audio Chương</h1>
          <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
            Tạo và theo dõi quá trình tạo audio F5-TTS
          </p>
        </div>
      </div>

      <div className="bg-black border border-zinc-900 min-h-[500px]">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-zinc-900 bg-zinc-950 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          <div className="col-span-1 text-center">Chương</div>
          <div className="col-span-5">Tên chương</div>
          <div className="col-span-3 text-center">Trạng thái Audio</div>
          <div className="col-span-3 text-right">Thao tác</div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-0">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="p-4 border-b border-zinc-900">
                <Skeleton className="h-10 w-full bg-zinc-900 rounded-none" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col"
          >
            <AnimatePresence mode="popLayout">
              {data?.chapters?.map((chapter: any) => (
                <motion.div 
                  variants={itemVariants}
                  layout
                  key={chapter.id}
                  className="grid grid-cols-12 gap-4 p-4 border-b border-zinc-900 last:border-b-0 hover:bg-zinc-900/50 transition-colors items-center"
                >
                  <div className="col-span-1 text-center font-mono text-zinc-400">
                    {chapter.chapter_number}
                  </div>
                  <div className="col-span-5 font-medium text-zinc-200 truncate">
                    {chapter.title}
                  </div>
                  <div className="col-span-3 flex justify-center">
                    {chapter.audio_status === 'COMPLETED' ? (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest px-2 py-1 border border-emerald-500/50 bg-emerald-500/10 text-emerald-500">
                        <CheckCircle className="w-3 h-3" /> Hoàn thành
                      </span>
                    ) : chapter.audio_status === 'PROCESSING' ? (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest px-2 py-1 border border-amber-500/50 bg-amber-500/10 text-amber-500">
                        <Loader2 className="w-3 h-3 animate-spin" /> Đang tạo...
                      </span>
                    ) : chapter.audio_status === 'FAILED' ? (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest px-2 py-1 border border-red-500/50 bg-red-500/10 text-red-500">
                        <XCircle className="w-3 h-3" /> Lỗi
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest px-2 py-1 border border-zinc-700 text-zinc-500">
                        <Clock className="w-3 h-3" /> Chưa tạo
                      </span>
                    )}
                  </div>
                  <div className="col-span-3 flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleGenerateAudio(chapter.id)}
                      disabled={generatingId === chapter.id || chapter.audio_status === 'PROCESSING'}
                      className={`rounded-none border-zinc-800 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                        chapter.audio_status === 'COMPLETED' 
                          ? 'text-zinc-500 hover:text-zinc-300' 
                          : 'text-indigo-400 hover:text-white hover:bg-indigo-500/20 hover:border-indigo-500/50'
                      }`}
                    >
                      {generatingId === chapter.id ? (
                        <><Loader2 className="w-3 h-3 mr-2 animate-spin" /> Chờ...</>
                      ) : chapter.audio_status === 'COMPLETED' ? (
                        <><Headphones className="w-3 h-3 mr-2" /> Tạo Lại</>
                      ) : (
                        <><Headphones className="w-3 h-3 mr-2" /> Tạo Audio</>
                      )}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {!isLoading && (!data?.chapters || data.chapters.length === 0) && (
              <div className="py-24 flex flex-col items-center justify-center bg-black">
                <p className="text-zinc-500 font-mono uppercase tracking-widest text-sm">Truyện này chưa có chương nào được xuất bản.</p>
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
