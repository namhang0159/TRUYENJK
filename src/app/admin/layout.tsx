"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { usePermission, Permission } from '@/hooks/use-permission';
import { LayoutDashboard, Book, Users, ShieldAlert, LogOut, Menu, Tags, CreditCard, Settings, Command, FileText, Landmark, UserPlus, TrendingUp, Flag, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { motion } from 'framer-motion';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { hasPermission } = usePermission();
  
  // Mounted state for hydration fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-black text-white font-sans selection:bg-white selection:text-black">
        <motion.div 
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          className="text-center space-y-6 max-w-sm px-6"
        >
          <div className="mx-auto flex items-center justify-center mb-6">
             <ShieldAlert className="h-8 w-8 text-zinc-500" strokeWidth={1.5} />
          </div>
          <h1 className="text-xl font-medium tracking-tight text-white uppercase font-outfit">Truy Cập Bị Từ Chối</h1>
          <p className="text-zinc-500 text-sm font-mono tracking-wide">LỖI XÁC THỰC : KHU VỰC ADMIN</p>
          <Link href="/" className="block pt-8">
            <Button variant="ghost" className="w-full text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors rounded-none border border-zinc-800">
              Trở Về Trang Chủ
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const routes = [
    { href: "/dashboard", label: "Tổng Quan", icon: LayoutDashboard },
    { href: "/stories", label: "Quản Lý Truyện", icon: Book, permission: 'APPROVE_STORY' as Permission },
    { href: "/chapters", label: "Duyệt Chương", icon: FileText, permission: 'APPROVE_STORY' as Permission },
    { href: "/authors", label: "Duyệt Tác Giả", icon: UserPlus, permission: 'APPROVE_STORY' as Permission },
    { href: "/users", label: "Quản Lý Người Dùng", icon: Users, permission: 'BAN_USER' as Permission },
    { href: "/categories", label: "Thể Loại", icon: Tags, permission: 'APPROVE_STORY' as Permission },
    { href: "/transactions", label: "Giao Dịch", icon: CreditCard, permission: 'VIEW_REVENUE' as Permission },
    { href: "/payouts", label: "Rút Tiền", icon: Landmark, permission: 'VIEW_REVENUE' as Permission },
    { href: "/revenue", label: "Doanh Thu", icon: TrendingUp, permission: 'VIEW_REVENUE' as Permission },
    { href: "/reports", label: "Báo Cáo", icon: Flag, permission: 'HIDE_COMMENT' as Permission },
    { href: "/audios", label: "Quản Lý Audio", icon: Headphones, permission: 'APPROVE_STORY' as Permission },
    { href: "/settings", label: "Cài Đặt", icon: Settings },
  ].filter(route => !route.permission || hasPermission(route.permission));

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-black text-zinc-400 font-sans border-r border-zinc-900/50">
      <div className="h-24 flex items-center px-8 relative z-10">
        <h2 className="flex items-center gap-3">
          <Command className="h-4 w-4 text-white" strokeWidth={1.5} />
          <span className="text-white font-mono tracking-[0.2em] text-[10px] uppercase">Hệ Thống Admin</span>
        </h2>
      </div>
      <nav className="flex-1 px-4 py-8 space-y-1 relative z-10">
        <div className="px-4 mb-6">
          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Điều Hướng</p>
        </div>
        {routes.map((route) => {
          const isActive = pathname === `/admin${route.href}` || (route.href === '/dashboard' && pathname === '/admin');
          return (
            <Link key={route.href} href={`/admin${route.href}`}>
              <span 
                className={`group flex items-center gap-4 px-4 py-2.5 text-[13px] font-medium transition-all relative ${
                  isActive 
                    ? "text-white bg-zinc-900/50" 
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-950"
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeAdminTab"
                    className="absolute left-0 top-0 bottom-0 w-0.5 bg-white"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <route.icon className={`h-4 w-4 transition-colors ${isActive ? 'text-white' : 'text-zinc-600 group-hover:text-zinc-400'}`} strokeWidth={1.5} />
                {route.label}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-zinc-900/50 relative z-10">
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start text-[13px] text-zinc-500 hover:bg-zinc-950 hover:text-zinc-300 transition-colors rounded-none">
            <LogOut className="mr-3 h-4 w-4" strokeWidth={1.5} />
            Đăng Xuất
          </Button>
        </Link>
      </div>
    </div>
  );

  if (!mounted) return null;

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-black text-zinc-100 selection:bg-white selection:text-black font-sans">
      
      {/* Floating Sidebar (Desktop) */}
      <div className="hidden md:flex flex-col z-20 w-[260px] h-full shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger 
          render={<Button variant="ghost" size="icon" className="md:hidden absolute top-6 left-6 z-50 text-white rounded-none border border-zinc-800 bg-black" />}
        >
          <Menu className="h-4 w-4" />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[260px] border-r border-zinc-900 bg-black">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full z-10 relative scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="p-6 md:p-12 lg:p-16 max-w-[1600px] mx-auto pt-24 md:pt-12 min-h-full flex flex-col"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

