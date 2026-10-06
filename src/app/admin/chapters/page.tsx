"use client";

import { Variants } from "framer-motion";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert, CheckCircle, XCircle, FileText, Hash, Clock, Eye } from 'lucide-react';
import { useAdminChapters, useApproveChapter } from '@/hooks/use-admin';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export default function AdminChaptersPage() {
  const [page, setPage] = useState(1);
  const [previewChapter, setPreviewChapter] = useState<any>(null);
  const [previewFontFamily, setPreviewFontFamily] = useState<'sans' | 'serif'>('sans');
  const [previewFontSize, setPreviewFontSize] = useState<number>(16);
  const { data, isLoading } = useAdminChapters(page, 20);
  const { mutate: approveChapter, isPending: isApproving } = useApproveChapter();

  const handleApprove = (chapterId: number, status: 'PUBLISHED' | 'REJECTED') => {
    if (confirm(`Bạn có chắc muốn ${status === 'PUBLISHED' ? 'Duyệt' : 'Từ chối'} chương này?`)) {
      approveChapter({ id: chapterId, status });
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.03 }
    }
  };

  const itemVariants: Variants = {
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
                      <span className="text-zinc-700">|</span>
                      <span className={chapter.type === 'VIP' ? 'text-amber-500 font-semibold' : 'text-zinc-400'}>
                        {chapter.type === 'VIP' ? `VIP (${chapter.coin_price || 0} xu)` : 'Miễn phí'}
                      </span>
                      <span className="text-zinc-700">|</span>
                      <span>{chapter.word_count || 0} từ</span>
                    </div>
                    <h3 className="text-lg font-medium text-zinc-100 group-hover:text-white transition-colors">
                      {chapter.story?.title || "Không rõ"} - Chương {chapter.chapter_number}: {chapter.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewChapter(chapter)}
                      className="rounded-none border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Xem nội dung
                    </Button>
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

      {/* Chapter Preview Modal */}
      <Dialog open={!!previewChapter} onOpenChange={(open) => !open && setPreviewChapter(null)}>
        {previewChapter && (
          <DialogContent className="w-[95vw] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl max-h-[92vh] bg-zinc-950 border border-zinc-800 text-white rounded-none p-6 md:p-8 flex flex-col">
            <DialogHeader className="border-b border-zinc-800 pb-4 shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2 text-zinc-500 font-mono text-xs uppercase tracking-widest">
                  <span className="text-white font-medium">{previewChapter?.story?.title || "Không rõ"}</span>
                  <span>•</span>
                  <span>Chương {previewChapter?.chapter_number}</span>
                  <span>•</span>
                  <span className={previewChapter?.type === 'VIP' ? 'text-amber-500 font-semibold' : 'text-emerald-500'}>
                    {previewChapter?.type === 'VIP' ? `VIP (${previewChapter?.coin_price || 0} coin)` : 'Miễn phí'}
                  </span>
                  <span>•</span>
                  <span>{previewChapter?.word_count || 0} từ</span>
                </div>

                {/* Typography Controls */}
                <div className="flex items-center gap-2 font-mono text-xs">
                  <div className="flex items-center border border-zinc-800 bg-black">
                    <button
                      type="button"
                      onClick={() => setPreviewFontFamily('sans')}
                      className={`px-2.5 py-1 text-xs transition-colors ${previewFontFamily === 'sans' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-white'}`}
                      title="Phông không chân (Sans-serif)"
                    >
                      Sans
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewFontFamily('serif')}
                      className={`px-2.5 py-1 text-xs transition-colors ${previewFontFamily === 'serif' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-white'}`}
                      title="Phông có chân (Serif)"
                    >
                      Serif
                    </button>
                  </div>
                  <div className="flex items-center border border-zinc-800 bg-black">
                    <button
                      type="button"
                      onClick={() => setPreviewFontSize(s => Math.max(13, s - 1))}
                      className="px-2 py-1 text-xs text-zinc-400 hover:text-white transition-colors"
                      title="Giảm cỡ chữ"
                    >
                      A-
                    </button>
                    <span className="px-1.5 text-[11px] text-zinc-400 border-x border-zinc-800">{previewFontSize}px</span>
                    <button
                      type="button"
                      onClick={() => setPreviewFontSize(s => Math.min(24, s + 1))}
                      className="px-2 py-1 text-xs text-zinc-400 hover:text-white transition-colors"
                      title="Tăng cỡ chữ"
                    >
                      A+
                    </button>
                  </div>
                </div>
              </div>

              <DialogTitle className="text-2xl font-light text-white mt-2">
                {previewChapter?.title}
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 max-h-[62vh] overflow-y-auto pr-3 py-6 my-2 border-y border-zinc-900 bg-zinc-950/40 rounded-none">
              <div
                className={`max-w-4xl mx-auto px-4 ${previewFontFamily === 'serif' ? 'font-serif' : 'font-sans'} text-zinc-200 leading-relaxed text-left selection:bg-zinc-800`}
                style={{ fontSize: `${previewFontSize}px`, lineHeight: 1.85 }}
              >
                {previewChapter?.text_content ? (
                  previewChapter.text_content.includes('<p>') ? (
                    <div
                      className="space-y-4 [&>p]:mb-4 [&>p]:leading-relaxed [&>strong]:font-semibold [&>em]:italic [&_*]:!text-zinc-200 text-zinc-200"
                      dangerouslySetInnerHTML={{ __html: previewChapter.text_content.normalize('NFC') }}
                    />
                  ) : (
                    <div className="whitespace-pre-wrap space-y-4 leading-relaxed text-zinc-200">
                      {previewChapter.text_content.normalize('NFC')}
                    </div>
                  )
                ) : (
                  <div className="text-zinc-500 italic py-12 text-center font-sans text-sm">Chưa có nội dung chữ</div>
                )}
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-900 bg-black">
              <div className="text-xs font-mono text-zinc-500">
                Gửi lúc: {previewChapter?.created_at && format(new Date(previewChapter.created_at), 'dd/MM/yyyy HH:mm', { locale: vi })}
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewChapter(null)}
                  className="rounded-none border-zinc-800 text-zinc-400 hover:text-white"
                >
                  Đóng
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleApprove(previewChapter.id, 'REJECTED');
                    setPreviewChapter(null);
                  }}
                  disabled={isApproving}
                  className="rounded-none border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Từ chối
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleApprove(previewChapter.id, 'PUBLISHED');
                    setPreviewChapter(null);
                  }}
                  disabled={isApproving}
                  className="rounded-none border-green-500/50 text-green-400 hover:bg-green-500 hover:text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Duyệt xuất bản
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

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
