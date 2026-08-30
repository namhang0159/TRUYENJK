"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert, CheckCircle, XCircle, FileText, Hash, Clock } from 'lucide-react';
import { useAdminChapters, useApproveChapter } from '@/hooks/use-admin';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function AdminChaptersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminChapters(page, 20);
  const { mutate: approveChapter, isPending: isApproving } = useApproveChapter();

  const handleApprove = (chapterId: number, status: 'PUBLISHED' | 'REJECTED') => {
    if (confirm(`Bạn có chắc muốn ${status === 'PUBLISHED' ? 'Duyệt' : 'Từ chối'} chương này?`)) {
      approveChapter({ id: chapterId, status });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.03 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-white mb-2">Duyệt Chương</h1>
        <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
          Phê duyệt nội dung chương mới trước khi xuất bản
        </p>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 p-6 min-h-[500px]">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full bg-zinc-900 rounded-none" />
            ))}
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {data?.chapters?.map((chapter: any) => (
                <motion.div 
                  variants={itemVariants}
                  layout
                  key={chapter.id}
                  className="group relative bg-black p-4 flex flex-col md:flex-row md:items-center justify-between transition-colors hover:bg-zinc-900 border border-transparent hover:border-zinc-800"
                >
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="flex items-center gap-2 text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-2">
                      <Hash className="w-3 h-3" />
                      ID: {chapter.id.toString().padStart(4, '0')}
                      <span className="text-zinc-700">|</span>
                      <Clock className="w-3 h-3" />
                      {format(new Date(chapter.created_at), 'dd/MM/yyyy HH:mm', { locale: vi })}
                    </div>
                    <h3 className="text-lg font-medium text-zinc-100 group-hover:text-white transition-colors">
                      {chapter.story?.title || "Không rõ"} - Chương {chapter.chapter_number}: {chapter.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleApprove(chapter.id, 'PUBLISHED')}
                      disabled={isApproving}
                      className="rounded-none border-green-500/30 text-green-500 hover:bg-green-500 hover:text-white transition-colors"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Duyệt
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleApprove(chapter.id, 'REJECTED')}
                      disabled={isApproving}
                      className="rounded-none border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Từ chối
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {!isLoading && (!data?.chapters || data.chapters.length === 0) && (
              <div className="col-span-full py-24 flex flex-col items-center justify-center bg-black">
                <ShieldAlert className="h-8 w-8 text-zinc-800 mb-4" strokeWidth={1} />
                <p className="text-zinc-500 font-mono uppercase tracking-widest text-sm">Không có chương nào đang chờ duyệt.</p>
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
