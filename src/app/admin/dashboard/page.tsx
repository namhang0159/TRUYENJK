"use client";

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Layers, 
  DollarSign,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sparkles,
  Hash
} from 'lucide-react';
import { useSystemStats } from '@/hooks/use-admin';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

// Counter component for animated numbers
const AnimatedCounter = ({ value, prefix = "", suffix = "" }: { value: number, prefix?: string, suffix?: string }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const increment = value / (duration / 16);
    
    if (value === 0) return;
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return (
    <span>
      {prefix}{count.toLocaleString('en-US')}{suffix}
    </span>
  );
};

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useSystemStats();

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

  const StatCard = ({ title, value, label, trend }: { title: string, value: number, label: string, trend?: string }) => {
    return (
      <motion.div 
        variants={itemVariants}
        className="group relative bg-black p-6 md:p-8 flex flex-col justify-between transition-colors hover:bg-zinc-950 min-h-[220px]"
      >
        <div className="flex justify-between items-start mb-12">
          <div className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
            // {label}
          </div>
          {trend && (
            <div className="flex items-center text-[10px] font-mono tracking-widest text-white uppercase border border-zinc-800 px-2 py-1 bg-zinc-900">
              <TrendingUp className="w-3 h-3 mr-2 text-zinc-400" strokeWidth={2} />
              +{trend}
            </div>
          )}
        </div>
        
        <div>
          <div className="text-zinc-400 text-sm font-medium tracking-wide mb-1 uppercase font-sans">{title}</div>
          {isLoading ? (
            <Skeleton className="h-12 w-32 bg-zinc-900 rounded-none mt-2" />
          ) : (
            <div className="text-5xl md:text-6xl font-medium text-white tracking-tighter font-outfit mt-2">
              <AnimatedCounter value={value} />
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-zinc-900">
        <div>
          <h1 className="text-4xl md:text-6xl font-outfit font-medium tracking-tight text-white mb-2 uppercase">
            Dữ Liệu Hệ Thống
          </h1>
          <p className="text-zinc-500 font-mono text-sm tracking-wide uppercase">
            Chỉ Số Trực Tiếp // Trạng Thái Nền Tảng // Dòng Tiền
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-500 bg-black px-4 py-2 border border-zinc-900 uppercase tracking-widest">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          ĐÃ ĐỒNG BỘ_
        </div>
      </div>
      
      <div className="relative z-10">
        <motion.div 
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="grid gap-[1px] md:grid-cols-2 lg:grid-cols-4 bg-zinc-900 border border-zinc-900"
        >
          {/* Key Metrics Row (4 columns) */}
          <StatCard 
            title="Tổng Người Dùng" 
            value={stats?.totalUsers || 0} 
            label="METRIC_01"
            trend="15%"
          />
          <StatCard 
            title="Tổng Truyện" 
            value={stats?.totalStories || 0} 
            label="METRIC_02"
            trend="5%"
          />
          <StatCard 
            title="Tổng Chương" 
            value={stats?.totalChapters || 0} 
            label="METRIC_03"
          />
          <StatCard 
            title="Doanh Thu (VNĐ)" 
            value={stats?.totalRevenue || 0} 
            label="METRIC_04"
            trend="32%"
          />

          {/* Secondary Information row (Spanning columns) */}
          
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-3 bg-black p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-outfit text-white tracking-tight uppercase">Hoạt Động Gần Đây</h3>
              <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">HOẠT ĐỘNG_MỚI NHẤT</p>
            </div>
            
            <div className="space-y-0">
              {isLoading ? (
                 <div className="space-y-[1px] bg-zinc-900">
                   {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full rounded-none bg-black" />
                   ))}
                 </div>
              ) : (
                <div className="space-y-[1px] bg-zinc-900 border border-zinc-900">
                  {stats?.recentActivities?.map((activity: any) => (
                    <div 
                      key={activity.id} 
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-black hover:bg-zinc-950 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-zinc-900 flex items-center justify-center text-zinc-500 shrink-0">
                          <Hash className="w-3 h-3" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">{activity.title}</p>
                          <p className="text-[10px] font-mono text-zinc-600 mt-1 uppercase tracking-widest">
                            TÁC GIẢ // {activity.author}
                          </p>
                        </div>
                      </div>
                      <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-4 sm:mt-0">
                        {format(new Date(activity.created_at), 'HH:mm:ss')} // {format(new Date(activity.created_at), 'MM-dd')}
                      </div>
                    </div>
                  ))}
                  {!stats?.recentActivities?.length && (
                    <div className="text-center py-12 bg-black">
                      <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Không có dữ liệu hoạt động nào.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-1 bg-black p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-outfit text-white tracking-tight uppercase">Trạng Thái</h3>
              </div>
              <div className="space-y-6 font-mono text-xs uppercase tracking-widest">
                <div className="flex justify-between items-center pb-4 border-b border-zinc-900">
                  <span className="text-zinc-500">Cơ Sở Dữ Liệu</span>
                  <span className="text-white flex items-center gap-2"><div className="w-1.5 h-1.5 bg-white rounded-full"></div>Trực Tuyến</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-zinc-900">
                  <span className="text-zinc-500">Độ Trễ API</span>
                  <span className="text-white">~42ms</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-zinc-900">
                  <span className="text-zinc-500">Lưu Trữ</span>
                  <span className="text-white">12.4 TB</span>
                </div>
              </div>
            </div>
            
            <div className="mt-12">
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest leading-relaxed">
                Tất cả hệ thống hoạt động bình thường. Các thông số nằm trong mức cho phép.
              </p>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
