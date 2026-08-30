"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useCreateDeposit } from "@/hooks/use-finance";

interface PaymentQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: {
    id: string;
    coins: number;
    price: number;
  } | null;
}

export function PaymentQRModal({ isOpen, onClose, selectedPackage }: PaymentQRModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const { mutateAsync: createDeposit } = useCreateDeposit();

  useEffect(() => {
    if (isOpen && selectedPackage) {
      setIsProcessing(true);
      setError("");
      
      createDeposit({
        amount: selectedPackage.price,
        payment_method: "VNPAY"
      })
      .then(res => {
        if (res.data && res.data.paymentUrl) {
          window.location.href = res.data.paymentUrl;
        } else {
          setError("Không lấy được link thanh toán. Vui lòng thử lại.");
          setIsProcessing(false);
        }
      })
      .catch(err => {
        console.error("Failed to create deposit", err);
        setError("Có lỗi xảy ra khi kết nối với cổng thanh toán.");
        setIsProcessing(false);
      });
    }
  }, [isOpen, selectedPackage]);

  if (!selectedPackage) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md border-0 shadow-2xl p-0 overflow-hidden bg-black text-white">
        <div className="h-2 w-full bg-blue-600"></div>
        
        <div className="p-6">
          <DialogHeader className="text-center mb-6">
            <DialogTitle className="text-2xl font-bold">Thanh Toán VNPay</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Hệ thống đang chuyển hướng bạn đến cổng thanh toán VNPay an toàn.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center space-y-6 py-8">
            {isProcessing ? (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                <p className="text-lg font-medium">Đang tạo giao dịch...</p>
                <div className="w-full space-y-3 bg-zinc-900 p-4 rounded-lg text-sm border border-zinc-800">
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                    <span className="text-zinc-500">Số tiền nạp:</span>
                    <span className="font-bold text-lg text-blue-400">{selectedPackage.price.toLocaleString('vi-VN')} VND</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-zinc-500">Nhận được:</span>
                    <span className="font-semibold text-emerald-400">{selectedPackage.coins} Coin</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-red-400 space-y-4">
                <p>{error}</p>
                <button onClick={onClose} className="px-4 py-2 bg-zinc-800 rounded-md hover:bg-zinc-700 transition-colors">
                  Đóng
                </button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

