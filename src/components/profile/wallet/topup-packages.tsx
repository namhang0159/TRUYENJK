"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Coins } from "lucide-react";
import { PaymentQRModal } from "./payment-qr-modal";

const PACKAGES = [
  { id: "pkg_0", price: 10000, coins: 100, popular: false, bonus: 0 },
  { id: "pkg_1", price: 20000, coins: 200, popular: false, bonus: 0 },
  { id: "pkg_2", price: 50000, coins: 500, popular: false, bonus: 0 },
  { id: "pkg_3", price: 100000, coins: 1000, popular: true, bonus: 0 },
  { id: "pkg_4", price: 200000, coins: 2000, popular: false, bonus: 0 },
  { id: "pkg_5", price: 500000, coins: 5000, popular: false, bonus: 0 },
  { id: "pkg_6", price: 1000000, coins: 10000, popular: false, bonus: 0 },
];

export function TopUpPackages() {
  const [selectedPackage, setSelectedPackage] = useState<typeof PACKAGES[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectPackage = (pkg: typeof PACKAGES[0]) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  return (
    <div id="topup-packages" className="scroll-mt-24 space-y-8">
      <div className="flex flex-col items-center justify-center text-center space-y-2 mb-8">
        <h2 className="text-3xl font-black tracking-tight">Chọn Gói Nạp</h2>
        <p className="text-muted-foreground text-lg">Nạp Coin an toàn, nhanh chóng. Nhận thêm ưu đãi khi nạp các gói lớn.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {PACKAGES.map((pkg) => (
          <Card 
            key={pkg.id}
            className={`group relative overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
              pkg.popular 
                ? "border-purple-500 shadow-purple-500/20 bg-gradient-to-b from-purple-50/50 to-white ring-2 ring-purple-500 ring-offset-2" 
                : "border-gray-200 hover:border-purple-300 bg-white"
            }`}
            onClick={() => handleSelectPackage(pkg)}
          >
            {pkg.popular && (
              <div className="absolute top-0 right-0 z-10">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] sm:text-xs font-extrabold px-4 py-1.5 rounded-bl-xl shadow-lg flex items-center tracking-wide uppercase">
                  <Zap className="w-3.5 h-3.5 mr-1.5 fill-current" />
                  PHỔ BIẾN NHẤT
                </div>
              </div>
            )}
            
            <CardContent className="p-8 relative">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className={`p-5 rounded-3xl transition-transform duration-300 group-hover:scale-110 ${pkg.popular ? "bg-purple-100/80 shadow-inner" : "bg-gray-50"}`}>
                  <Coins className={`w-12 h-12 ${pkg.popular ? "text-purple-600 drop-shadow-sm" : "text-yellow-500"}`} />
                </div>
                
                <div className="text-center w-full">
                  <div className="flex items-baseline justify-center gap-1.5">
                    <span className="text-4xl font-black text-gray-900 tracking-tight">{pkg.coins.toLocaleString("vi-VN")}</span>
                    <span className="font-bold text-gray-500 text-lg">Coin</span>
                  </div>
                  {pkg.bonus > 0 ? (
                    <Badge variant="secondary" className="mt-3 bg-green-100 text-green-700 hover:bg-green-200 border-none font-bold text-sm px-3 py-1">
                      Tặng thêm {pkg.bonus} Coin
                    </Badge>
                  ) : (
                    <div className="h-7 mt-3"></div>
                  )}
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2"></div>

                <div className="w-full">
                  <button className={`w-full py-3.5 rounded-xl font-extrabold text-lg transition-all duration-300 ${
                    pkg.popular 
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:from-purple-700 hover:to-indigo-700 active:scale-95" 
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200 active:scale-95 group-hover:bg-purple-50 group-hover:text-purple-700"
                  }`}>
                    {pkg.price.toLocaleString("vi-VN")} VND
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <PaymentQRModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPackage={selectedPackage}
      />
    </div>
  );
}
