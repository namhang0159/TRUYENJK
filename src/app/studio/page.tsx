"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { BookOpen, Headphones, Coins, TrendingUp, Award, Zap, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const data = [
  { name: 'T2', reads: 4000, listens: 2400 },
  { name: 'T3', reads: 3000, listens: 1398 },
  { name: 'T4', reads: 2000, listens: 9800 },
  { name: 'T5', reads: 2780, listens: 3908 },
  { name: 'T6', reads: 1890, listens: 4800 },
  { name: 'T7', reads: 2390, listens: 3800 },
  { name: 'CN', reads: 3490, listens: 4300 },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function StudioDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            Tổng quan Studio
            <span className="px-2 py-0.5 border border-zinc-800 bg-zinc-900 text-zinc-300 font-mono text-[10px] uppercase tracking-widest flex items-center gap-1">
              <Award className="w-3 h-3" /> Bậc Thầy
            </span>
          </h1>
          <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
            Theo dõi hiệu suất sáng tạo và doanh thu của bạn trong tuần.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button render={<Link href="/studio/stories/new" />} nativeButton={false} variant="outline" className="rounded-none border-zinc-800 bg-transparent text-white hover:bg-white hover:text-black transition-colors font-mono uppercase text-xs">
            <Zap className="w-3 h-3 mr-2" /> Viết chương mới
          </Button>
        </motion.div>
      </div>
      
      {/* Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {/* Total Reads */}
        <motion.div variants={itemVariants} className="bg-black border border-zinc-900 p-6 flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Tổng lượt đọc</span>
            <BookOpen className="text-indigo-500 h-4 w-4" />
          </div>
          <div className="relative z-10">
            <div className="text-2xl font-light text-white font-mono mb-2">19,540</div>
            <div className="flex items-center text-[10px] font-mono uppercase text-emerald-500 tracking-widest">
              <TrendingUp className="w-3 h-3 mr-1" /> +20.1% Tuần trước
            </div>
          </div>
        </motion.div>

        {/* Total Listens */}
        <motion.div variants={itemVariants} className="bg-black border border-zinc-900 p-6 flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Tổng lượt nghe</span>
            <Headphones className="text-teal-500 h-4 w-4" />
          </div>
          <div className="relative z-10">
            <div className="text-2xl font-light text-white font-mono mb-2">14,204</div>
            <div className="flex items-center text-[10px] font-mono uppercase text-emerald-500 tracking-widest">
              <TrendingUp className="w-3 h-3 mr-1" /> +15.0% Tuần trước
            </div>
          </div>
        </motion.div>

        {/* Total Revenue */}
        <motion.div variants={itemVariants} className="bg-black border border-zinc-900 p-6 flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Doanh thu Coin</span>
            <Coins className="text-amber-500 h-4 w-4" />
          </div>
          <div className="relative z-10 flex items-end justify-between">
            <div>
              <div className="text-2xl font-light text-amber-500 font-mono mb-2">54,000</div>
              <div className="flex items-center text-[10px] font-mono uppercase text-emerald-500 tracking-widest">
                <TrendingUp className="w-3 h-3 mr-1" /> +8.5% Tuần trước
              </div>
            </div>
            <Link href="/studio/withdrawals">
              <Button size="sm" variant="outline" className="rounded-none border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 h-8 text-[10px] font-mono uppercase">
                Rút tiền
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Chart */}
        <motion.div variants={itemVariants} className="bg-black border border-zinc-900 p-6 lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">Hiệu suất 7 ngày qua</h3>
          </div>
          
          <div className="flex-1 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fff" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#fff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorListens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#52525b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#52525b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 10, fontFamily: 'monospace'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 10, fontFamily: 'monospace'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', borderRadius: '0px', border: '1px solid #27272a', color: '#fff', fontFamily: 'monospace', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="reads" stroke="#fff" strokeWidth={2} fillOpacity={1} fill="url(#colorReads)" name="Lượt đọc" />
                <Area type="monotone" dataKey="listens" stroke="#71717a" strokeWidth={2} fillOpacity={1} fill="url(#colorListens)" name="Lượt nghe" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Actions / Status */}
        <motion.div variants={itemVariants} className="bg-black border border-zinc-900 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Truyện nổi bật của bạn</h3>
            <div className="flex items-center gap-4 bg-zinc-950 border border-zinc-900 p-3 group hover:border-zinc-700 transition-colors">
              <div className="w-12 h-16 bg-zinc-900 overflow-hidden shrink-0">
                <img src="https://picsum.photos/seed/studio/200/300" alt="Cover" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
              </div>
              <div>
                <h4 className="text-zinc-100 font-medium group-hover:text-white transition-colors line-clamp-1">Đấu La Đại Lục - Hệ Thống</h4>
                <div className="text-[10px] text-zinc-500 font-mono mt-1 uppercase tracking-widest">Đang tiến hành • 124 chương</div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-4">Tiến độ nhiệm vụ</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest mb-2">
                  <span className="text-zinc-400">Đăng chương mới (5/7 ngày)</span>
                  <span className="text-white">70%</span>
                </div>
                <div className="h-1 w-full bg-zinc-900">
                  <div className="h-full bg-white w-[70%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest mb-2">
                  <span className="text-zinc-400">Đạt 20,000 views tuần</span>
                  <span className="text-white">95%</span>
                </div>
                <div className="h-1 w-full bg-zinc-900">
                  <div className="h-full bg-white w-[95%]" />
                </div>
              </div>
            </div>
          </div>
          
          <Button variant="outline" className="w-full mt-8 rounded-none border-zinc-800 bg-transparent text-white hover:bg-white hover:text-black transition-colors font-mono uppercase text-[10px] tracking-widest">
            Nhận thưởng tuần
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
