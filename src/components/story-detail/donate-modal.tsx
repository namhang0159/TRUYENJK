"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useDonate, useWallet, useGifts, GiftItem } from "@/hooks/use-finance";
import { useAuth } from "@/hooks/use-auth";
import {
  Coins,
  Heart,
  Gem,
  Trophy,
  Gift,
  Crown,
  Rocket,
  Castle,
  Flame,
  Sparkles,
  Coffee,
  Zap,
  Star,
  Shield,
  PartyPopper,
  Disc,
  Beer,
  Smile,
  Wand2,
  Check,
  CreditCard,
  Send,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import confetti from "canvas-confetti";

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyId: number | string;
}

const AVAILABLE_ICONS: Record<string, React.ElementType> = {
  Gift,
  Heart,
  Coffee,
  Gem,
  Trophy,
  Crown,
  Rocket,
  Castle,
  Flame,
  Sparkles,
  Zap,
  Star,
  Shield,
  PartyPopper,
  Disc,
  Beer,
  Smile,
  Wand2,
};

const DEFAULT_FALLBACK_GIFTS: GiftItem[] = [
  {
    id: 1,
    name: "Hoa Hồng",
    code: "rose",
    coin_price: 10,
    icon: "Heart",
    tier: "COMMON",
    color: "text-rose-500",
    description: "Một đóa hồng tươi thắm cổ vũ tác giả tiếp tục sáng tác",
    sort_order: 1,
    is_active: true,
  },
  {
    id: 2,
    name: "Tách Cà Phê",
    code: "coffee",
    coin_price: 20,
    icon: "Coffee",
    tier: "COMMON",
    color: "text-amber-500",
    description: "Ly cà phê thơm lừng cho đêm thức viết truyện",
    sort_order: 2,
    is_active: true,
  },
  {
    id: 3,
    name: "Trà Sữa Topping",
    code: "bubble_tea",
    coin_price: 50,
    icon: "Gift",
    tier: "RARE",
    color: "text-pink-500",
    description: "Trà sữa ngọt ngào tăng 200% năng lượng bão chương",
    sort_order: 3,
    is_active: true,
  },
  {
    id: 4,
    name: "Bánh Kem Ngọt",
    code: "cake",
    coin_price: 100,
    icon: "Sparkles",
    tier: "RARE",
    color: "text-orange-500",
    description: "Bữa tiệc ngọt ngào chúc mừng những chương truyện tuyệt đỉnh",
    sort_order: 4,
    is_active: true,
  },
  {
    id: 5,
    name: "Kim Cương",
    code: "diamond",
    coin_price: 200,
    icon: "Gem",
    tier: "EPIC",
    color: "text-cyan-400",
    description: "Kim cương tỏa sáng rạng rỡ tôn vinh ngòi bút tinh hoa",
    sort_order: 5,
    is_active: true,
  },
  {
    id: 6,
    name: "Cúp Vàng Danh Dự",
    code: "gold_cup",
    coin_price: 500,
    icon: "Trophy",
    tier: "EPIC",
    color: "text-yellow-400",
    description: "Tôn vinh cây bút tài hoa của làng truyện",
    sort_order: 6,
    is_active: true,
  },
  {
    id: 7,
    name: "Vương Miện Hoàng Gia",
    code: "crown",
    coin_price: 1000,
    icon: "Crown",
    tier: "LEGENDARY",
    color: "text-amber-300",
    description:
      "Đỉnh cao phong cách dành cho tác giả thần tượng trong lòng bạn",
    sort_order: 7,
    is_active: true,
  },
  {
    id: 8,
    name: "Tên Lửa Siêu Thanh",
    code: "rocket",
    coin_price: 2000,
    icon: "Rocket",
    tier: "LEGENDARY",
    color: "text-red-500",
    description: "Phóng truyện thẳng lên đỉnh bảng xếp hạng thịnh hành!",
    sort_order: 8,
    is_active: true,
  },
  {
    id: 9,
    name: "Lâu Đài Pha Lê",
    code: "crystal_castle",
    coin_price: 5000,
    icon: "Castle",
    tier: "MYTHIC",
    color: "text-purple-400",
    description: "Món quà vương giả trường tồn dành cho kiệt tác kinh điển",
    sort_order: 9,
    is_active: true,
  },
  {
    id: 10,
    name: "Rồng Vàng Thần Thoại",
    code: "golden_dragon",
    coin_price: 10000,
    icon: "Flame",
    tier: "MYTHIC",
    color: "text-amber-400",
    description: "Thần thú chí tôn mang lại vinh quang tột đỉnh cho tác phẩm",
    sort_order: 10,
    is_active: true,
  },
];

const TIER_THEMES: Record<
  string,
  { label: string; badgeClass: string; glowColor: string; borderClass: string }
> = {
  COMMON: {
    label: "Thường",
    badgeClass: "bg-zinc-800 text-zinc-300 border-zinc-700",
    glowColor: "rgba(255, 255, 255, 0.08)",
    borderClass: "border-zinc-700 hover:border-zinc-500",
  },
  RARE: {
    label: "Hiếm",
    badgeClass: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    glowColor: "rgba(59, 130, 246, 0.18)",
    borderClass: "border-blue-500/30 hover:border-blue-500/70",
  },
  EPIC: {
    label: "Cực Phẩm",
    badgeClass: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    glowColor: "rgba(168, 85, 247, 0.22)",
    borderClass: "border-purple-500/40 hover:border-purple-500/80",
  },
  LEGENDARY: {
    label: "Huyền Thoại",
    badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    glowColor: "rgba(245, 158, 11, 0.25)",
    borderClass: "border-amber-500/40 hover:border-amber-500/90",
  },
  MYTHIC: {
    label: "Thần Thoại",
    badgeClass: "bg-rose-500/20 text-rose-300 border-rose-500/40",
    glowColor: "rgba(244, 63, 94, 0.3)",
    borderClass: "border-rose-500/50 hover:border-rose-500/90",
  },
};

const COMBO_PRESETS = [
  { count: 1, label: "x1", tip: "Mặc định" },
  { count: 5, label: "x5", tip: "Tiếp sức" },
  { count: 10, label: "x10", tip: "Cổ vũ" },
  { count: 66, label: "x66", tip: "Lộc phát" },
  { count: 99, label: "x99", tip: "May mắn" },
  { count: 520, label: "x520", tip: "Yêu thích" },
];

const QUICK_CHEER_PROMPTS = [
  "🚀 Bão chương đi tác giả ơi!",
  "☕ Tặng cà phê thức đêm viết truyện!",
  "🔥 Hóng chương mới từng phút từng giây!",
  "👑 Tác phẩm đỉnh cao, ủng hộ hết mình!",
];

export function DonateModal({ isOpen, onClose, storyId }: DonateModalProps) {
  const { isAuthenticated } = useAuth();
  const { data: wallet } = useWallet();
  const { data: remoteGifts, isLoading: isLoadingGifts } = useGifts();
  const { mutate: donate, isPending } = useDonate();

  const giftsList: GiftItem[] = useMemo(() => {
    if (remoteGifts && remoteGifts.length > 0) {
      return remoteGifts;
    }
    return DEFAULT_FALLBACK_GIFTS;
  }, [remoteGifts]);

  const [selectedGift, setSelectedGift] = useState<GiftItem>(
    () => giftsList[0] || DEFAULT_FALLBACK_GIFTS[0],
  );
  const [selectedTier, setSelectedTier] = useState<string>("ALL");
  const [quantity, setQuantity] = useState<number>(1);
  const [message, setMessage] = useState<string>("");
  const [isSuccessCelebration, setIsSuccessCelebration] = useState(false);
  const [lastDonatedGift, setLastDonatedGift] = useState<{
    gift: GiftItem;
    quantity: number;
    coins: number;
  } | null>(null);
  useEffect(() => {
    if (giftsList.length > 0) {
      // Giữ quà đã chọn nếu hợp lệ, nếu không mới fallback về phần tử đầu tiên
      setSelectedGift((prev) => {
        const exists = giftsList.find((g) => g.id === prev?.id);
        return exists || giftsList[0];
      });
    }
  }, [giftsList]);
  // // Sync initial gift selection when gifts are loaded
  // useEffect(() => {
  //   if (giftsList.length > 0 && !selectedGift) {
  //     setSelectedGift(giftsList[0]);
  //   }
  // }, [giftsList, selectedGift]);

  const filteredGifts = useMemo(() => {
    if (selectedTier === "ALL") return giftsList;
    return giftsList.filter((g) => g.tier === selectedTier);
  }, [giftsList, selectedTier]);

  const totalCost = (selectedGift?.coin_price || 0) * quantity;
  const userBalance = wallet?.coin_balance || 0;
  const hasEnoughCoins = userBalance >= totalCost;

  const currentTheme =
    TIER_THEMES[selectedGift?.tier || "COMMON"] || TIER_THEMES.COMMON;

  // Trigger festive confetti explosion
  const triggerConfettiCelebration = () => {
    try {
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999,
      };

      function fire(particleRatio: number, opts: any) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    } catch {
      // Ignore if canvas not supported
    }
  };

  const handleDonate = () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để tặng quà.");
      return;
    }

    if (!storyId) {
      toast.error("Không tìm thấy thông tin truyện để tặng quà.");
      return;
    }

    if (!hasEnoughCoins) {
      toast.error("Số dư Xu không đủ. Vui lòng nạp thêm Xu.");
      return;
    }

    const payload = {
      story_id: storyId,
      gift_id: selectedGift.id,
      item_name: selectedGift.name,
      coin_amount: totalCost,
      quantity,
      message: message.trim() || undefined,
    };

    donate(payload, {
      onSuccess: () => {
        setLastDonatedGift({
          gift: selectedGift,
          quantity,
          coins: totalCost,
        });
        setIsSuccessCelebration(true);
        triggerConfettiCelebration();
        toast.success(
          `Tặng ${quantity > 1 ? `${quantity}x ` : ""}${selectedGift.name} thành công!`,
        );
      },
      onError: (err: any) => {
        toast.error(
          err.response?.data?.message || "Có lỗi xảy ra khi tặng quà",
        );
      },
    });
  };

  const handleCloseModal = () => {
    setIsSuccessCelebration(false);
    setMessage("");
    setQuantity(1);
    onClose();
  };

  const SelectedIcon =
    AVAILABLE_ICONS[selectedGift?.icon || "Gift"] || AVAILABLE_ICONS.Gift;

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="w-[95vw] max-w-[620px] p-0 overflow-hidden bg-zinc-950 border border-zinc-800 text-white shadow-2xl rounded-2xl sm:max-w-[620px]">
        {/* Dynamic Ethereal Ambient Glow */}
        <div
          className="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-[100px] pointer-events-none transition-all duration-700 opacity-60"
          style={{ background: currentTheme.glowColor }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full blur-[100px] pointer-events-none transition-all duration-700 opacity-50"
          style={{ background: currentTheme.glowColor }}
        />

        <AnimatePresence mode="wait">
          {isSuccessCelebration ? (
            /* Celebration View */
            <motion.div
              key="celebration"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-8 text-center space-y-6 relative z-10 my-4"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/15 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/10 animate-bounce">
                <SelectedIcon className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 px-3 py-1 text-xs uppercase font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 inline" /> Tặng Quà
                  Thành Công
                </Badge>
                <h3 className="text-2xl font-bold font-outfit text-white">
                  Cảm Ơn Bạn Đã Tiếp Lửa!
                </h3>
                <p className="text-sm text-zinc-400 max-w-sm mx-auto">
                  Bạn vừa gửi tặng{" "}
                  <span className="font-bold text-amber-400">
                    {lastDonatedGift?.quantity}x {lastDonatedGift?.gift.name}
                  </span>{" "}
                  ({lastDonatedGift?.coins.toLocaleString()} Xu) tới tác giả.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                <Button
                  onClick={() => setIsSuccessCelebration(false)}
                  variant="outline"
                  className="rounded-xl border-zinc-800 text-zinc-300 hover:bg-zinc-900"
                >
                  Tặng tiếp món khác
                </Button>
                <Button
                  onClick={handleCloseModal}
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold px-6 shadow-lg shadow-amber-500/20"
                >
                  Hoàn Tất
                </Button>
              </div>
            </motion.div>
          ) : (
            /* Main Gifting View */
            <div className="relative z-10 flex min-h-0 max-h-[85vh] flex-col">
              {/* Header */}
              <DialogHeader className="p-4 pb-3 border-b border-zinc-900 text-left sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                      <Gift className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <DialogTitle className="text-base sm:text-lg font-outfit font-semibold text-white tracking-tight">
                        Tặng Quà Cho Tác Giả
                      </DialogTitle>
                      <DialogDescription className="text-[11px] text-zinc-400 font-sans sm:text-xs">
                        Tiếp thêm động lực ra chương & khắc tên lên Bảng Vàng!
                      </DialogDescription>
                    </div>
                  </div>

                  {/* Wallet Balance Badge */}
                  <div className="flex items-center gap-1.5 self-start rounded-full bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 text-[11px] font-mono sm:self-auto sm:px-3">
                    <span className="text-zinc-400">Ví:</span>
                    <span className="font-bold text-amber-400 flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5" />
                      {userBalance.toLocaleString()}
                    </span>
                    <Link
                      href="/profile/wallet"
                      target="_blank"
                      className="ml-1 text-[10px] text-blue-400 hover:text-blue-300 font-sans underline sm:text-[11px]"
                    >
                      +Nạp
                    </Link>
                  </div>
                </div>

                {/* Tier Filter Tabs */}
                <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedTier("ALL")}
                    className={`px-3 py-1 rounded-lg transition-all font-medium whitespace-nowrap ${
                      selectedTier === "ALL"
                        ? "bg-white text-black font-semibold shadow-sm"
                        : "text-zinc-400 hover:text-white bg-zinc-900/60"
                    }`}
                  >
                    Tất Cả ({giftsList.length})
                  </button>
                  {Object.keys(TIER_THEMES).map((tierKey) => {
                    const t = TIER_THEMES[tierKey];
                    const count = giftsList.filter(
                      (g) => g.tier === tierKey,
                    ).length;
                    if (count === 0) return null;
                    const isSelected = selectedTier === tierKey;
                    return (
                      <button
                        type="button"
                        key={tierKey}
                        onClick={() => setSelectedTier(tierKey)}
                        className={`px-3 py-1 rounded-lg transition-all font-medium whitespace-nowrap flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-white text-black font-semibold shadow-sm"
                            : "text-zinc-400 hover:text-white bg-zinc-900/60"
                        }`}
                      >
                        <span>{t.label}</span>
                        <span className="text-[10px] opacity-70">
                          ({count})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </DialogHeader>

              {/* Scrollable Content Body */}
              <div className="space-y-4 overflow-y-auto p-4 sm:p-5 max-h-[calc(85vh-205px)] scrollbar-thin scrollbar-thumb-zinc-800">
                {/* Gift Selection Grid */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {filteredGifts.map((gift) => {
                    const Icon =
                      AVAILABLE_ICONS[gift.icon || "Gift"] ||
                      AVAILABLE_ICONS.Gift;
                    const isSelected = selectedGift?.id === gift.id;
                    const tierTheme =
                      TIER_THEMES[gift.tier] || TIER_THEMES.COMMON;

                    return (
                      <motion.div
                        key={gift.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedGift(gift)}
                        className={`p-3 rounded-xl border cursor-pointer flex flex-col items-center justify-between text-center gap-2 relative transition-all duration-200 ${
                          isSelected
                            ? "bg-zinc-900/90 border-amber-500/80 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10"
                            : `bg-zinc-950/70 ${tierTheme.borderClass}`
                        }`}
                      >
                        {/* Check Indicator */}
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-500 text-black flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}

                        {/* Gift Icon */}
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform ${
                            isSelected ? "scale-110" : ""
                          }`}
                        >
                          <Icon
                            className={`w-7 h-7 ${gift.color || "text-amber-400"}`}
                          />
                        </div>

                        {/* Name & Coin */}
                        <div className="w-full">
                          <span className="font-semibold text-xs text-white block truncate">
                            {gift.name}
                          </span>
                          <span className="text-[11px] font-bold text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                            {gift.coin_price.toLocaleString()}{" "}
                            <Coins className="w-3 h-3" />
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Selected Gift Highlight Banner */}
                {selectedGift && (
                  <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 flex items-center gap-3 relative overflow-hidden">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800/80 border border-zinc-700 flex items-center justify-center shrink-0">
                      <SelectedIcon
                        className={`w-6 h-6 ${selectedGift.color || "text-amber-400"}`}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">
                          {selectedGift.name}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[9px] font-mono px-1.5 py-0 ${currentTheme.badgeClass}`}
                        >
                          {currentTheme.label}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                        {selectedGift.description ||
                          "Món quà tiếp thêm động lực to lớn cho tác giả!"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Quantity / Combo Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>Số Lượng Quà:</span>
                    <span className="text-zinc-500">
                      Tổng:{" "}
                      <strong className="text-amber-400">
                        {totalCost.toLocaleString()} Xu
                      </strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
                    {COMBO_PRESETS.map((preset) => {
                      const isSelected = quantity === preset.count;
                      return (
                        <button
                          type="button"
                          key={preset.count}
                          onClick={() => setQuantity(preset.count)}
                          className={`min-h-[52px] rounded-lg border p-1.5 text-center transition-all ${
                            isSelected
                              ? "bg-amber-500 text-black font-bold border-amber-500 shadow-md shadow-amber-500/20"
                              : "bg-zinc-900/60 text-zinc-300 border-zinc-800 hover:border-zinc-700"
                          }`}
                        >
                          <div className="text-xs font-mono font-bold leading-none">
                            {preset.label}
                          </div>
                          <div
                            className={`mt-0.5 text-[9px] leading-tight ${isSelected ? "text-zinc-900" : "text-zinc-500"}`}
                          >
                            {preset.tip}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Message to Author */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>Lời Nhắn Gửi Tác Giả:</span>
                    <span className="text-[11px] text-zinc-500">
                      {message.length}/200
                    </span>
                  </div>

                  {/* Quick Cheer Wishes (1-Click) */}
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_CHEER_PROMPTS.map((prompt) => (
                      <button
                        type="button"
                        key={prompt}
                        onClick={() => setMessage(prompt)}
                        className="text-[11px] text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800/80 rounded-full px-2.5 py-0.5 transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>

                  <Textarea
                    placeholder="Viết lời nhắn động viên ấm áp tới tác giả..."
                    maxLength={200}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-zinc-900/80 border-zinc-800 rounded-xl resize-none text-xs text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-amber-500 h-16"
                  />
                </div>

                {/* Insufficient balance alert if needed */}
                {!hasEnoughCoins && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center justify-between">
                    <span>
                      Số dư không đủ (Thiếu{" "}
                      {(totalCost - userBalance).toLocaleString()} Xu)
                    </span>
                    <Link
                      href="/profile/wallet"
                      target="_blank"
                      className="font-bold underline flex items-center gap-1 hover:text-red-300"
                    >
                      <CreditCard className="w-3.5 h-3.5" /> Nạp thêm ngay
                    </Link>
                  </div>
                )}
              </div>

              {/* Sticky Footer */}
              <div className="flex flex-col gap-3 border-t border-zinc-900 bg-zinc-950 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-left text-xs sm:text-left">
                  <div className="font-mono text-zinc-500">Thanh toán:</div>
                  <div className="flex items-center gap-1 text-base font-bold text-amber-400">
                    <Coins className="w-4 h-4" />
                    {totalCost.toLocaleString()} Xu
                  </div>
                </div>

                <Button
                  onClick={handleDonate}
                  disabled={isPending || !hasEnoughCoins}
                  className={`h-11 w-full rounded-xl px-6 text-sm font-bold shadow-lg transition-all sm:w-auto ${
                    hasEnoughCoins
                      ? "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-600 hover:to-yellow-600 text-black shadow-amber-500/20"
                      : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-4 h-4" />
                  {isPending
                    ? "Đang gửi quà..."
                    : `Tặng ${quantity > 1 ? `${quantity}x ` : ""}${selectedGift?.name}`}
                </Button>
              </div>
            </div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
