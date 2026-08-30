"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, Coins } from "lucide-react";

interface VipUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
  price: number;
  userCoins: number;
  isAuthenticated?: boolean;
  isLoading?: boolean;
}

export function VipUnlockModal({ isOpen, onClose, onUnlock, price, userCoins, isAuthenticated = true, isLoading = false }: VipUnlockModalProps) {
  const isEnoughCoins = userCoins >= price;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-yellow-500" />
          </div>
          <DialogTitle className="text-xl">Mở Khóa Chương VIP</DialogTitle>
          <DialogDescription className="pt-2 text-base">
            Chương này yêu cầu trả phí để tiếp tục đọc hoặc nghe Audio.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted p-4 rounded-lg my-4 flex items-center justify-between">
          <span className="font-medium">Giá mở khóa:</span>
          <span className="font-bold text-yellow-500 flex items-center gap-1 text-lg">
            {price} <Coins className="w-5 h-5" />
          </span>
        </div>

        <div className="text-sm text-center mb-4 text-muted-foreground flex items-center justify-center gap-1">
          Số dư hiện tại: <span className="font-medium text-foreground">{userCoins}</span> <Coins className="w-3 h-3" />
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          {!isAuthenticated ? (
            <Button onClick={() => window.location.href = "/login"} className="w-full bg-primary font-bold h-11">
              Đăng nhập để tiếp tục
            </Button>
          ) : isEnoughCoins ? (
            <Button onClick={onUnlock} disabled={isLoading} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-11">
              {isLoading ? "Đang xử lý..." : "Mở khóa ngay"}
            </Button>
          ) : (
            <Button onClick={() => alert("Chuyển đến trang Nạp Coin")} className="w-full font-bold h-11">
              Nạp thêm Coin
            </Button>
          )}
          <Button variant="ghost" onClick={onClose} className="w-full">
            Quay lại
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
