"use client";

import React, { useMemo } from 'react';
import { ShieldAlert, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useAdminRevenue } from '@/hooks/use-admin';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { format, subDays, startOfDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function AdminRevenuePage() {
  const { data, isLoading } = useAdminRevenue();

  const chartData = useMemo(() => {
    if (!data) return [];
    
    // Tạo data cho 30 ngày gần nhất
    const last30Days = Array.from({ length: 30 }).map((_, i) => {
      const d = startOfDay(subDays(new Date(), 29 - i));
      return {
        date: format(d, 'yyyy-MM-dd'),
        displayDate: format(d, 'dd/MM'),
        deposit: 0,
        withdraw: 0
      };
    });

    data.deposits?.forEach((d: any) => {
      const item = last30Days.find(x => x.date === d.date);
      if (item) item.deposit = Number(d.total);
    });

    data.withdrawals?.forEach((w: any) => {
      const item = last30Days.find(x => x.date === w.date);
      if (item) item.withdraw = Number(w.total);
    });

    return last30Days;
  }, [data]);

  const totalDeposit = useMemo(() => chartData.reduce((sum, item) => sum + item.deposit, 0), [chartData]);
  const totalWithdraw = useMemo(() => chartData.reduce((sum, item) => sum + item.withdraw, 0), [chartData]);
  const netRevenue = totalDeposit - totalWithdraw;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-white mb-2">Báo Cáo Doanh Thu</h1>
        <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
          Thống kê dòng tiền (Nạp / Rút) trong 30 ngày qua
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 bg-zinc-900 rounded-none" />
          <Skeleton className="h-32 bg-zinc-900 rounded-none" />
          <Skeleton className="h-32 bg-zinc-900 rounded-none" />
          <Skeleton className="h-[400px] bg-zinc-900 rounded-none col-span-full" />
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black border border-zinc-900 p-6 flex flex-col justify-between hover:border-zinc-700 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Tổng Thu (Nạp)</span>
                <TrendingUp className="text-green-500 h-5 w-5" />
              </div>
              <div className="text-3xl font-light text-white font-mono">
                {totalDeposit.toLocaleString('vi-VN')} <span className="text-sm text-zinc-500">VNĐ</span>
              </div>
            </div>

            <div className="bg-black border border-zinc-900 p-6 flex flex-col justify-between hover:border-zinc-700 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Tổng Chi (Rút)</span>
                <TrendingDown className="text-red-500 h-5 w-5" />
              </div>
              <div className="text-3xl font-light text-white font-mono">
                {totalWithdraw.toLocaleString('vi-VN')} <span className="text-sm text-zinc-500">VNĐ</span>
              </div>
            </div>

            <div className={`bg-black border p-6 flex flex-col justify-between transition-colors ${netRevenue >= 0 ? 'border-green-900/50 hover:border-green-700' : 'border-red-900/50 hover:border-red-700'}`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Doanh thu ròng</span>
                <DollarSign className={netRevenue >= 0 ? "text-green-500 h-5 w-5" : "text-red-500 h-5 w-5"} />
              </div>
              <div className={`text-3xl font-light font-mono ${netRevenue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {netRevenue > 0 ? '+' : ''}{netRevenue.toLocaleString('vi-VN')} <span className="text-sm opacity-50">VNĐ</span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-black border border-zinc-900 p-6">
            <h3 className="text-zinc-400 font-mono text-sm uppercase tracking-widest mb-6">Biểu đồ dòng tiền (30 ngày)</h3>
            <div className="h-[400px] w-full font-mono text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="displayDate" stroke="#52525b" tick={{fill: '#52525b'}} />
                  <YAxis stroke="#52525b" tick={{fill: '#52525b'}} tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', borderColor: '#27272a', borderRadius: 0, fontFamily: 'monospace' }}
                    itemStyle={{ fontFamily: 'monospace' }}
                    formatter={(value: any) => [`${value.toLocaleString('vi-VN')} VNĐ`, '']}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Line type="monotone" name="Thu (Nạp)" dataKey="deposit" stroke="#22c55e" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                  <Line type="monotone" name="Chi (Rút)" dataKey="withdraw" stroke="#ef4444" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
