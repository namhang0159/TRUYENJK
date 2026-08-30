"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAdminTransactions } from '@/hooks/use-admin';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, ArrowDownLeft, ArrowUpRight, CheckCircle2, Clock, Ban, TerminalSquare } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminTransactionsPage() {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading } = useAdminTransactions(
    page, 
    20, 
    typeFilter === "all" ? "" : typeFilter, 
    statusFilter === "all" ? "" : statusFilter
  );

    const getTypeLabel = (type: string) => {
      switch (type) {
        case 'DEPOSIT': return 'NẠP TIỀN';
        case 'UNLOCK_CHAPTER': return 'MUA CHƯƠNG';
        case 'DONATE': return 'TẶNG QUÀ';
        case 'WITHDRAW': return 'RÚT TIỀN';
        case 'REFUND': return 'HOÀN TIỀN';
        case 'VIP_SUBSCRIPTION': return 'MUA VIP';
      default: return type;
    }
  };

    const getStatusBadge = (status: string) => {
      switch (status) {
        case 'SUCCESS': return <span className="flex items-center text-white text-[10px] font-mono tracking-widest uppercase"><CheckCircle2 className="w-3 h-3 mr-2 text-zinc-500" /> THÀNH CÔNG</span>;
        case 'PENDING': return <span className="flex items-center text-zinc-400 text-[10px] font-mono tracking-widest uppercase"><Clock className="w-3 h-3 mr-2" /> CHỜ XỬ LÝ</span>;
        case 'FAILED': return <span className="flex items-center text-zinc-600 text-[10px] font-mono tracking-widest uppercase"><Ban className="w-3 h-3 mr-2" /> THẤT BẠI</span>;
      default: return <span className="text-zinc-500 text-[10px] font-mono tracking-widest uppercase">{status}</span>;
    }
  };

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-zinc-900">
        <div>
          <h1 className="text-4xl md:text-6xl font-outfit font-medium tracking-tight text-white mb-2 uppercase">
            Sổ Cái Giao Dịch
          </h1>
          <p className="text-zinc-500 font-mono text-sm tracking-wide uppercase">
            Lịch sử không thể sửa đổi của mọi hoạt động giao dịch
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-[1px] w-full lg:w-auto bg-zinc-900 border border-zinc-900">
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v || "all"); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-48 bg-black border-none focus:ring-0 h-12 text-zinc-500 rounded-none font-mono text-xs tracking-widest uppercase">
              <SelectValue placeholder="LOẠI GIAO DỊCH" />
            </SelectTrigger>
            <SelectContent className="bg-black border border-zinc-900 rounded-none text-zinc-400 font-mono text-xs tracking-widest uppercase">
              <SelectItem value="all">Tất Cả Loại</SelectItem>
              <SelectItem value="DEPOSIT">Nạp Tiền</SelectItem>
              <SelectItem value="UNLOCK_CHAPTER">Mua Chương</SelectItem>
              <SelectItem value="DONATE">Tặng Quà</SelectItem>
              <SelectItem value="WITHDRAW">Rút Tiền</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v || "all"); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-48 bg-black border-none focus:ring-0 h-12 text-zinc-500 rounded-none font-mono text-xs tracking-widest uppercase">
              <SelectValue placeholder="TRẠNG THÁI" />
            </SelectTrigger>
            <SelectContent className="bg-black border border-zinc-900 rounded-none text-zinc-400 font-mono text-xs tracking-widest uppercase">
              <SelectItem value="all">Tất Cả Trạng Thái</SelectItem>
              <SelectItem value="SUCCESS">Thành Công</SelectItem>
              <SelectItem value="PENDING">Chờ Xử Lý</SelectItem>
              <SelectItem value="FAILED">Thất Bại</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="relative z-10 bg-zinc-900 border border-zinc-900">
        <div className="grid grid-cols-12 gap-[1px] bg-zinc-900 border-b border-zinc-900 hidden md:grid">
            <div className="col-span-3 bg-black p-4 text-[10px] font-mono text-zinc-600 tracking-widest uppercase">Người Dùng</div>
            <div className="col-span-2 bg-black p-4 text-[10px] font-mono text-zinc-600 tracking-widest uppercase">Loại</div>
            <div className="col-span-3 bg-black p-4 text-[10px] font-mono text-zinc-600 tracking-widest uppercase">Chi Tiết</div>
            <div className="col-span-2 bg-black p-4 text-[10px] font-mono text-zinc-600 tracking-widest uppercase">Số Tiền / Thời Gian</div>
            <div className="col-span-2 bg-black p-4 text-[10px] font-mono text-zinc-600 tracking-widest uppercase text-right">Trạng Thái</div>
        </div>

        {isLoading ? (
          <div className="space-y-[1px] bg-zinc-900">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-none bg-black" />
            ))}
          </div>
        ) : (
          <div className="space-y-[1px] bg-zinc-900">
            <AnimatePresence>
              {data?.transactions?.map((tx: any) => {
                const typeLabel = getTypeLabel(tx.type);
                const amountStr = Number(tx.amount).toLocaleString();
                const isPositive = ['DEPOSIT', 'REFUND'].includes(tx.type);

                return (
                  <div 
                    key={tx.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-[1px] bg-zinc-900 group transition-colors hover:bg-zinc-800"
                  >
                    <div className="col-span-1 md:col-span-3 bg-black p-4 flex flex-col justify-center group-hover:bg-zinc-950 transition-colors">
                        <span className="text-sm font-medium text-white transition-colors">
                            {tx.wallet?.reader?.account?.email || 'HỆ THỐNG'}
                        </span>
                    </div>
                    
                    <div className="col-span-1 md:col-span-2 bg-black p-4 flex items-center group-hover:bg-zinc-950 transition-colors">
                        <span className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase border border-zinc-900 px-2 py-1">
                            {typeLabel}
                        </span>
                    </div>

                    <div className="col-span-1 md:col-span-3 bg-black p-4 flex items-center group-hover:bg-zinc-950 transition-colors">
                        <span className="text-xs font-mono text-zinc-500 truncate flex items-center gap-2">
                            <TerminalSquare className="w-3 h-3 text-zinc-700" /> {tx.description || 'Không Có'}
                        </span>
                    </div>
                    
                    <div className="col-span-1 md:col-span-2 bg-black p-4 flex flex-col justify-center group-hover:bg-zinc-950 transition-colors">
                        <span className={`font-outfit text-xl ${isPositive ? 'text-white' : 'text-zinc-600'}`}>
                            {isPositive ? '+' : '-'}{amountStr}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mt-1">
                            {format(new Date(tx.created_at), 'dd/MM/yy HH:mm')}
                        </span>
                    </div>

                    <div className="col-span-1 md:col-span-2 bg-black p-4 flex items-center md:justify-end group-hover:bg-zinc-950 transition-colors">
                        {getStatusBadge(tx.status)}
                    </div>
                  </div>
                );
              })}
            </AnimatePresence>
            {!isLoading && (!data?.transactions || data.transactions.length === 0) && (
              <div className="col-span-12 py-24 flex flex-col items-center justify-center bg-black">
                <CreditCard className="h-6 w-6 text-zinc-800 mb-4" />
                <p className="text-zinc-600 font-mono text-[10px] tracking-widest uppercase">Không tìm thấy giao dịch nào.</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Pagination */}
      <div className="flex justify-between items-center pt-4 border-t border-zinc-900">
        <span className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase">
            TRANG {data?.page || 1} TRÊN {data?.total_pages || 1}
        </span>
        <div className="flex items-center gap-[1px] bg-zinc-900 border border-zinc-900">
          <Button 
            variant="ghost" 
            disabled={page === 1} 
            onClick={() => setPage(p => p - 1)}
            className="h-10 px-6 rounded-none bg-black text-zinc-500 hover:text-white hover:bg-zinc-950 transition-colors font-mono text-[10px] tracking-widest uppercase disabled:opacity-50"
          >
            TRƯỚC
          </Button>
          <Button 
            variant="ghost" 
            disabled={page >= (data?.total_pages || 1)} 
            onClick={() => setPage(p => p + 1)}
            className="h-10 px-6 rounded-none bg-black text-zinc-500 hover:text-white hover:bg-zinc-950 transition-colors font-mono text-[10px] tracking-widest uppercase disabled:opacity-50"
          >
            SAU
          </Button>
        </div>
      </div>
    </div>
  );
}
