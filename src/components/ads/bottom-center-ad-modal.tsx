"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  useReaderAds,
  useTrackAdClick,
  useTrackAdImpression,
  Advertisement,
} from "@/hooks/use-ads";
import { PlatformBadge, ShopeeIcon, TikTokIcon } from "./ad-icons";
import { getImageUrl } from "@/lib/utils";
import {
  X,
  ExternalLink,
  Flame,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Sparkles,
  EyeOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function BottomCenterAdModal() {
  const { data: ads } = useReaderAds("FLOATING_BOTTOM");
  const { mutate: trackClick } = useTrackAdClick();
  const { mutate: trackImpression } = useTrackAdImpression();

  const [isDismissed, setIsDismissed] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const trackedIds = useRef<Set<number>>(new Set());

  // Kiểm tra phiên làm việc
  useEffect(() => {
    if (ads && ads.length > 0) {
      const dismissed = sessionStorage.getItem("dismissed_bottom_ad");
      if (!dismissed) {
        setIsDismissed(false);
      }
    }
  }, [ads]);

  const activeAds: Advertisement[] = ads || [];
  const currentAd =
    activeAds.length > 0 ? activeAds[currentIndex % activeAds.length] : null;

  // Ghi nhận lượt xem
  useEffect(() => {
    if (currentAd && !trackedIds.current.has(currentAd.id)) {
      trackedIds.current.add(currentAd.id);
      trackImpression(currentAd.id);
    }
  }, [currentAd, trackImpression]);

  // Tự động chuyển đổi giữa nhiều sản phẩm
  useEffect(() => {
    if (activeAds.length <= 1 || isHovered || isDismissed || isMinimized)
      return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeAds.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [activeAds.length, isHovered, isDismissed, isMinimized]);

  if (!currentAd || isDismissed) {
    // Nếu bị đóng, có thể hiển thị một icon nhỏ xinh để mở lại deal nếu người dùng muốn
    if (isDismissed && activeAds.length > 0) {
      return (
        <button
          type="button"
          onClick={() => {
            setIsDismissed(false);
            sessionStorage.removeItem("dismissed_bottom_ad");
          }}
          className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/90 text-white border border-zinc-700 shadow-xl text-xs font-mono backdrop-blur-md hover:bg-zinc-800 transition-all hover:scale-105"
          title="Mở lại ưu đãi"
        >
          <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
          <span className="text-[11px] uppercase tracking-wider">
            Ưu Đãi Hot ({activeAds.length})
          </span>
        </button>
      );
    }
    return null;
  }

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissed(true);
    sessionStorage.setItem("dismissed_bottom_ad", "true");
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + activeAds.length) % activeAds.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % activeAds.length);
  };

  const handleClick = () => {
    trackClick(currentAd.id);
    window.open(
      currentAd.target_url,
      "_blank",
      "noopener,noreferrer,sponsored",
    );
  };

  const formatVND = (num: number | null) => {
    if (!num) return "";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(num);
  };

  const isShopee = currentAd.platform === "SHOPEE";
  const isTikTok = currentAd.platform === "TIKTOK";

  return (
    <div
      className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-lg md:max-w-xl pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 320 }}
          className={`relative bg-zinc-950/95 backdrop-blur-xl border rounded-2xl shadow-2xl overflow-hidden transition-colors ${
            isShopee
              ? "border-orange-500/40"
              : isTikTok
                ? "border-zinc-600"
                : "border-primary/40"
          }`}
        >
          {/* Top Bar: Tiêu đề + Nút Bỏ qua / Đóng */}
          <div className="flex items-center justify-between px-3.5 py-2 border-b border-zinc-800/80 bg-black/40 text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider font-semibold flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-500" />
                Gợi Ý Mua Sắm Dành Cho Bạn
              </span>
              {activeAds.length > 1 && (
                <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                  {currentIndex + 1}/{activeAds.length}
                </span>
              )}
            </div>

            {/* Nút BỎ QUA nổi bật */}
            <button
              type="button"
              onClick={handleSkip}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-400 hover:text-white transition-all text-[11px] font-mono font-medium shadow-sm hover:scale-105"
              title="Đóng quảng cáo"
            >
              <span>Bỏ qua</span>
              <X className="w-3 h-3 text-zinc-400" />
            </button>
          </div>

          {/* Body: Thẻ sản phẩm với AnimatePresence để chuyển đổi mượt mà */}
          <div className="p-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentAd.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3.5"
              >
                {/* Thumbnail sản phẩm */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 flex-shrink-0">
                  <img
                    src={getImageUrl(currentAd.image_url)}
                    alt={currentAd.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {currentAd.discount_tag && (
                    <span className="absolute top-0 left-0 bg-[#ee4d2d] text-white text-[9px] font-bold px-1 rounded-br font-mono">
                      {currentAd.discount_tag}
                    </span>
                  )}
                </div>

                {/* Thông tin deal */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <PlatformBadge platform={currentAd.platform} />
                    {currentAd.description && (
                      <span className="text-[11px] text-zinc-400 truncate max-w-[160px] sm:max-w-xs">
                        · {currentAd.description}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-white line-clamp-1 hover:text-primary transition-colors">
                    {currentAd.title}
                  </p>

                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <div className="flex items-baseline gap-2">
                      {currentAd.sale_price ? (
                        <>
                          <span className="text-xs sm:text-sm font-bold text-[#ee4d2d] font-mono">
                            {formatVND(currentAd.sale_price)}
                          </span>
                          {currentAd.original_price && (
                            <span className="text-[10px] text-zinc-500 line-through font-mono">
                              {formatVND(currentAd.original_price)}
                            </span>
                          )}
                        </>
                      ) : currentAd.original_price ? (
                        <span className="text-xs font-bold text-white font-mono">
                          {formatVND(currentAd.original_price)}
                        </span>
                      ) : (
                        <span className="text-[11px] text-zinc-400">
                          Deal hot có hạn
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClick();
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md transition-transform hover:scale-105 ${
                        isShopee
                          ? "bg-[#ee4d2d] text-white hover:bg-[#d03e20]"
                          : isTikTok
                            ? "bg-white text-black hover:bg-zinc-200"
                            : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {isShopee && <ShopeeIcon className="w-3.5 h-3.5" />}
                      {isTikTok && <TikTokIcon className="w-3.5 h-3.5" />}
                      <span>{currentAd.cta_text || "Mua ngay"}</span>
                      <ExternalLink className="w-3 h-3 opacity-80" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Controls: Nút Prev/Next & Chấm chỉ số xoay vòng */}
          {activeAds.length > 1 && (
            <div className="flex items-center justify-between px-3 py-1.5 bg-black/60 border-t border-zinc-900 text-xs">
              <button
                type="button"
                onClick={handlePrev}
                className="flex items-center gap-0.5 text-zinc-400 hover:text-white p-1 transition-colors"
                title="Deal trước"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono">Trước</span>
              </button>

              <div className="flex items-center gap-1.5">
                {activeAds.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentIndex(i)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === currentIndex
                        ? "w-4 bg-white"
                        : "w-1 bg-zinc-700 hover:bg-zinc-500"
                    }`}
                    title={`Deal ${i + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-0.5 text-zinc-400 hover:text-white p-1 transition-colors"
                title="Deal tiếp"
              >
                <span className="text-[10px] font-mono">Tiếp</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
