"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Advertisement,
  useReaderAds,
  useTrackAdClick,
  useTrackAdImpression,
} from "@/hooks/use-ads";
import { PlatformBadge, ShopeeIcon, TikTokIcon } from "./ad-icons";
import { getImageUrl } from "@/lib/utils";
import {
  ExternalLink,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AffiliateBannerProps {
  placement?:
    | "HOME_BANNER"
    | "STORY_SIDEBAR"
    | "CHAPTER_BOTTOM"
    | "FLOATING_BOTTOM"
    | "ALL";
  ad?: Advertisement;
  adsList?: Advertisement[];
  className?: string;
  variant?: "auto" | "banner" | "card";
  interval?: number; // thời gian tự chuyển đổi (ms), mặc định 5000
}

export function AffiliateBanner({
  placement = "HOME_BANNER",
  ad: directAd,
  adsList: directAdsList,
  className = "",
  variant = "auto",
  interval = 5000,
}: AffiliateBannerProps) {
  const { data: fetchedAds, isLoading } = useReaderAds(
    directAd || directAdsList ? undefined : placement,
  );
  const { mutate: trackClick } = useTrackAdClick();
  const { mutate: trackImpression } = useTrackAdImpression();

  // Danh sách quảng cáo hiển thị
  const ads: Advertisement[] = directAd
    ? [directAd]
    : directAdsList || fetchedAds || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const trackedIds = useRef<Set<number>>(new Set());

  const currentAd = ads.length > 0 ? ads[currentIndex % ads.length] : null;

  // Ghi nhận lượt hiển thị khi mỗi sản phẩm xuất hiện
  useEffect(() => {
    if (currentAd && !trackedIds.current.has(currentAd.id)) {
      trackedIds.current.add(currentAd.id);
      trackImpression(currentAd.id);
    }
  }, [currentAd, trackImpression]);

  // Tự động xoay vòng qua lại giữa nhiều sản phẩm
  useEffect(() => {
    if (ads.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, interval);

    return () => clearInterval(timer);
  }, [ads.length, isHovered, interval]);

  if (isLoading || !currentAd) {
    return null;
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    trackClick(currentAd.id);
    window.open(
      currentAd.target_url,
      "_blank",
      "noopener,noreferrer,sponsored",
    );
  };

  const isProductCard =
    variant === "card" ||
    (variant === "auto" && currentAd.display_type === "PRODUCT_CARD");
  const isShopee = currentAd.platform === "SHOPEE";
  const isTikTok = currentAd.platform === "TIKTOK";

  const formatVND = (num: number | null) => {
    if (!num) return "";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(num);
  };

  // KIỂU 1: THẺ SẢN PHẨM (PRODUCT CARD) CÓ TỰ ĐỘNG CHUYỂN ĐỔI
  if (isProductCard) {
    return (
      <div
        className={`relative group ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAd.id}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className={`relative overflow-hidden rounded-xl border border-border/60 bg-card p-4 shadow-sm hover:shadow-md transition-all duration-300 ${
              isShopee
                ? "hover:border-[#ee4d2d]/50"
                : isTikTok
                  ? "hover:border-zinc-500"
                  : "hover:border-primary/50"
            }`}
          >
            <div className="flex gap-4 items-center">
              {/* Ảnh sản phẩm */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden flex-shrink-0 bg-muted border border-border/40">
                <img
                  src={getImageUrl(currentAd.image_url)}
                  alt={currentAd.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {currentAd.discount_tag && (
                  <div className="absolute top-1 left-1 bg-[#ee4d2d] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                    {currentAd.discount_tag}
                  </div>
                )}
              </div>

              {/* Chi tiết sản phẩm */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2">
                  <PlatformBadge platform={currentAd.platform} />
                  {ads.length > 1 && (
                    <span className="text-[10px] font-mono text-zinc-500 bg-muted px-1.5 py-0.5 rounded">
                      {currentIndex + 1}/{ads.length}
                    </span>
                  )}
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground ml-auto">
                    Tài Trợ
                  </span>
                </div>

                <h4 className="font-semibold text-sm line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                  {currentAd.title}
                </h4>

                {currentAd.description && (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {currentAd.description}
                  </p>
                )}

                {/* Giá bán */}
                <div className="flex items-baseline gap-2 pt-1">
                  {currentAd.sale_price ? (
                    <>
                      <span className="font-bold text-sm sm:text-base text-[#ee4d2d]">
                        {formatVND(currentAd.sale_price)}
                      </span>
                      {currentAd.original_price && (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatVND(currentAd.original_price)}
                        </span>
                      )}
                    </>
                  ) : currentAd.original_price ? (
                    <span className="font-bold text-sm text-foreground">
                      {formatVND(currentAd.original_price)}
                    </span>
                  ) : null}
                </div>

                {/* Nút Call To Action */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick(e as any);
                    }}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-transform group-hover:translate-x-0.5 ${
                      isShopee
                        ? "bg-[#ee4d2d] hover:bg-[#d03e20]"
                        : isTikTok
                          ? "bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-black"
                          : "bg-primary hover:bg-primary/90"
                    }`}
                  >
                    {isShopee && <ShopeeIcon className="w-3.5 h-3.5" />}
                    {isTikTok && <TikTokIcon className="w-3.5 h-3.5" />}
                    {!isShopee && !isTikTok && (
                      <ShoppingBag className="w-3.5 h-3.5" />
                    )}
                    <span>{currentAd.cta_text || "Mua ngay"}</span>
                    <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Nút điều hướng qua lại khi có từ 2 sản phẩm trở lên */}
        {ads.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-1 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/70 text-white hover:bg-black border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              title="Sản phẩm trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/70 text-white hover:bg-black border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              title="Sản phẩm tiếp theo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Chấm tròn chỉ báo chuyển đổi */}
            <div className="flex items-center justify-center gap-1.5 mt-2">
              {ads.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? "w-5 bg-primary"
                      : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                  }`}
                  title={`Xem deal ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // KIỂU 2: BANNER NGANG LỚN CÓ TỰ ĐỘNG CHUYỂN ĐỔI
  return (
    <div
      className={`relative group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentAd.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="relative overflow-hidden rounded-2xl border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300"
        >
          {/* Banner Image */}
          <div className="relative w-full aspect-[21/9] sm:aspect-[24/7] max-h-60 overflow-hidden bg-zinc-950">
            <img
              src={getImageUrl(currentAd.image_url)}
              alt={currentAd.title}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 opacity-90 group-hover:opacity-100"
              loading="lazy"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

            {/* Top Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2">
                <PlatformBadge
                  platform={currentAd.platform}
                  className="shadow-lg backdrop-blur-md"
                />
                {ads.length > 1 && (
                  <span className="text-[10px] font-mono text-white/80 bg-black/60 px-2 py-0.5 rounded backdrop-blur-md">
                    {currentIndex + 1} / {ads.length}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/70 bg-black/60 px-2 py-0.5 rounded backdrop-blur-md">
                Quảng Cáo Tiếp Thị
              </span>
            </div>

            {/* Bottom Content inside Banner */}
            <div className="absolute bottom-3 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
              <div className="space-y-1 max-w-xl">
                {currentAd.discount_tag && (
                  <span className="inline-block bg-[#ee4d2d] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1">
                    {currentAd.discount_tag}
                  </span>
                )}
                <h3 className="font-bold text-base sm:text-lg drop-shadow-md line-clamp-1">
                  {currentAd.title}
                </h3>
                {currentAd.description && (
                  <p className="text-xs text-white/80 line-clamp-1 drop-shadow-sm">
                    {currentAd.description}
                  </p>
                )}
              </div>

              <div className="flex-shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick(e as any);
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition-transform group-hover:scale-105 ${
                    isShopee
                      ? "bg-[#ee4d2d] text-white hover:bg-[#ff5722]"
                      : isTikTok
                        ? "bg-white text-black hover:bg-zinc-200"
                        : "bg-primary text-primary-foreground"
                  }`}
                >
                  {isShopee && <ShopeeIcon className="w-4 h-4" />}
                  {isTikTok && <TikTokIcon className="w-4 h-4" />}
                  <span>{currentAd.cta_text || "Khám phá ngay"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Điều hướng chuyển đổi slide */}
      {ads.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 text-white hover:bg-black border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-sm"
            title="Deal trước"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 text-white hover:bg-black border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-sm"
            title="Deal tiếp theo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Indicators */}
          <div className="flex items-center justify-center gap-2 mt-3">
            {ads.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "w-6 bg-primary"
                    : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                }`}
                title={`Xem deal ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
