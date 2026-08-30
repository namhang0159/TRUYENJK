"use client";

import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, Landmark, User, Clock, CheckCircle2, XCircle, ArrowRightLeft, Loader2, Info, FileText, Coins, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useAuthorRevenue, useAuthorWithdrawals, useCreateWithdrawal } from '@/hooks/use-author';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const VIETNAM_BANKS = [
  "Vietcombank (Ngân hàng Ngoại thương Việt Nam)",
  "VietinBank (Ngân hàng Công thương Việt Nam)",
  "BIDV (Ngân hàng Đầu tư và Phát triển Việt Nam)",
  "Agribank (Ngân hàng Nông nghiệp và Phát triển Nông thôn VN)",
  "Techcombank (Ngân hàng Kỹ thương Việt Nam)",
  "MB Bank (Ngân hàng Quân đội)",
  "ACB (Ngân hàng Á Châu)",
  "VPBank (Ngân hàng Việt Nam Thịnh vượng)",
  "TPBank (Ngân hàng Tiên Phong)",
  "Sacombank (Ngân hàng Sài Gòn Thương Tín)",
  "HDBank (Ngân hàng Phát triển TP.HCM)",
  "VIB (Ngân hàng Quốc tế)",
  "SeABank (Ngân hàng Đông Nam Á)",
  "MSB (Ngân hàng Hàng Hải)",
  "OCB (Ngân hàng Phương Đông)",
  "DongA Bank (Ngân hàng Đông Á)",
  "Eximbank (Ngân hàng Xuất Nhập khẩu Việt Nam)",
  "LPBank (Ngân hàng Bưu điện Liên Việt)",
  "Nam A Bank (Ngân hàng Nam Á)",
  "SHB (Ngân hàng Sài Gòn - Hà Nội)",
  "Kienlongbank (Ngân hàng Kiên Long)",
  "BVBank (Ngân hàng Bản Việt)",
  "OceanBank (Ngân hàng Đại Dương)",
  "CBBank (Ngân hàng Xây dựng)",
  "GPBank (Ngân hàng Dầu khí Toàn cầu)",
  "MoMo",
  "ZaloPay",
  "Viettel Money",
  "ShopeePay"
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
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function WithdrawalsPage() {
  const { data: stats, isLoading: isStatsLoading } = useAuthorRevenue();
  const { data: withdrawals, isLoading: isWithdrawalsLoading } = useAuthorWithdrawals();
  const createWithdrawal = useCreateWithdrawal();

  const [amount, setAmount] = useState<string>('');
  const [bankName, setBankName] = useState<string>('');
  const [bankAccountNumber, setBankAccountNumber] = useState<string>('');
  const [bankAccountName, setBankAccountName] = useState<string>('');

  useEffect(() => {
    if (stats?.bankInfo) {
      setBankName(stats.bankInfo.bank_name || '');
      setBankAccountNumber(stats.bankInfo.bank_account_number || '');
      setBankAccountName(stats.bankInfo.bank_account_name || '');
    }
  }, [stats]);

  const currentBalance = stats?.currentBalance || 0;
  // Tỉ lệ quy đổi 1 Xu = 100 VNĐ (tương đương nạp 10k = 100 coin)
  const exchangeRate = 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    
    if (!bankName) {
      alert("Vui lòng chọn ngân hàng.");
      return;
    }
    if (isNaN(numAmount) || numAmount < 50000) {
      alert("Số tiền rút tối thiểu là 50,000 Xu");
      return;
    }
    if (numAmount > currentBalance) {
      alert("Số dư không đủ!");
      return;
    }
    
    createWithdrawal.mutate({
      amount: numAmount,
      bankName,
      bankAccountNumber,
      bankAccountName
    }, {
      onSuccess: () => {
        alert("Đã gửi yêu cầu rút tiền thành công!");
        setAmount('');
      },
      onError: (error: any) => {
        alert(error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.");
      }
    });
  };

  if (isStatsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="border-b border-zinc-900 pb-4"
      >
        <h1 className="text-3xl font-light tracking-tight text-white flex items-center gap-3">
          Cổng Rút Tiền <ShieldCheck className="w-6 h-6 text-emerald-500" />
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest text-zinc-500 mt-2">
          Chuyển đổi doanh thu Xu thành tiền thật. Giao dịch an toàn, bảo mật và nhanh chóng.
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid lg:grid-cols-5 gap-8"
      >
        {/* Form tạo yêu cầu */}
        <motion.div variants={itemVariants} className="lg:col-span-3 border border-zinc-900 bg-black relative">
          
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-lg font-light text-white flex items-center gap-2">
                <Zap className="text-amber-500 w-4 h-4" /> Lệnh Chuyển Quỹ
              </h2>
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mt-2">Điền thông tin đích đến để khởi tạo quy trình thanh toán.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              
              <div className="border border-zinc-900 bg-black p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Số dư khả dụng:</span>
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-emerald-500" />
                    <span className="font-mono text-2xl font-light text-white">{currentBalance.toLocaleString()} <span className="text-emerald-500 text-lg">Xu</span></span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm px-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Tỉ lệ quy đổi:</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-300">1 Xu = {exchangeRate.toLocaleString()} VNĐ</span>
                </div>
              </div>

              <div className="space-y-5 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="bankName" className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                    <Landmark className="h-3 h-3" />
                    Ngân hàng / Ví điện tử
                  </Label>
                  <Select value={bankName} onValueChange={(val) => setBankName(val || "")}>
                    <SelectTrigger id="bankName" className="w-full bg-zinc-950 border-zinc-900 text-white focus:ring-0 focus:border-zinc-500 h-14 rounded-none font-mono text-xs uppercase tracking-widest">
                      <SelectValue placeholder="Chọn ngân hàng hoặc ví điện tử..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] bg-black border-zinc-900 text-zinc-300 rounded-none">
                      {VIETNAM_BANKS.map((bank) => (
                        <SelectItem key={bank} value={bank} className="hover:bg-zinc-900 focus:bg-zinc-900 focus:text-white font-mono text-[10px] uppercase tracking-widest rounded-none">{bank}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bankAccountNumber" className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                    <FileText className="h-3 w-3" />
                    Số tài khoản
                  </Label>
                  <Input 
                    id="bankAccountNumber" 
                    placeholder="Nhập số tài khoản" 
                    value={bankAccountNumber}
                    onChange={(e) => setBankAccountNumber(e.target.value)}
                    required 
                    className="bg-zinc-950 border-zinc-900 text-white focus:ring-0 focus:border-zinc-500 h-14 rounded-none font-mono text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bankAccountName" className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                    <User className="h-3 w-3" />
                    Tên chủ tài khoản
                  </Label>
                  <Input 
                    id="bankAccountName" 
                    placeholder="Tên in hoa không dấu (VD: NGUYEN VAN A)" 
                    value={bankAccountName}
                    onChange={(e) => setBankAccountName(e.target.value.toUpperCase())}
                    required 
                    className="bg-zinc-950 border-zinc-900 text-white focus:ring-0 focus:border-zinc-500 h-14 rounded-none font-mono text-xs uppercase"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-emerald-500">
                    <Coins className="h-3 w-3" />
                    Số Xu cần rút
                  </Label>
                  <div className="relative">
                    <Input 
                      id="amount" 
                      type="number"
                      placeholder="Tối thiểu 50,000"
                      min={50000}
                      max={currentBalance}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required 
                      className="bg-zinc-950 border-zinc-900 focus:border-emerald-500 text-emerald-500 text-lg font-mono h-14 rounded-none focus:ring-0 pl-4 pr-16"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-emerald-500 font-mono tracking-widest">
                      XU
                    </div>
                  </div>
                </div>
              </div>

              {Number(amount) > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Alert className="rounded-none bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 mt-6">
                    <ArrowRightLeft className="h-4 w-4 text-emerald-500" />
                    <AlertTitle className="font-mono text-[10px] uppercase tracking-widest">Quy đổi ước tính</AlertTitle>
                    <AlertDescription className="font-mono text-xs uppercase tracking-widest text-emerald-500/80 mt-2">
                      Bạn sẽ nhận được <strong className="text-emerald-500 text-sm">{(Number(amount) * exchangeRate).toLocaleString()} VNĐ</strong>
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <Button 
                type="submit" 
                disabled={createWithdrawal.isPending || currentBalance < 50000} 
                className="w-full rounded-none border-emerald-500/50 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black font-mono text-[10px] uppercase tracking-widest transition-colors h-14 mt-6"
              >
                {createWithdrawal.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ĐANG KHỞI TẠO...
                  </>
                ) : (
                  <>THỰC THI LỆNH <ArrowRight className="ml-2 w-4 h-4" /></>
                )}
              </Button>
            </form>
          </div>
        </motion.div>

        {/* Lịch sử yêu cầu */}
        <motion.div variants={itemVariants} className="lg:col-span-2 border border-zinc-900 bg-black h-fit">
          <div className="p-6 border-b border-zinc-900">
            <h2 className="text-lg font-light text-white flex items-center gap-2">
              <Clock className="text-indigo-500 w-4 h-4" /> Nhật Ký Giao Dịch
            </h2>
          </div>
          <div className="p-6">

            {isWithdrawalsLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-zinc-500" /></div>
            ) : (
              <div className="space-y-4 font-mono text-sm">
                {!withdrawals || withdrawals.length === 0 ? (
                  <div className="text-center py-12 text-zinc-500 font-mono text-[10px] uppercase tracking-widest border border-zinc-900 border-dashed">
                    Chưa có giao dịch nào
                  </div>
                ) : (
                  withdrawals.map((req: any) => (
                    <div key={req.id} className="p-4 border border-zinc-900 bg-black space-y-3 hover:border-zinc-700 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-mono text-emerald-500 text-sm">
                            - {Number(req.amount).toLocaleString()} Xu
                          </div>
                          <div className="text-[10px] text-zinc-500 mt-2 uppercase tracking-widest">
                            {new Date(req.requested_at).toLocaleString('vi-VN')}
                          </div>
                        </div>
                        <div>
                          {req.status === 'PENDING' && (
                            <span className="inline-flex items-center px-2 py-1 border border-amber-500/50 text-[10px] font-mono text-amber-500 bg-amber-500/10 uppercase tracking-widest">
                              <Clock className="w-3 h-3 mr-2" /> Đang xử lý
                            </span>
                          )}
                          {req.status === 'SUCCESS' && (
                            <span className="inline-flex items-center px-2 py-1 border border-emerald-500/50 text-[10px] font-mono text-emerald-500 bg-emerald-500/10 uppercase tracking-widest">
                              <CheckCircle2 className="w-3 h-3 mr-2" /> Hoàn tất
                            </span>
                          )}
                          {req.status === 'FAILED' && (
                            <span className="inline-flex items-center px-2 py-1 border border-red-500/50 text-[10px] font-mono text-red-500 bg-red-500/10 uppercase tracking-widest">
                              <XCircle className="w-3 h-3 mr-2" /> Từ chối
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-[10px] font-mono tracking-widest uppercase bg-zinc-950 p-3 border border-zinc-900 text-zinc-500">
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-600">ID:</span>
                          <span className="text-zinc-300">#{req.id.toString().padStart(6, '0')}</span>
                        </div>
                        {req.processed_at && (
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-900">
                            <span className="text-zinc-600">EXEC:</span>
                            <span className="text-emerald-500/80">{new Date(req.processed_at).toLocaleString('vi-VN')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
