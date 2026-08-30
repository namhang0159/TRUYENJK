"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Ban, CheckCircle2, MoreVertical, Coins, ShieldAlert, ArrowRight, Activity } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAdminUsers, useAdminUserDetail, useToggleUserStatus, useManualTransaction } from '@/hooks/use-admin';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/use-debounce';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState("all");
  const [verifiedFilter, setVerifiedFilter] = useState("all");
  
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const { data, isLoading } = useAdminUsers(
    page, 
    20, 
    debouncedSearch, 
    statusFilter === "all" ? "" : statusFilter, 
    verifiedFilter === "all" ? "" : verifiedFilter
  );
  
  const { data: userDetail, isLoading: isDetailLoading } = useAdminUserDetail(selectedUserId);
  const { mutate: toggleStatus, isPending: isToggling } = useToggleUserStatus();
  const { mutate: manualTransaction, isPending: isTransactionPending } = useManualTransaction();

  const [txAmount, setTxAmount] = useState("");
  const [txType, setTxType] = useState<'ADD' | 'SUBTRACT'>('ADD');
  const [txDescription, setTxDescription] = useState("");
  const [showTxForm, setShowTxForm] = useState(false);

  const handleTxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !txAmount) return;
    
    manualTransaction(
      { userId: selectedUserId, amount: Number(txAmount), type: txType, description: txDescription },
      { 
        onSuccess: () => {
          setShowTxForm(false);
          setTxAmount("");
          setTxDescription("");
        },
        onError: (err: any) => {
          alert("Transaction failed: " + (err.response?.data?.message || err.message));
        }
      }
    );
  };

  const handleToggle = (userId: number, isActive: boolean) => {
    const action = isActive ? "ĐÌNH CHỈ" : "KHÔI PHỤC";
    if (confirm(`THỰC THI BẢO MẬT: ${action} NGƯỜI DÙNG #${userId}?`)) {
      toggleStatus(userId);
    }
  };

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-zinc-900">
        <div>
          <h1 className="text-4xl md:text-6xl font-outfit font-medium tracking-tight text-white mb-2 uppercase">
            Quản Lý Người Dùng
          </h1>
          <p className="text-zinc-500 font-mono text-sm tracking-wide uppercase">
            Quản Lý Danh Tính // Cấp Phép Bảo Mật // Trạng Thái Tài Khoản
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-[1px] w-full lg:w-auto bg-zinc-900 border border-zinc-900">
          <div className="relative w-full sm:w-64 bg-black">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
            <Input 
              placeholder="TÌM KIẾM THEO EMAIL..." 
              className="pl-12 bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-zinc-700 h-12 rounded-none font-mono text-xs tracking-widest uppercase"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v || "all"); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-40 bg-black border-none focus:ring-0 h-12 text-zinc-500 rounded-none font-mono text-xs tracking-widest uppercase">
              <SelectValue placeholder="TRẠNG THÁI" />
            </SelectTrigger>
            <SelectContent className="bg-black border border-zinc-900 rounded-none text-zinc-400 font-mono text-xs tracking-widest uppercase">
              <SelectItem value="all">Tất Cả</SelectItem>
              <SelectItem value="active">Hoạt Động</SelectItem>
              <SelectItem value="inactive">Đình Chỉ</SelectItem>
            </SelectContent>
          </Select>
          <Select value={verifiedFilter} onValueChange={(v) => { setVerifiedFilter(v || "all"); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-48 bg-black border-none focus:ring-0 h-12 text-zinc-500 rounded-none font-mono text-xs tracking-widest uppercase">
              <SelectValue placeholder="XÁC THỰC" />
            </SelectTrigger>
            <SelectContent className="bg-black border border-zinc-900 rounded-none text-zinc-400 font-mono text-xs tracking-widest uppercase">
              <SelectItem value="all">Tất Cả</SelectItem>
              <SelectItem value="true">Đã Xác Thực</SelectItem>
              <SelectItem value="false">Chưa Xác Thực</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="relative z-10 bg-zinc-900 border border-zinc-900">
        <div className="grid grid-cols-12 gap-[1px] bg-zinc-900 border-b border-zinc-900">
            <div className="col-span-1 bg-black p-4 text-[10px] font-mono text-zinc-600 tracking-widest uppercase">ID</div>
            <div className="col-span-5 bg-black p-4 text-[10px] font-mono text-zinc-600 tracking-widest uppercase">Danh Tính</div>
            <div className="col-span-3 bg-black p-4 text-[10px] font-mono text-zinc-600 tracking-widest uppercase">Xác Thực</div>
            <div className="col-span-2 bg-black p-4 text-[10px] font-mono text-zinc-600 tracking-widest uppercase">Trạng Thái</div>
            <div className="col-span-1 bg-black p-4"></div>
        </div>

        {isLoading ? (
          <div className="space-y-[1px] bg-zinc-900">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-none bg-black" />
            ))}
          </div>
        ) : (
          <div className="space-y-[1px] bg-zinc-900">
            <AnimatePresence>
              {data?.users?.map((user: any) => (
                <div 
                  key={user.id}
                  className="grid grid-cols-12 gap-[1px] bg-zinc-900 group"
                >
                  <div className="col-span-1 bg-black p-4 flex items-center">
                    <span className="text-xs font-mono text-zinc-500">{user.id.toString().padStart(4, '0')}</span>
                  </div>
                  <div className="col-span-5 bg-black p-4 flex flex-col justify-center">
                     <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">{user.email}</span>
                  </div>
                  <div className="col-span-3 bg-black p-4 flex items-center">
                    {user.email_verified ? (
                      <span className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase border border-zinc-800 px-2 py-1">Đã Xác Thực</span>
                    ) : (
                      <span className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase border border-zinc-900 px-2 py-1">Chờ Duyệt</span>
                    )}
                  </div>
                  <div className="col-span-2 bg-black p-4 flex items-center">
                    {user.is_active ? (
                      <span className="text-[10px] font-mono text-white tracking-widest uppercase border border-zinc-700 px-2 py-1 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-white rounded-full"></div> Hoạt Động</span>
                    ) : (
                      <span className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase border border-zinc-900 px-2 py-1 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-zinc-800 rounded-full"></div> Đình Chỉ</span>
                    )}
                  </div>
                  <div className="col-span-1 bg-black p-4 flex items-center justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedUserId(user.id)}
                      className="rounded-none border border-transparent hover:border-zinc-800 hover:bg-zinc-950 text-zinc-500 hover:text-white transition-all h-8 px-2 font-mono text-[10px] tracking-widest uppercase"
                    >
                      KIỂM TRA
                    </Button>
                  </div>
                </div>
              ))}
            </AnimatePresence>
            {!isLoading && (!data?.users || data.users.length === 0) && (
              <div className="col-span-12 py-24 flex flex-col items-center justify-center bg-black">
                <ShieldAlert className="h-6 w-6 text-zinc-800 mb-4" />
                <p className="text-zinc-600 font-mono text-[10px] tracking-widest uppercase">Không tìm thấy người dùng nào.</p>
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

      <Sheet open={!!selectedUserId} onOpenChange={(open) => !open && setSelectedUserId(null)}>
        <SheetContent className="sm:max-w-md bg-black border-l border-zinc-900 p-0 overflow-hidden flex flex-col rounded-none">
          <SheetHeader className="p-8 border-b border-zinc-900 flex-shrink-0 text-left space-y-0">
            <SheetTitle className="text-2xl font-outfit tracking-tight text-white uppercase">Hồ Sơ Danh Tính</SheetTitle>
            <p className="text-zinc-600 font-mono text-[10px] tracking-widest uppercase mt-2">UID: {selectedUserId?.toString().padStart(5, '0')}</p>
          </SheetHeader>
          
          <div className="p-8 flex-1 overflow-y-auto">
            {isDetailLoading ? (
              <div className="space-y-1 bg-zinc-900">
                <Skeleton className="h-16 w-full bg-black rounded-none" />
                <Skeleton className="h-16 w-full bg-black rounded-none" />
                <Skeleton className="h-32 w-full bg-black rounded-none mt-8" />
              </div>
            ) : userDetail ? (
              <div className="space-y-1 bg-zinc-900 border border-zinc-900">
                
                {/* Contact Data */}
                <div className="bg-black p-6">
                    <div className="text-[10px] text-zinc-600 font-mono mb-4 uppercase tracking-widest">Liên Hệ Chính</div>
                    <div className="font-medium text-white">{userDetail.email}</div>
                </div>
                
                {/* Status Data */}
                <div className="bg-black p-6">
                    <div className="text-[10px] text-zinc-600 font-mono mb-4 uppercase tracking-widest">Trạng Thái Hệ Thống</div>
                    {userDetail.is_active ? (
                        <span className="text-white flex items-center text-xs font-mono tracking-widest uppercase"><CheckCircle2 className="w-4 h-4 mr-3 text-zinc-500"/> Hoạt Động</span>
                    ) : (
                        <span className="text-zinc-500 flex items-center text-xs font-mono tracking-widest uppercase"><Ban className="w-4 h-4 mr-3"/> Đình Chỉ</span>
                    )}
                </div>

                {/* Economy Data */}
                <div className="bg-black p-6">
                    <div className="text-[10px] text-zinc-600 font-mono mb-4 uppercase tracking-widest">Trạng Thái Tài Chính</div>
                    <div className="font-outfit text-white text-3xl flex items-center gap-3">
                        <Coins className="w-6 h-6 text-zinc-600" />
                        {userDetail.reader?.wallet?.balance?.toLocaleString() || 0}
                    </div>
                </div>

                {/* Action: Toggle Status */}
                <div className="bg-black p-6">
                    <Button 
                      variant="ghost" 
                      className="w-full h-12 rounded-none bg-zinc-950 border border-zinc-900 text-white hover:bg-white hover:text-black transition-all font-mono text-[10px] tracking-widest uppercase" 
                      onClick={() => handleToggle(userDetail.id, userDetail.is_active)}
                      disabled={isToggling}
                    >
                      {userDetail.is_active ? 'ĐÌNH CHỈ NGƯỜI DÙNG' : 'KHÔI PHỤC NGƯỜI DÙNG'}
                    </Button>
                </div>
                
                {/* Action: Manual Transaction */}
                <div className="bg-black p-6">
                  {!showTxForm ? (
                    <Button 
                      variant="ghost" 
                      className="w-full h-12 rounded-none bg-transparent border border-zinc-900 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all font-mono text-[10px] tracking-widest uppercase" 
                      onClick={() => setShowTxForm(true)}
                    >
                      CHỈNH SỬA TÀI CHÍNH <ArrowRight className="w-3 h-3 ml-2" />
                    </Button>
                  ) : (
                    <form 
                      onSubmit={handleTxSubmit} 
                      className="space-y-4"
                    >
                      <h4 className="font-mono text-[10px] text-zinc-400 tracking-widest uppercase mb-6 flex items-center"><Activity className="w-3 h-3 mr-2"/> Ghi Đè Thông Số</h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">Thao Tác</Label>
                          <Select value={txType} onValueChange={(v: any) => setTxType(v || 'ADD')}>
                            <SelectTrigger className="bg-zinc-950 border-zinc-900 h-12 rounded-none text-white font-mono text-[10px] tracking-widest uppercase">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-black border-zinc-900 text-zinc-400 rounded-none font-mono text-[10px] tracking-widest uppercase">
                              <SelectItem value="ADD" className="text-white">CỘNG TIỀN (+)</SelectItem>
                              <SelectItem value="SUBTRACT" className="text-white">TRỪ TIỀN (-)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">Số Tiền</Label>
                          <Input 
                            type="number" 
                            required 
                            min="1" 
                            value={txAmount} 
                            onChange={(e) => setTxAmount(e.target.value)} 
                            className="bg-zinc-950 border-zinc-900 h-12 rounded-none text-white placeholder:text-zinc-700 font-mono text-xs" 
                            placeholder="0" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">Ghi Chú Giao Dịch</Label>
                          <Input 
                            value={txDescription} 
                            onChange={(e) => setTxDescription(e.target.value)} 
                            className="bg-zinc-950 border-zinc-900 h-12 rounded-none text-white placeholder:text-zinc-700 font-mono text-xs" 
                            placeholder="LÝ DO..." 
                          />
                        </div>
                      </div>
                      <div className="flex gap-[1px] bg-zinc-900 border border-zinc-900 mt-6">
                        <Button type="button" variant="ghost" className="flex-1 rounded-none bg-black text-zinc-500 hover:text-white hover:bg-zinc-950 font-mono text-[10px] tracking-widest uppercase h-12" onClick={() => setShowTxForm(false)}>HỦY</Button>
                        <Button type="submit" disabled={isTransactionPending} className="flex-1 rounded-none bg-white hover:bg-zinc-200 text-black font-mono text-[10px] tracking-widest uppercase h-12">
                          THỰC THI
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
