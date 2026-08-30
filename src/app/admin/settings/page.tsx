"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminSettings, useUpdateSettings } from '@/hooks/use-admin';
import { Skeleton } from '@/components/ui/skeleton';
import { Database, Save, Zap } from 'lucide-react';

export default function AdminSettingsPage() {
  const { data: settings, isLoading } = useAdminSettings();
  const { mutate: updateSettings, isPending: isUpdating } = useUpdateSettings();

  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (settings) {
      const newFormData: Record<string, string> = {};
      settings.forEach((s: any) => {
        newFormData[s.key] = s.value;
      });
      setFormData(newFormData);
    }
  }, [settings]);

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = Object.entries(formData).map(([key, value]) => ({ key, value }));
    updateSettings(payload, {});
  };

  return (
    <div className="space-y-12 max-w-5xl">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-zinc-900">
        <div>
          <h1 className="text-4xl md:text-6xl font-outfit font-medium tracking-tight text-white mb-2 uppercase">
            Cài Đặt Hệ Thống
          </h1>
          <p className="text-zinc-500 font-mono text-sm tracking-wide uppercase">
            Thông Số Toàn Cầu // Tỉ Lệ Tài Chính // Chức Năng Cốt Lõi
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-[1px] bg-zinc-900 border border-zinc-900">
          {Array.from({ length: 4 }).map((_, i) => (
             <Skeleton key={i} className="h-24 w-full rounded-none bg-black" />
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-12">
          
          <div className="bg-zinc-900 border border-zinc-900">
            <div className="bg-black p-6 border-b border-zinc-900 flex items-center gap-4">
               <Database className="w-5 h-5 text-zinc-600" />
               <h2 className="text-lg font-outfit text-white tracking-tight uppercase">Thông Số Tài Chính</h2>
            </div>

            <div className="space-y-[1px] bg-zinc-900">
              {/* KV Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-[1px] bg-zinc-900 group">
                <div className="col-span-1 md:col-span-4 bg-black p-6 flex flex-col justify-center">
                    <Label htmlFor="REVENUE_SHARE_AUTHOR" className="text-zinc-400 font-mono text-[10px] uppercase tracking-widest flex items-center gap-2">
                        <Zap className="w-3 h-3 text-zinc-700" /> Tỉ Lệ Tác Giả (%)
                    </Label>
                    <p className="text-[10px] font-mono text-zinc-600 mt-2 uppercase tracking-widest">
                        {settings?.find((s: any) => s.key === 'REVENUE_SHARE_AUTHOR')?.description}
                    </p>
                </div>
                <div className="col-span-1 md:col-span-8 bg-black p-6 flex items-center">
                    <Input 
                        id="REVENUE_SHARE_AUTHOR" 
                        type="number"
                        value={formData['REVENUE_SHARE_AUTHOR'] || ''}
                        onChange={(e) => handleChange('REVENUE_SHARE_AUTHOR', e.target.value)}
                        className="bg-zinc-950 border-zinc-900 h-14 rounded-none text-xl text-white font-mono focus-visible:border-white focus-visible:ring-0 transition-colors w-full md:w-1/2"
                    />
                </div>
              </div>
              
              {/* KV Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-[1px] bg-zinc-900 group">
                <div className="col-span-1 md:col-span-4 bg-black p-6 flex flex-col justify-center">
                    <Label htmlFor="REVENUE_SHARE_PLATFORM" className="text-zinc-400 font-mono text-[10px] uppercase tracking-widest flex items-center gap-2">
                        <Zap className="w-3 h-3 text-zinc-700" /> Tỉ Lệ Nền Tảng (%)
                    </Label>
                    <p className="text-[10px] font-mono text-zinc-600 mt-2 uppercase tracking-widest">
                        {settings?.find((s: any) => s.key === 'REVENUE_SHARE_PLATFORM')?.description}
                    </p>
                </div>
                <div className="col-span-1 md:col-span-8 bg-black p-6 flex items-center">
                    <Input 
                        id="REVENUE_SHARE_PLATFORM" 
                        type="number"
                        value={formData['REVENUE_SHARE_PLATFORM'] || ''}
                        onChange={(e) => handleChange('REVENUE_SHARE_PLATFORM', e.target.value)}
                        className="bg-zinc-950 border-zinc-900 h-14 rounded-none text-xl text-white font-mono focus-visible:border-white focus-visible:ring-0 transition-colors w-full md:w-1/2"
                    />
                </div>
              </div>

              {/* KV Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-[1px] bg-zinc-900 group">
                <div className="col-span-1 md:col-span-4 bg-black p-6 flex flex-col justify-center">
                    <Label htmlFor="WITHDRAWAL_MIN_AMOUNT" className="text-zinc-400 font-mono text-[10px] uppercase tracking-widest flex items-center gap-2">
                        <Zap className="w-3 h-3 text-zinc-700" /> Rút Tiền Tối Thiểu (VNĐ)
                    </Label>
                    <p className="text-[10px] font-mono text-zinc-600 mt-2 uppercase tracking-widest">
                        {settings?.find((s: any) => s.key === 'WITHDRAWAL_MIN_AMOUNT')?.description}
                    </p>
                </div>
                <div className="col-span-1 md:col-span-8 bg-black p-6 flex items-center">
                    <Input 
                        id="WITHDRAWAL_MIN_AMOUNT" 
                        type="number"
                        value={formData['WITHDRAWAL_MIN_AMOUNT'] || ''}
                        onChange={(e) => handleChange('WITHDRAWAL_MIN_AMOUNT', e.target.value)}
                        className="bg-zinc-950 border-zinc-900 h-14 rounded-none text-xl text-white font-mono focus-visible:border-white focus-visible:ring-0 transition-colors w-full md:w-1/2"
                    />
                </div>
              </div>

              {/* KV Row 4 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-[1px] bg-zinc-900 group">
                <div className="col-span-1 md:col-span-4 bg-black p-6 flex flex-col justify-center">
                    <Label htmlFor="EXCHANGE_RATE" className="text-zinc-400 font-mono text-[10px] uppercase tracking-widest flex items-center gap-2">
                        <Zap className="w-3 h-3 text-zinc-700" /> Tỉ Giá Chuyển Đổi
                    </Label>
                    <p className="text-[10px] font-mono text-zinc-600 mt-2 uppercase tracking-widest">
                        {settings?.find((s: any) => s.key === 'EXCHANGE_RATE')?.description}
                    </p>
                </div>
                <div className="col-span-1 md:col-span-8 bg-black p-6 flex items-center">
                    <Input 
                        id="EXCHANGE_RATE" 
                        type="number"
                        value={formData['EXCHANGE_RATE'] || ''}
                        onChange={(e) => handleChange('EXCHANGE_RATE', e.target.value)}
                        className="bg-zinc-950 border-zinc-900 h-14 rounded-none text-xl text-white font-mono focus-visible:border-white focus-visible:ring-0 transition-colors w-full md:w-1/2"
                    />
                </div>
              </div>

            </div>
          </div>

          <div className="flex justify-end pt-8 border-t border-zinc-900">
            <Button 
              type="submit" 
              disabled={isUpdating} 
              className="bg-white hover:bg-zinc-200 text-black font-mono text-[10px] tracking-widest uppercase px-12 h-14 rounded-none w-full sm:w-auto transition-colors"
            >
              {isUpdating ? "ĐANG ĐỒNG BỘ..." : <><Save className="w-4 h-4 mr-3"/> LƯU CÀI ĐẶT</>}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
