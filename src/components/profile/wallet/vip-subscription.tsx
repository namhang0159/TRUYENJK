"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Headphones, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/hooks/use-auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function VipSubscription() {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const subscribeMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.post("/vip/subscribe");
      return data;
    },
    onSuccess: (data) => {
      setSuccessMsg("Đăng ký Gói VIP thành công! Bạn có thể nghe Audio không giới hạn.");
      setErrorMsg("");
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      
      // Update local auth store immediately
      if (data?.data) {
        updateUser({ 
          tier: data.data.tier, 
          vip_expiry: data.data.vip_expiry 
        });
      }
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMsg(""), 5000);
    },
    onError: (error: any) => {
      setErrorMsg(error?.response?.data?.message || "Có lỗi xảy ra khi đăng ký VIP");
      setSuccessMsg("");
    }
  });

  const handleConfirm = () => {
    setIsModalOpen(false);
    subscribeMutation.mutate();
  };

  const isVip = user?.tier === "VIP_USER";

  let remainingDays = 0;
  if (isVip && user?.vip_expiry) {
    const expiry = new Date(user.vip_expiry);
    const now = new Date();
    const diffTime = Math.max(0, expiry.getTime() - now.getTime());
    remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  return (
    <div id="vip-subscription" className="scroll-mt-24 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Đặc Quyền VIP</h2>
      </div>

      <Card className="relative overflow-hidden border-yellow-500/30 bg-slate-950 text-white shadow-2xl">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-60 h-60 bg-orange-500/10 rounded-full blur-3xl"></div>
        
        <div className="absolute top-0 right-0">
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black text-xs font-bold px-4 py-1.5 rounded-bl-xl shadow-lg flex items-center">
            <Headphones className="w-3.5 h-3.5 mr-1.5" />
            AUDIO KHÔNG GIỚI HẠN
          </div>
        </div>

        <CardContent className="p-8 sm:p-10 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Icon & Title */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-5 flex-1">
              <div className="p-4 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-2xl border border-yellow-500/30 backdrop-blur-sm">
                <Headphones className="w-12 h-12 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
                  Trải Nghiệm Đỉnh Cao
                  {isVip && (
                    <Badge variant="outline" className="border-yellow-400/50 text-yellow-400 bg-yellow-400/10 mt-2 sm:mt-0">Đang kích hoạt {remainingDays > 0 ? `(Còn ${remainingDays} ngày)` : ""}</Badge>
                  )}
                </h3>
                <p className="text-gray-400 mt-3 max-w-md text-base leading-relaxed">
                  Đặc quyền sinh ra dành cho bạn: Chuyển đổi Văn bản thành Giọng đọc AI siêu thực, nghe trọn vẹn mọi tác phẩm mà không giới hạn.
                </p>
              </div>
            </div>

            {/* Features list */}
            <div className="flex-1 space-y-4 w-full">
              {[
                "Nghe audio không giới hạn 24/7",
                "Kho giọng đọc AI đa dạng, truyền cảm",
                "Trải nghiệm mượt mà, không quảng cáo",
                "Gia hạn dễ dàng bằng Coin trong ví"
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center text-gray-300 font-medium group">
                  <div className="mr-4 p-1 rounded-full bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-yellow-400" />
                  </div>
                  {feature}
                </div>
              ))}
            </div>

            {/* Action Box */}
            <div className="flex-shrink-0 flex flex-col items-center justify-center p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 w-full lg:w-auto hover:bg-white/10 transition-colors">
              <div className="text-center mb-6">
                <span className="text-5xl font-black text-white tracking-tight">800</span>
                <span className="text-xl font-bold text-yellow-500 ml-2">Coin</span>
                <div className="text-sm text-gray-400 mt-2 font-medium tracking-wide uppercase">/ 30 ngày</div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                disabled={subscribeMutation.isPending}
                className={`w-full lg:w-56 py-3.5 px-6 rounded-xl font-bold text-black shadow-lg shadow-yellow-500/20 transition-all transform hover:scale-105 active:scale-95 ${
                  subscribeMutation.isPending 
                    ? "bg-gray-500 cursor-not-allowed" 
                    : "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500"
                }`}
              >
                {subscribeMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang xử lý...
                  </span>
                ) : isVip ? (
                  "Gia hạn VIP"
                ) : (
                  "Đăng ký ngay"
                )}
              </button>
            </div>
          </div>
          
          {/* Messages */}
          {errorMsg && (
            <div className="mt-6 p-4 bg-red-500/10 text-red-400 rounded-xl text-center font-medium border border-red-500/20 animate-in fade-in slide-in-from-bottom-2">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mt-6 p-4 bg-green-500/10 text-green-400 rounded-xl text-center font-medium border border-green-500/20 animate-in fade-in slide-in-from-bottom-2">
              {successMsg}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
              Xác nhận {isVip ? "gia hạn" : "đăng ký"} Gói VIP
            </DialogTitle>
            <DialogDescription className="pt-4 text-base">
              Bạn đang chuẩn bị {isVip ? "gia hạn" : "đăng ký"} Gói VIP Audio với giá <strong>800 Coin</strong> cho <strong>30 ngày</strong>. 
              <br /><br />
              Số Coin này sẽ được trừ trực tiếp vào Ví Coin của bạn. Bạn có chắc chắn muốn tiếp tục không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Hủy bỏ
            </Button>
            <Button onClick={handleConfirm} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold">
              Xác nhận thanh toán
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
