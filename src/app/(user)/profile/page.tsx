"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { User, Wallet, History, Settings, ChevronRight, Shield, Star, PenTool, Headphones, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Skeleton className="w-24 h-24 rounded-full" />
        <Skeleton className="w-48 h-6" />
        <Skeleton className="w-32 h-4" />
      </div>
    );
  }

  const roleText = user.role === 'AUTHOR' ? 'Tác Giả' : user.role === 'ADMIN' ? 'Quản Trị Viên' : user.role === 'VIP_USER' ? 'Thành Viên VIP' : 'Độc Giả';
  
  // Calculate VIP days left
  const isVip = user.tier === "VIP_USER";
  let remainingDays = 0;
  if (isVip && user.vip_expiry) {
    const expiry = new Date(user.vip_expiry);
    const now = new Date();
    const diffTime = Math.max(0, expiry.getTime() - now.getTime());
    remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">Hồ Sơ Của Bạn</h1>
        <p className="text-muted-foreground mt-2 text-lg">Quản lý tài khoản, đặc quyền và lịch sử hoạt động.</p>
      </div>

      {/* BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]">
        
        {/* 1. Main Profile Identity (Span 2 cols) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
          className="md:col-span-2 row-span-2 group relative overflow-hidden rounded-[2rem] border border-gray-200 dark:border-white/10 bg-white dark:bg-black/40 backdrop-blur-3xl shadow-sm hover:shadow-xl transition-all duration-500 p-8 flex flex-col justify-between"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 dark:bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none transition-transform duration-700 group-hover:scale-110" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background bg-muted shadow-xl relative z-10">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.displayName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <User className="w-14 h-14 m-8 text-muted-foreground" />
                )}
              </div>
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl group-hover:bg-primary/40 transition-all duration-500" />
            </div>

            <div className="space-y-3">
              <h2 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
                {user.displayName}
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary" className="px-3 py-1.5 rounded-full font-mono uppercase tracking-wider text-xs border bg-primary/10 text-primary border-primary/20">
                  {user.role === 'VIP_USER' ? <Star className="w-3.5 h-3.5 mr-1.5 inline-block" /> : user.role === 'ADMIN' ? <Shield className="w-3.5 h-3.5 mr-1.5 inline-block" /> : <User className="w-3.5 h-3.5 mr-1.5 inline-block" />}
                  {roleText}
                </Badge>
                <span className="text-muted-foreground font-mono text-sm">{user.email}</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-10 flex gap-4">
            <Link href="/profile/settings">
              <Button variant="outline" className="rounded-xl bg-background/50 hover:bg-background border-gray-200 dark:border-white/10 shadow-sm transition-all h-12 px-6">
                <Settings className="w-4 h-4 mr-2" /> Cài đặt tài khoản
              </Button>
            </Link>
            <Button variant="ghost" onClick={logout} className="rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 h-12 px-6">
              <LogOut className="w-4 h-4 mr-2" /> Đăng xuất
            </Button>
          </div>
        </motion.div>

        {/* 2. Wallet & Coin (Span 1 col, Row 1) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="group relative overflow-hidden rounded-[2rem] border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-950/50 backdrop-blur-xl shadow-sm hover:shadow-lg transition-all duration-500 p-6 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Wallet className="w-6 h-6" />
            </div>
            <Link href="/profile/wallet">
              <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-muted-foreground group-hover:bg-amber-500 group-hover:text-white transition-colors cursor-pointer">
                <ChevronRight className="w-5 h-5" />
              </div>
            </Link>
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">Ví Coin</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">Nạp Coin để ủng hộ tác giả và mở khóa chương truyện.</p>
            <Link href="/profile/wallet" className="inline-block w-full">
              <Button className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/25 border-none">
                Nạp Coin Ngay
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* 3. VIP Status (Span 1 col, Row 2) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className={`group relative overflow-hidden rounded-[2rem] border shadow-sm hover:shadow-lg transition-all duration-500 p-6 flex flex-col justify-between ${
            isVip 
              ? 'border-yellow-400/30 bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-500/10 dark:to-zinc-950/50' 
              : 'border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-950/50'
          }`}
        >
          {isVip && <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />}
          
          <div className="relative z-10 flex justify-between items-start mb-4">
            <div className={`p-3.5 rounded-2xl border ${isVip ? 'bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 border-yellow-400/30' : 'bg-gray-100 dark:bg-white/5 text-muted-foreground border-transparent'}`}>
              <Headphones className="w-6 h-6" />
            </div>
            <Link href="/profile/wallet#vip-subscription">
              <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-muted-foreground group-hover:bg-yellow-500 group-hover:text-white transition-colors cursor-pointer">
                <ChevronRight className="w-5 h-5" />
              </div>
            </Link>
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-foreground mb-1">Đặc Quyền VIP</h3>
            {isVip ? (
              <>
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400 mb-4">
                  Đang kích hoạt • Còn {remainingDays} ngày
                </p>
                <Link href="/profile/wallet#vip-subscription" className="inline-block w-full">
                  <Button variant="outline" className="w-full rounded-xl border-yellow-400/50 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-400/10">
                    Gia hạn VIP
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">Trải nghiệm nghe Audio không giới hạn quảng cáo.</p>
                <Link href="/profile/wallet#vip-subscription" className="inline-block w-full">
                  <Button variant="outline" className="w-full rounded-xl border-gray-200 dark:border-white/10 bg-transparent hover:bg-yellow-500 hover:text-white hover:border-yellow-500 transition-colors">
                    Đăng ký VIP
                  </Button>
                </Link>
              </>
            )}
          </div>
        </motion.div>

        {/* 4. History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        >
          <Link href="/profile/history" className="block h-full">
            <div className="group h-full p-6 rounded-[2rem] border border-gray-200 dark:border-white/10 bg-white dark:bg-black/40 backdrop-blur-xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20 transition-transform group-hover:scale-110">
                  <History className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">Lịch sử giao dịch</h3>
                  <p className="text-sm text-muted-foreground">Theo dõi nạp tiền & mua truyện</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </motion.div>

        {/* 5. Author Studio (Takes remaining space, full width on mobile) */}
        {(user.role === 'AUTHOR' || user.role === 'ADMIN') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            className="md:col-span-2"
          >
            <Link href="/studio" className="block h-full">
              <div className="group relative overflow-hidden rounded-[2rem] border border-purple-500/30 bg-purple-50 dark:bg-purple-950/20 backdrop-blur-xl shadow-sm hover:shadow-lg transition-all duration-500 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="absolute right-0 top-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none transform translate-x-1/2 -translate-y-1/2 group-hover:bg-purple-500/20 transition-colors duration-700" />
                
                <div className="flex items-center gap-5 relative z-10">
                  <div className="p-4 rounded-2xl bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30 transition-transform group-hover:scale-110">
                    <PenTool className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">Author Studio</h3>
                    <p className="text-sm text-muted-foreground">Vào không gian sáng tạo & quản lý truyện</p>
                  </div>
                </div>
                <Button className="relative z-10 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/25 border-none px-6 py-5 w-full md:w-auto font-bold">
                  Truy cập Studio
                </Button>
              </div>
            </Link>
          </motion.div>
        )}

      </div>
    </div>
  );
}
