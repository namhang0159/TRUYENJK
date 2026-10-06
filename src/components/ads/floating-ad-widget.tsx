"use client";

import React, { useState, useEffect } from "react";
import { useReaderAds, useTrackAdClick } from "@/hooks/use-ads";
import { PlatformBadge, ShopeeIcon, TikTokIcon } from "./ad-icons";
import { getImageUrl } from "@/lib/utils";
import {
  X,
  ExternalLink,
  Flame,
  ChevronRight,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingAdWidget() {
  const { data: ads } = useReaderAds("FLOATING_BOTTOM");
  const { mutate: trackClick } = useTrackAdClick();

  const [isDismissed, setIsDismissed] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  const ad = ads && ads.length > 0 ? ads[0] : null;

  useEffect(() => {
    // Kiểm tra xem user có tắt trong phiên làm việc hiện tại không
    if (ad) {
      const closed = sessionStorage.getItem(`dismissed_ad_${ad.id}`);
      if (!closed) {
        setIsDismissed(false);
      }
    }
  }, [ad]);

  if (!ad || isDismissed) return null;

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissed(true);
    sessionStorage.setItem(`dismissed_ad_${ad.id}`, "true");
  };

  const handleToggleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };

  const handleClick = () => {
    trackClick(ad.id);
    window.open(ad.target_url, "_blank", "noopener,noreferrer,sponsored");
  };

  const isShopee = ad.platform === "SHOPEE";
  const isTikTok = ad.platform === "TIKTOK";

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 max-w-xs sm:max-w-sm pointer-events-auto">
      <AnimatePresence>
        {isMinimized ? (
          // Bản thu nhỏ hình tròn / chip nổi
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => setIsMinimized(false)}
            className={`flex items-center gap-2 px-3 py-2 rounded-full shadow-2xl cursor-pointer border text-white font-medium text-xs transition-transform hover:scale-105 ${
              isShopee
                ? "bg-[#ee4d2d] border-orange-400"
                : isTikTok
                  ? "bg-zinc-950 border-zinc-700"
                  : "bg-primary border-primary/50"
            }`}
          >
            {isShopee && <ShopeeIcon className="w-4 h-4" />}
            {isTikTok && <TikTokIcon className="w-4 h-4" />}
            <span className="truncate max-w-[120px]">{ad.title}</span>
            <Maximize2 className="w-3.5 h-3.5 opacity-80" />
          </motion.div>
        ) : (
          // Bản mở rộng đầy đủ
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="group relative bg-card/95 backdrop-blur-md border border-border/80 rounded-2xl shadow-2xl p-3 overflow-hidden transition-colors"
          >
            {/* Header toolbar */}
            <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-border/40">
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                  Deal Hot Sàn TMĐT
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleToggleMinimize}
                  title="Thu nhỏ"
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  <Minimize2 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  title="Đóng quảng cáo"
                  className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Nội dung Deal */}
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-border/60">
                <img
                  src={getImageUrl(ad.image_url)}
                  alt={ad.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                {ad.discount_tag && (
                  <span className="absolute top-0 left-0 bg-[#ee4d2d] text-white text-[9px] font-bold px-1 rounded-br">
                    {ad.discount_tag}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <PlatformBadge platform={ad.platform} showText={false} />
                  <p className="text-xs font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {ad.title}
                  </p>
                </div>
                {ad.description && (
                  <p className="text-[11px] text-muted-foreground line-clamp-1">
                    {ad.description}
                  </p>
                )}
                <div className="flex items-center justify-between mt-1">
                  {ad.sale_price ? (
                    <span className="text-xs font-bold text-[#ee4d2d]">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(ad.sale_price)}
                    </span>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">
                      Deal số lượng có hạn
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick();
                    }}
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded text-white ${
                      isShopee
                        ? "bg-[#ee4d2d]"
                        : isTikTok
                          ? "bg-zinc-900 dark:bg-zinc-700"
                          : "bg-primary"
                    }`}
                  >
                    <span>{ad.cta_text || "Mua ngay"}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
