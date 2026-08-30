"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDonate, useWallet } from "@/hooks/use-finance";
import { useAuth } from "@/hooks/use-auth";
import { Coins, Heart, Gem, Trophy, Gift } from "lucide-react";

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyId: number;
}

const DONATE_ITEMS = [
  { id: "flower", name: "Hoa Hồng", coins: 10, icon: Heart, color: "text-red-500" },
  { id: "candy", name: "Kẹo Ngọt", coins: 50, icon: Gift, color: "text-pink-500" },
  { id: "gem", name: "Kim Cương", coins: 100, icon: Gem, color: "text-blue-500" },
  { id: "trophy", name: "Cúp Vàng", coins: 500, icon: Trophy, color: "text-yellow-500" },
];

export function DonateModal({ isOpen, onClose, storyId }: DonateModalProps) {
  const { isAuthenticated } = useAuth();
  const { data: wallet } = useWallet();
  const { mutate: donate, isPending } = useDonate();
  
  const [selectedItem, setSelectedItem] = useState(DONATE_ITEMS[0]);
  const [message, setMessage] = useState("");

  const handleDonate = () => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để tặng quà.");
      return;
    }
    
    if (wallet?.coin_balance < selectedItem.coins) {
      alert("Số dư không đủ. Vui lòng nạp thêm Xu.");
      return;
    }

    donate({ 
      story_id: storyId, 
      item_name: selectedItem.name, 
      coin_amount: selectedItem.coins, 
      message 
    }, {
      onSuccess: () => {
        alert("Tặng quà thành công! Cảm ơn bạn đã ủng hộ tác giả.");
        onClose();
        setMessage("");
      },
      onError: (err: any) => {
        alert(err.response?.data?.message || "Có lỗi xảy ra");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Gift className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-xl">Tặng Quà Cho Tác Giả</DialogTitle>
          <DialogDescription className="pt-2 text-base">
            Ủng hộ tác giả để có thêm động lực ra chương mới.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 my-4">
          {DONATE_ITEMS.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedItem.id === item.id;
            return (
              <div 
                key={item.id} 
                onClick={() => setSelectedItem(item)}
                className={`p-4 border rounded-xl cursor-pointer text-center flex flex-col items-center gap-2 transition-all ${
                  isSelected ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "hover:border-primary/50"
                }`}
              >
                <Icon className={`w-8 h-8 ${item.color}`} />
                <span className="font-semibold text-sm">{item.name}</span>
                <span className="text-xs font-bold text-yellow-500 flex items-center gap-1">
                  {item.coins} <Coins className="w-3 h-3" />
                </span>
              </div>
            );
          })}
        </div>

        <Textarea 
          placeholder="Gửi lời nhắn đến tác giả..." 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="resize-none"
        />

        <div className="text-sm text-center mb-2 mt-4 text-muted-foreground flex items-center justify-center gap-1">
          Số dư của bạn: <span className="font-medium text-foreground">{wallet?.coin_balance || 0}</span> <Coins className="w-3 h-3" />
        </div>

        <DialogFooter>
          <Button onClick={handleDonate} disabled={isPending} className="w-full bg-primary hover:bg-primary/90 font-bold h-11">
            {isPending ? "Đang xử lý..." : `Tặng ${selectedItem.name}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
