"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import {
  LayoutDashboard,
  BookText,
  PenTool,
  LineChart,
  LogOut,
  Sparkles,
  Wallet,
  ShieldAlert,
  Shield,
  ArrowRight,
  Lock,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: 'Tổng quan', href: '/studio', icon: LayoutDashboard },
    { name: 'Truyện của tôi', href: '/studio/stories', icon: BookText },
    { name: 'Tạo truyện mới', href: '/studio/stories/new', icon: PenTool },
    { name: 'Doanh thu', href: '/studio/revenue', icon: LineChart },
    { name: 'Rút tiền', href: '/studio/withdrawals', icon: Wallet },
  ];

  // 1. Loading State (tránh Hydration mismatch)
  if (!mounted) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-black text-white font-sans">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/20 border-t-white"></div>
      </div>
    );
  }

  // 2. Unauthenticated Guard
  if (!isAuthenticated || !user) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-black text-white font-sans selection:bg-white selection:text-black">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-md px-6"
        >
          <div className="mx-auto w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6">
            <Lock className="h-6 w-6 text-zinc-400" strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <span className="px-2 py-0.5 border border-zinc-800 bg-zinc-900 text-zinc-400 font-mono text-[10px] uppercase tracking-widest">
              XÁC THỰC DANH TÍNH
            </span>
            <h1 className="text-2xl font-light tracking-tight text-white uppercase font-outfit">Yêu Cầu Đăng Nhập</h1>
            <p className="text-zinc-500 text-sm font-sans">
              Vui lòng đăng nhập bằng tài khoản Tác Giả để truy cập không gian sáng tác Author Studio.
            </p>
          </div>
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => router.push('/')} 
              variant="outline" 
              className="text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-none border border-zinc-800"
            >
              <Home className="mr-2 h-4 w-4" /> Về Trang Chủ
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // 3. Role Guard: ADMIN Account (chặn Admin vào Studio, điều hướng về Admin Dashboard)
  if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-black text-white font-sans selection:bg-white selection:text-black">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-lg px-6"
        >
          <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
            <ShieldAlert className="h-8 w-8 text-amber-400" strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <span className="px-2.5 py-1 border border-amber-500/30 bg-amber-500/10 text-amber-400 font-mono text-[10px] uppercase tracking-widest rounded-full">
              QUẢN TRỊ VIÊN // KHÔNG KHẢ DỤNG CHO STUDIO
            </span>
            <h1 className="text-2xl font-light tracking-tight text-white uppercase font-outfit mt-2">
              Khu Vực Dành Riêng Cho Tác Giả
            </h1>
            <p className="text-zinc-400 text-sm font-sans leading-relaxed">
              Tài khoản hiện tại của bạn là <strong className="text-white font-medium">Quản Trị Viên (Admin)</strong>. Admin không có hồ sơ Tác Giả cá nhân nên không thể đăng tải truyện tại Author Studio.
            </p>
            <p className="text-zinc-500 text-xs font-mono">
              Vui lòng sử dụng trang Quản Trị Admin để kiểm duyệt truyện, chương và quản lý hệ thống.
            </p>
          </div>
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/admin/dashboard" className="w-full sm:w-auto">
              <Button className="w-full text-xs font-mono uppercase tracking-widest bg-white text-black hover:bg-zinc-200 rounded-none h-11 px-6">
                <Shield className="mr-2 h-4 w-4" /> Đến Admin Dashboard
              </Button>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-none border border-zinc-800 h-11 px-6">
                Trang Chủ
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // 4. Role Guard: Regular Readers (chưa đăng ký tác giả)
  if (user.role !== 'AUTHOR') {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-black text-white font-sans selection:bg-white selection:text-black">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-md px-6"
        >
          <div className="mx-auto w-14 h-14 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6">
            <PenTool className="h-6 w-6 text-purple-400" strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <span className="px-2.5 py-1 border border-purple-500/30 bg-purple-500/10 text-purple-400 font-mono text-[10px] uppercase tracking-widest rounded-full">
              YÊU CẦU TÀI KHOẢN TÁC GIẢ
            </span>
            <h1 className="text-2xl font-light tracking-tight text-white uppercase font-outfit mt-2">
              Author Studio
            </h1>
            <p className="text-zinc-400 text-sm font-sans leading-relaxed">
              Bạn cần đăng ký trở thành Tác Giả để mở khóa không gian sáng tác, xuất bản chương và nhận doanh thu từ độc giả.
            </p>
          </div>
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/profile" className="w-full sm:w-auto">
              <Button className="w-full text-xs font-mono uppercase tracking-widest bg-purple-600 hover:bg-purple-700 text-white rounded-none h-11 px-6">
                Đăng Ký Làm Tác Giả <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-none border border-zinc-800 h-11 px-6">
                Trang Chủ
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // 5. Authorized Author Studio Layout
  return (
    <div className="dark flex h-[100dvh] overflow-hidden bg-black text-zinc-100 selection:bg-white selection:text-black font-sans">
      
      {/* Sidebar (Desktop) */}
      <div className="hidden md:flex flex-col z-20 w-[260px] h-full shrink-0 border-r border-zinc-900/50">
        <div className="flex flex-col h-full bg-black text-zinc-400 font-sans">
          <div className="h-24 flex items-center px-8 relative z-10 border-b border-zinc-900/50">
            <Link href="/studio" className="flex items-center gap-3">
              <Sparkles className="h-4 w-4 text-white" strokeWidth={1.5} />
              <span className="text-white font-mono tracking-[0.2em] text-[10px] uppercase">Hệ Thống Tác Giả</span>
            </Link>
          </div>
          
          <nav className="flex-1 px-4 py-8 space-y-1 relative z-10">
            <div className="px-4 mb-6">
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Điều Hướng</p>
            </div>
            
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <span 
                    className={`group flex items-center gap-4 px-4 py-2.5 text-[13px] font-medium transition-all relative ${
                      isActive 
                        ? "text-white bg-zinc-900/50" 
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-950"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white" />
                    )}
                    <item.icon className={`h-4 w-4 transition-colors ${isActive ? 'text-white' : 'text-zinc-600 group-hover:text-zinc-400'}`} strokeWidth={1.5} />
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-zinc-900/50 relative z-10 space-y-2">
            <Link href="/" className="block">
              <Button variant="ghost" className="w-full justify-start text-[13px] text-zinc-500 hover:bg-zinc-950 hover:text-zinc-300 transition-colors rounded-none">
                <Home className="mr-3 h-4 w-4" strokeWidth={1.5} />
                Về Trang Chủ
              </Button>
            </Link>
            <Button onClick={logout} variant="ghost" className="w-full justify-start text-[13px] text-zinc-500 hover:bg-zinc-950 hover:text-red-400 transition-colors rounded-none">
              <LogOut className="mr-3 h-4 w-4" strokeWidth={1.5} />
              Đăng Xuất
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="flex h-16 items-center justify-between border-b border-zinc-900 bg-black px-4 md:hidden sticky top-0 z-50">
        <Link href="/studio" className="flex items-center gap-2 font-bold">
          <Sparkles className="h-4 w-4 text-white" />
          <span className="font-mono text-xs uppercase tracking-widest text-white">Studio</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-zinc-400 rounded-none border border-zinc-800">
              <Home className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={logout} className="text-zinc-400 rounded-none border border-zinc-800">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full z-10 relative scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        <div className="p-6 md:p-12 lg:p-16 max-w-[1600px] mx-auto min-h-full flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
