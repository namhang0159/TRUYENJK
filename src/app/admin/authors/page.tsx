"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert, CheckCircle, XCircle, Users, Hash, Clock, Link as LinkIcon, Phone } from 'lucide-react';
import { useAdminAuthors, useApproveAuthor } from '@/hooks/use-admin';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function AdminAuthorsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  
  const { data, isLoading } = useAdminAuthors(
    page, 
    20, 
    statusFilter === "all" ? "" : statusFilter
  );
  
  const { mutate: approveAuthor, isPending: isApproving } = useApproveAuthor();

  const handleApprove = (authorId: number, status: 'ACTIVE' | 'REJECTED') => {
    if (confirm(`Bạn có chắc muốn ${status === 'ACTIVE' ? 'Duyệt' : 'Từ chối'} yêu cầu đăng ký tác giả này?`)) {
      approveAuthor({ id: authorId, status });
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2">Duyệt Tác Giả</h1>
          <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
            Quản lý đăng ký nâng cấp tài khoản thành Tác giả
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {['all', 'PENDING', 'ACTIVE', 'REJECTED'].map((status) => (
            <Button
              key={status}
              variant="outline"
              size="sm"
              onClick={() => setStatusFilter(status)}
              className={`rounded-none border-zinc-800 font-mono text-xs uppercase tracking-wider ${
                statusFilter === status 
                  ? 'bg-white text-black hover:bg-zinc-200' 
                  : 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {status === 'all' ? 'Tất cả' : status === 'PENDING' ? 'Chờ duyệt' : status === 'ACTIVE' ? 'Đã duyệt' : 'Từ chối'}
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 p-6 min-h-[500px]">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-28 w-full bg-zinc-900 rounded-none" />
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
              {data?.authors?.map((author: any) => (
                <motion.div 
                  variants={itemVariants}
                  layout
                  key={author.id}
                  className="group relative bg-black p-4 flex flex-col md:flex-row md:items-center justify-between transition-colors hover:bg-zinc-900 border border-transparent hover:border-zinc-800"
                >
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="flex items-center gap-2 text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-2">
                      <Hash className="w-3 h-3" />
                      ID: {author.id.toString().padStart(4, '0')}
                      <span className="text-zinc-700">|</span>
                      <Clock className="w-3 h-3" />
                      {format(new Date(author.created_at), 'dd/MM/yyyy HH:mm', { locale: vi })}
                      <span className="text-zinc-700">|</span>
                      <span className={`font-bold ${author.status === 'PENDING' ? 'text-yellow-500' : author.status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'}`}>
                        {author.status === 'PENDING' ? 'CHỜ DUYỆT' : author.status === 'ACTIVE' ? 'ĐÃ DUYỆT' : 'TỪ CHỐI'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-medium text-zinc-100 group-hover:text-white transition-colors flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-500" />
                          Bút danh: {author.pen_name || "Chưa cập nhật"}
                        </h3>
                        <p className="text-sm text-zinc-400 mt-1">
                          Tài khoản: <span className="text-white font-medium">{author.account?.email || "Không rõ"}</span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 bg-zinc-900/50 p-3 flex flex-col gap-2 border border-zinc-900 text-sm">
                      <div className="flex items-center gap-2 text-zinc-300">
                        <Phone className="w-4 h-4 text-zinc-500" />
                        <span className="font-mono">{author.phone || 'Chưa cung cấp SĐT'}</span>
                      </div>
                      {author.facebook_link && (
                        <div className="flex items-center gap-2 text-zinc-300">
                          <LinkIcon className="w-4 h-4 text-zinc-500" />
                          <a href={author.facebook_link} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline hover:text-blue-300 truncate max-w-sm">
                            {author.facebook_link}
                          </a>
                        </div>
                      )}
                      {author.bio && (
                        <div className="text-zinc-400 italic border-l-2 border-zinc-700 pl-3 mt-2 line-clamp-2">
                          "{author.bio}"
                        </div>
                      )}
                    </div>
                  </div>

                  {author.status === 'PENDING' && (
                    <div className="flex flex-col md:items-end gap-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleApprove(author.id, 'ACTIVE')}
                        disabled={isApproving}
                        className="rounded-none border-green-500/30 text-green-500 hover:bg-green-500 hover:text-white transition-colors w-full md:w-auto"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Duyệt
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleApprove(author.id, 'REJECTED')}
                        disabled={isApproving}
                        className="rounded-none border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-colors w-full md:w-auto"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Từ chối
                      </Button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {!isLoading && (!data?.authors || data.authors.length === 0) && (
              <div className="col-span-full py-24 flex flex-col items-center justify-center bg-black">
                <ShieldAlert className="h-8 w-8 text-zinc-800 mb-4" strokeWidth={1} />
                <p className="text-zinc-500 font-mono uppercase tracking-widest text-sm">Không tìm thấy yêu cầu nào.</p>
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
