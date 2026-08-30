"use client";

import { Variants } from "framer-motion";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert, CheckCircle, XCircle, DollarSign, Hash, Clock, Landmark } from 'lucide-react';
import { useAdminPayouts, useApprovePayout } from '@/hooks/use-admin';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function AdminPayoutsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminPayouts(page, 20);
  const { mutate: approvePayout, isPending: isApproving } = useApprovePayout();

  const handleApprove = (payoutId: number, status: 'SUCCESS' | 'REJECTED') => {
    if (confirm(`Bạn có chắc muốn ${status === 'SUCCESS' ? 'Duyệt' : 'Từ chối'} yêu cầu rút tiền này?`)) {
      approvePayout({ id: payoutId, status });
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
        <h1 className="text-3xl font-light tracking-tight text-white mb-2">Rút Tiền</h1>
        <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
          Quản lý các yêu cầu rút doanh thu của Tác giả
        </p>
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
              {data?.payouts?.map((payout: any) => (
                <motion.div 
                  variants={itemVariants}
                  layout
                  key={payout.id}
                  className="group relative bg-black p-4 flex flex-col md:flex-row md:items-center justify-between transition-colors hover:bg-zinc-900 border border-transparent hover:border-zinc-800"
                >
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="flex items-center gap-2 text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-2">
                      <Hash className="w-3 h-3" />
                      ID: {payout.id.toString().padStart(4, '0')}
                      <span className="text-zinc-700">|</span>
                      <Clock className="w-3 h-3" />
                      {format(new Date(payout.requested_at), 'dd/MM/yyyy HH:mm', { locale: vi })}
                      <span className="text-zinc-700">|</span>
                      <span className={`font-bold ${payout.status === 'PENDING' ? 'text-yellow-500' : payout.status === 'SUCCESS' ? 'text-green-500' : 'text-red-500'}`}>
                        {payout.status === 'PENDING' ? 'CHỜ DUYỆT' : payout.status === 'SUCCESS' ? 'ĐÃ DUYỆT' : 'TỪ CHỐI'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-medium text-zinc-100 group-hover:text-white transition-colors flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          {Number(payout.amount).toLocaleString('vi-VN')} VNĐ
                        </h3>
                        <p className="text-sm text-zinc-400 mt-1">
                          Tác giả: <span className="text-white font-medium">{payout.author?.pen_name || "Không rõ"}</span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 bg-zinc-900/50 p-3 flex items-start gap-3 border border-zinc-900">
                      <Landmark className="w-4 h-4 text-zinc-500 mt-0.5" />
                      <div className="text-xs text-zinc-300 font-mono leading-relaxed">
                        <div>Ngân hàng: <span className="text-white">{payout.author?.bank_name || 'Chưa cập nhật'}</span></div>
                        <div>Số tài khoản: <span className="text-white">{payout.author?.bank_account_number || 'Chưa cập nhật'}</span></div>
                        <div>Chủ tài khoản: <span className="text-white uppercase">{payout.author?.bank_account_name || 'Chưa cập nhật'}</span></div>
                      </div>
                    </div>
                  </div>

                  {payout.status === 'PENDING' && (
                    <div className="flex flex-col md:items-end gap-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleApprove(payout.id, 'SUCCESS')}
                        disabled={isApproving}
                        className="rounded-none border-green-500/30 text-green-500 hover:bg-green-500 hover:text-white transition-colors w-full md:w-auto"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Duyệt & Đã CK
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleApprove(payout.id, 'REJECTED')}
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
            {!isLoading && (!data?.payouts || data.payouts.length === 0) && (
              <div className="col-span-full py-24 flex flex-col items-center justify-center bg-black">
                <ShieldAlert className="h-8 w-8 text-zinc-800 mb-4" strokeWidth={1} />
                <p className="text-zinc-500 font-mono uppercase tracking-widest text-sm">Không có yêu cầu rút tiền nào.</p>
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
