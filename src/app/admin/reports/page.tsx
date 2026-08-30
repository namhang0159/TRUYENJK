"use client";

import { Variants } from "framer-motion";
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert, CheckCircle, XCircle, Flag, Hash, Clock, FileText, MessageSquare } from 'lucide-react';
import { useAdminReports, useResolveReport } from '@/hooks/use-admin';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Link from 'next/link';

export default function AdminReportsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  
  const { data, isLoading } = useAdminReports(page, 50, statusFilter === "all" ? "" : statusFilter);
  const { mutate: resolveReport, isPending: isResolving } = useResolveReport();

  const handleResolve = (reportId: number, status: 'RESOLVED' | 'REJECTED') => {
    if (confirm(`Đánh dấu báo cáo này là ${status === 'RESOLVED' ? 'Đã xử lý' : 'Từ chối'}?`)) {
      resolveReport({ id: reportId, status });
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.03 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 5 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
  };

  // Group reports by date
  const groupedReports = useMemo(() => {
    if (!data?.reports) return {};
    
    return data.reports.reduce((groups: any, report: any) => {
      const date = format(new Date(report.created_at), 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(report);
      return groups;
    }, {});
  }, [data?.reports]);

  const sortedDates = Object.keys(groupedReports).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2">Báo Cáo Vi Phạm</h1>
          <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
            Xử lý các khiếu nại, báo lỗi nội dung từ độc giả
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {['all', 'PENDING', 'RESOLVED', 'REJECTED'].map((status) => (
            <Button
              key={status}
              variant="outline"
              size="sm"
              onClick={() => { setStatusFilter(status); setPage(1); }}
              className={`rounded-none border-zinc-800 font-mono text-xs uppercase tracking-wider ${
                statusFilter === status 
                  ? 'bg-white text-black hover:bg-zinc-200' 
                  : 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {status === 'all' ? 'Tất cả' : status === 'PENDING' ? 'Chưa xử lý' : status === 'RESOLVED' ? 'Đã xử lý' : 'Từ chối'}
            </Button>
          ))}
        </div>
      </div>

      <div className="min-h-[500px]">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full bg-zinc-900/50 rounded-none" />
            ))}
          </div>
        ) : !data?.reports || data.reports.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center bg-black border border-zinc-900">
            <ShieldAlert className="h-8 w-8 text-zinc-800 mb-4" strokeWidth={1} />
            <p className="text-zinc-500 font-mono uppercase tracking-widest text-sm">Không tìm thấy báo cáo nào.</p>
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
            <AnimatePresence mode="popLayout">
              {sortedDates.map(date => (
                <div key={date} className="space-y-4">
                  <h3 className="text-zinc-400 font-mono text-xs uppercase tracking-widest sticky top-0 bg-zinc-950 py-2 z-10 border-b border-zinc-900">
                    Ngày {format(new Date(date), 'dd/MM/yyyy', { locale: vi })}
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {groupedReports[date].map((report: any) => (
                      <motion.div 
                        variants={itemVariants}
                        layout
                        key={report.id}
                        className="group relative bg-black p-4 transition-colors hover:bg-zinc-900/50 border border-zinc-900"
                      >
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-3">
                              <Hash className="w-3 h-3" />
                              ID: {report.id.toString().padStart(4, '0')}
                              <span className="text-zinc-700">|</span>
                              <Clock className="w-3 h-3" />
                              {format(new Date(report.created_at), 'HH:mm')}
                              <span className="text-zinc-700">|</span>
                              <span className={`font-bold ${report.status === 'PENDING' ? 'text-yellow-500' : report.status === 'RESOLVED' ? 'text-green-500' : 'text-red-500'}`}>
                                {report.status === 'PENDING' ? 'CHƯA XỬ LÝ' : report.status === 'RESOLVED' ? 'ĐÃ XỬ LÝ' : 'TỪ CHỐI'}
                              </span>
                            </div>
                            
                            <div className="flex items-start gap-3 mb-4">
                              <div className="mt-1">
                                {report.target_type === 'STORY' ? <FileText className="w-4 h-4 text-blue-500" /> : <MessageSquare className="w-4 h-4 text-purple-500" />}
                              </div>
                              <div>
                                <h4 className="text-base font-medium text-white">
                                  [ {report.target_type} ID: {report.target_id} ] {report.reason}
                                </h4>
                                {report.description && (
                                  <p className="text-sm text-zinc-400 mt-2 bg-zinc-900/50 p-3 border-l-2 border-zinc-700">
                                    "{report.description}"
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col md:items-end justify-between gap-4 md:border-l md:border-zinc-900 md:pl-6 min-w-[200px]">
                            <div className="text-xs text-zinc-500 font-mono">
                              Người báo cáo: <br />
                              <span className="text-white">Account ID #{report.reporter_account_id}</span>
                            </div>

                            {report.status === 'PENDING' && (
                              <div className="flex flex-col gap-2 w-full">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleResolve(report.id, 'RESOLVED')}
                                  disabled={isResolving}
                                  className="rounded-none border-green-500/30 text-green-500 hover:bg-green-500 hover:text-white transition-colors w-full"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Đã Khắc Phục
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleResolve(report.id, 'REJECTED')}
                                  disabled={isResolving}
                                  className="rounded-none border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors w-full"
                                >
                                  Bỏ qua
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </AnimatePresence>
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
