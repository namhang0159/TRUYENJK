"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BookText,
  PenTool,
  LineChart,
  LogOut,
  Sparkles,
  Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const navItems = [
    { name: 'Tổng quan', href: '/studio', icon: LayoutDashboard },
    { name: 'Truyện của tôi', href: '/studio/stories', icon: BookText },
    { name: 'Tạo truyện mới', href: '/studio/stories/new', icon: PenTool },
    { name: 'Doanh thu', href: '/studio/revenue', icon: LineChart },
    { name: 'Rút tiền', href: '/studio/withdrawals', icon: Wallet },
  ];

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-black text-zinc-100 selection:bg-white selection:text-black font-sans">
      
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
          
          <div className="p-4 border-t border-zinc-900/50 relative z-10">
            <Button onClick={() => router.push("/")} variant="ghost" className="w-full justify-start text-[13px] text-zinc-500 hover:bg-zinc-950 hover:text-zinc-300 transition-colors rounded-none">
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
        <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="text-zinc-400 rounded-none border border-zinc-800">
          <LogOut className="h-4 w-4" />
        </Button>
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
