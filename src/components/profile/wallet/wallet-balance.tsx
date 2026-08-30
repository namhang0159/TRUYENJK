"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, PlusCircle, History } from "lucide-react";
import { useWallet } from "@/hooks/use-finance";
import { Skeleton } from "@/components/ui/skeleton";

export function WalletBalance() {
  const { data: wallet, isLoading } = useWallet();
  const balance = wallet?.coin_balance || 0;

  const handleScrollToTopUp = () => {
    document.getElementById("topup-packages")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToHistory = () => {
    document.getElementById("transaction-history")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Card className="relative overflow-hidden border-none shadow-2xl bg-slate-900 group">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 opacity-90 transition-opacity duration-500 group-hover:opacity-100"></div>
      
      {/* Decorative patterns */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl mix-blend-overlay"></div>
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-300 opacity-20 rounded-full blur-2xl mix-blend-overlay animate-pulse"></div>

      <CardContent className="p-8 sm:p-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start space-y-3">
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
              Số dư khả dụng
            </h3>
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
                <Coins className="w-10 h-10 text-yellow-400 drop-shadow-md" />
              </div>
              {isLoading ? (
                <Skeleton className="w-40 h-14 bg-white/20 rounded-xl" />
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70 tracking-tighter drop-shadow-sm">
                    {balance.toLocaleString("vi-VN")}
                  </span>
                  <span className="text-2xl font-bold text-white/80">Coin</span>
                </div>
              )}
            </div>
            <p className="text-white/70 text-sm mt-2 max-w-sm text-center md:text-left">
              Tiền tệ chính thức để mở khóa chương VIP và ủng hộ các tác giả yêu thích của bạn.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto mt-4 md:mt-0">
            <Button
              size="lg"
              onClick={handleScrollToTopUp}
              className="bg-white text-purple-700 hover:bg-gray-100 font-bold w-full sm:w-auto h-14 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 text-lg"
            >
              <PlusCircle className="mr-2 h-6 w-6" />
              Nạp Coin Ngay
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleScrollToHistory}
              className="border-2 border-white/30 text-white bg-white/5 hover:bg-white/20 hover:text-white font-semibold w-full sm:w-auto h-14 px-8 rounded-xl backdrop-blur-sm transition-all hover:border-white/50"
            >
              <History className="mr-2 h-5 w-5" />
              Lịch Sử Giao Dịch
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
