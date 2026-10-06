"use client";

import React, { useState, useEffect } from "react";
import {
  useAdminAds,
  useAdminAdStats,
  useCreateAd,
  useUpdateAd,
  useToggleAdActive,
  useDeleteAd,
  Advertisement,
  AdPlatform,
  AdPlacement,
  AdDisplayType,
} from "@/hooks/use-ads";
import {
  PlatformBadge,
  ShopeeIcon,
  TikTokIcon,
  LazadaIcon,
  TikiIcon,
} from "@/components/ads/ad-icons";
import { getImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingBag,
  ExternalLink,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  MousePointerClick,
  TrendingUp,
  Upload,
  Plus,
  Search,
  CheckCircle2,
  Sparkles,
  Link2,
  Tag,
  Percent,
  Flame,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Counter component for numbers
const AnimatedCounter = ({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800;
    const increment = value / (duration / 16);
    if (value === 0) {
      setCount(0);
      return;
    }

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {count.toLocaleString("vi-VN")}
      {suffix}
    </span>
  );
};

export default function AdminAdsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("ALL");
  const [placementFilter, setPlacementFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const {
    data: adsData,
    isLoading,
    refetch,
  } = useAdminAds({
    page,
    limit: 10,
    search,
    platform: platformFilter,
    placement: placementFilter,
    is_active: statusFilter,
  });

  const { data: stats, isLoading: isStatsLoading } = useAdminAdStats();

  const { mutateAsync: createAd, isPending: isCreating } = useCreateAd();
  const { mutateAsync: updateAd, isPending: isUpdating } = useUpdateAd();
  const { mutateAsync: toggleActive } = useToggleAdActive();
  const { mutateAsync: deleteAd, isPending: isDeleting } = useDeleteAd();

  // Form states
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formPlatform, setFormPlatform] = useState<AdPlatform>("SHOPEE");
  const [formPlacement, setFormPlacement] =
    useState<AdPlacement>("HOME_BANNER");
  const [formDisplayType, setFormDisplayType] =
    useState<AdDisplayType>("BANNER");
  const [formTargetUrl, setFormTargetUrl] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formOriginalPrice, setFormOriginalPrice] = useState("");
  const [formSalePrice, setFormSalePrice] = useState("");
  const [formDiscountTag, setFormDiscountTag] = useState("");
  const [formCtaText, setFormCtaText] = useState("Mua ngay trên Shopee");
  const [formSortOrder, setFormSortOrder] = useState("0");
  const [formIsActive, setFormIsActive] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleResetForm = () => {
    setEditingId(null);
    setFormTitle("");
    setFormPlatform("SHOPEE");
    setFormPlacement("HOME_BANNER");
    setFormDisplayType("BANNER");
    setFormTargetUrl("");
    setFormImageUrl("");
    setFormDescription("");
    setFormOriginalPrice("");
    setFormSalePrice("");
    setFormDiscountTag("");
    setFormCtaText("Mua ngay trên Shopee");
    setFormSortOrder("0");
    setFormIsActive(true);
    setSelectedFile(null);
    setFilePreview(null);
  };

  const handleSelectEdit = (ad: Advertisement) => {
    setEditingId(ad.id);
    setFormTitle(ad.title);
    setFormPlatform(ad.platform);
    setFormPlacement(ad.placement);
    setFormDisplayType(ad.display_type);
    setFormTargetUrl(ad.target_url);
    setFormImageUrl(ad.image_url);
    setFormDescription(ad.description || "");
    setFormOriginalPrice(ad.original_price ? ad.original_price.toString() : "");
    setFormSalePrice(ad.sale_price ? ad.sale_price.toString() : "");
    setFormDiscountTag(ad.discount_tag || "");
    setFormCtaText(ad.cta_text || "Mua ngay");
    setFormSortOrder(ad.sort_order.toString());
    setFormIsActive(ad.is_active);
    setSelectedFile(null);
    setFilePreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setFilePreview(objectUrl);
    }
  };

  const handlePlatformChange = (p: AdPlatform) => {
    setFormPlatform(p);
    if (!editingId) {
      if (p === "SHOPEE") setFormCtaText("Mua ngay trên Shopee");
      else if (p === "TIKTOK") setFormCtaText("Xem trên TikTok Shop");
      else if (p === "LAZADA") setFormCtaText("Săn deal Lazada");
      else if (p === "TIKI") setFormCtaText("Mua trên Tiki");
      else setFormCtaText("Mua ngay");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      toast.error("Vui lòng nhập tiêu đề quảng cáo");
      return;
    }

    if (!formTargetUrl.trim()) {
      toast.error("Vui lòng nhập link đích bán hàng / affiliate");
      return;
    }

    try {
      const targetUrl = new URL(formTargetUrl.trim());
      if (!["http:", "https:"].includes(targetUrl.protocol)) {
        throw new Error();
      }
    } catch {
      toast.error("Link bán hàng phải bắt đầu bằng http:// hoặc https://");
      return;
    }

    if (!selectedFile && !formImageUrl.trim()) {
      toast.error("Vui lòng tải ảnh lên hoặc nhập link ảnh");
      return;
    }

    const formData = new FormData();
    formData.append("title", formTitle.trim());
    formData.append("platform", formPlatform);
    formData.append("placement", formPlacement);
    formData.append("display_type", formDisplayType);
    formData.append("target_url", formTargetUrl.trim());
    formData.append("description", formDescription.trim());
    formData.append("cta_text", formCtaText.trim());
    formData.append("sort_order", formSortOrder);
    formData.append("is_active", String(formIsActive));

    if (formOriginalPrice) formData.append("original_price", formOriginalPrice);
    if (formSalePrice) formData.append("sale_price", formSalePrice);
    if (formDiscountTag)
      formData.append("discount_tag", formDiscountTag.trim());

    if (selectedFile) {
      formData.append("image", selectedFile);
    } else if (formImageUrl.trim()) {
      formData.append("image_url", formImageUrl.trim());
    }

    try {
      if (editingId) {
        await updateAd({ id: editingId, formData });
        toast.success("Cập nhật quảng cáo thành công!");
      } else {
        await createAd(formData);
        toast.success("Tạo mới quảng cáo thành công!");
        handleResetForm();
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || error.message || "Có lỗi xảy ra",
      );
    }
  };

  const handleToggle = (ad: Advertisement) => {
    toggleActive(ad.id, {
      onSuccess: () => {
        toast.success(
          ad.is_active
            ? `Đã ẩn quảng cáo "${ad.title}"`
            : `Đã kích hoạt quảng cáo "${ad.title}"`,
        );
      },
      onError: (err: any) => {
        toast.error(
          err.response?.data?.message || "Lỗi khi cập nhật trạng thái",
        );
      },
    });
  };

  const handleDelete = (ad: Advertisement) => {
    if (
      confirm(
        `THỰC THI LỆNH XÓA? Bạn có chắc muốn xóa quảng cáo "${ad.title}" vĩnh viễn khỏi hệ thống?`,
      )
    ) {
      deleteAd(ad.id, {
        onSuccess: () => {
          toast.success("Đã xóa quảng cáo thành công!");
          if (editingId === ad.id) handleResetForm();
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "Lỗi khi xóa quảng cáo");
        },
      });
    }
  };

  const getPlacementLabel = (p: string) => {
    switch (p) {
      case "HOME_BANNER":
        return "Trang chủ (Banner)";
      case "STORY_SIDEBAR":
        return "Cột phải truyện";
      case "CHAPTER_BOTTOM":
        return "Chân trang chương";
      case "CHAPTER_NAV":
        return "Chuyển chương (Mở tab tiếp thị liên kết)";
      case "FLOATING_BOTTOM":
        return "Modal giữa dưới (Có thể bỏ qua)";
      case "ALL":
        return "Mọi vị trí";
      default:
        return p;
    }
  };

  const formatVND = (num: string | number) => {
    if (!num) return "";
    const n = typeof num === "string" ? Number(num) : num;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(n);
  };

  const ads = adsData?.ads || [];

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Header Section (Matching categories & gifts page) */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-zinc-900">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">
              TIẾP THỊ // QUẢNG CÁO & AFFILIATE SHOPEE, TIKTOK
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-outfit font-medium tracking-tight text-white mb-2 uppercase">
            Quảng Cáo Tiếp Thị
          </h1>
          <p className="text-zinc-500 font-mono text-sm tracking-wide uppercase">
            Quản Lý Link Shopee & TikTok · Phân Bổ Banner · Tối Ưu Tỷ Lệ Chuyển
            Đổi (CTR)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleResetForm}
            variant="outline"
            className="rounded-none border-zinc-800 bg-black font-mono text-xs uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-900 h-10 px-4"
          >
            <Plus className="w-3.5 h-3.5 mr-2" /> Tạo Mới
          </Button>
        </div>
      </div>

      {/* 2. Stat Cards Grid (Brutalist Dark 1px gap grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-zinc-900 border border-zinc-900">
        <div className="bg-black p-6 space-y-2 hover:bg-zinc-950 transition-colors">
          <div className="flex justify-between items-start mb-6">
            <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
              // 01. TỔNG QUAN
            </span>
            <div className="flex items-center text-[10px] font-mono tracking-widest text-zinc-400 uppercase border border-zinc-800 px-2 py-0.5 bg-zinc-900">
              {stats?.activeAds || 0} ĐANG BẬT
            </div>
          </div>
          <div className="text-3xl md:text-4xl font-outfit font-medium text-white tracking-tight">
            {isStatsLoading ? (
              <Skeleton className="h-9 w-16 bg-zinc-900 rounded-none" />
            ) : (
              stats?.totalAds || 0
            )}
          </div>
          <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            Chiến dịch tiếp thị
          </div>
        </div>

        <div className="bg-black p-6 space-y-2 hover:bg-zinc-950 transition-colors">
          <div className="flex justify-between items-start mb-6">
            <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
              // 02. LƯỢT HIỂN THỊ
            </span>
            <Eye className="w-3.5 h-3.5 text-zinc-500" />
          </div>
          <div className="text-3xl md:text-4xl font-outfit font-medium text-white tracking-tight">
            {isStatsLoading ? (
              <Skeleton className="h-9 w-24 bg-zinc-900 rounded-none" />
            ) : (
              <AnimatedCounter value={stats?.totalViews || 0} />
            )}
          </div>
          <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            Lượt xem banner (Views)
          </div>
        </div>

        <div className="bg-black p-6 space-y-2 hover:bg-zinc-950 transition-colors">
          <div className="flex justify-between items-start mb-6">
            <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
              // 03. LƯỢT CLICK
            </span>
            <MousePointerClick className="w-3.5 h-3.5 text-orange-500" />
          </div>
          <div className="text-3xl md:text-4xl font-outfit font-medium text-orange-400 tracking-tight">
            {isStatsLoading ? (
              <Skeleton className="h-9 w-20 bg-zinc-900 rounded-none" />
            ) : (
              <AnimatedCounter value={stats?.totalClicks || 0} />
            )}
          </div>
          <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            Chuyển tiếp Shopee/TikTok
          </div>
        </div>

        <div className="bg-black p-6 space-y-2 hover:bg-zinc-950 transition-colors">
          <div className="flex justify-between items-start mb-6">
            <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
              // 04. HIỆU QUẢ CHUYỂN ĐỔI
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-3xl md:text-4xl font-outfit font-medium text-emerald-400 tracking-tight">
            {isStatsLoading ? (
              <Skeleton className="h-9 w-20 bg-zinc-900 rounded-none" />
            ) : (
              `${stats?.ctr || 0}%`
            )}
          </div>
          <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            CTR (Clicks / Views)
          </div>
        </div>
      </div>

      {/* 3. Main Grid: Left Table & Right Editor Form */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Side: Ads Table (Col 7) */}
        <div className="xl:col-span-7 bg-zinc-950 border border-zinc-900 self-start">
          {/* Section Toolbar */}
          <div className="p-5 border-b border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-outfit text-white uppercase font-medium">
                Danh Sách Quảng Cáo & Affiliate
              </h2>
              <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wide">
                Bấm vào hàng để chọn chỉnh sửa bên phải · Công tắc trạng thái
                nhanh
              </p>
            </div>
            <div className="text-xs font-mono text-zinc-400 bg-zinc-900/80 px-3 py-1.5 border border-zinc-800 self-start sm:self-auto uppercase">
              {adsData?.total || 0} MỤC
            </div>
          </div>

          {/* Search & Filter bar */}
          <div className="p-4 bg-black/80 border-b border-zinc-900 flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="TÌM THEO TIÊU ĐỀ, LINK ĐÍCH..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-8 bg-zinc-900/60 border-zinc-800 text-xs font-mono text-white placeholder:text-zinc-600 rounded-none h-9 focus-visible:ring-zinc-700 uppercase"
              />
            </div>

            <select
              value={platformFilter}
              onChange={(e) => {
                setPlatformFilter(e.target.value);
                setPage(1);
              }}
              className="bg-zinc-900 border border-zinc-800 text-[11px] font-mono uppercase text-zinc-300 px-3 h-9 outline-none cursor-pointer focus:border-zinc-700"
            >
              <option value="ALL">TẤT CẢ SÀN</option>
              <option value="SHOPEE">SHOPEE</option>
              <option value="TIKTOK">TIKTOK SHOP</option>
              <option value="LAZADA">LAZADA</option>
              <option value="TIKI">TIKI</option>
              <option value="OTHER">KHÁC</option>
            </select>

            <select
              value={placementFilter}
              onChange={(e) => {
                setPlacementFilter(e.target.value);
                setPage(1);
              }}
              className="bg-zinc-900 border border-zinc-800 text-[11px] font-mono uppercase text-zinc-300 px-3 h-9 outline-none cursor-pointer focus:border-zinc-700"
            >
              <option value="ALL">TẤT CẢ VỊ TRÍ</option>
              <option value="HOME_BANNER">TRANG CHỦ</option>
              <option value="STORY_SIDEBAR">TRANG TRUYỆN</option>
              <option value="CHAPTER_BOTTOM">ĐỌC CHƯƠNG (CUỐI BÀI)</option>
              <option value="CHAPTER_NAV">CHUYỂN CHƯƠNG (MỞ TAB)</option>
              <option value="FLOATING_BOTTOM">
                MODAL GIỮA DƯỚI (CÓ THỂ BỎ QUA)
              </option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-zinc-900 border border-zinc-800 text-[11px] font-mono uppercase text-zinc-300 px-3 h-9 outline-none cursor-pointer focus:border-zinc-700"
            >
              <option value="ALL">TRẠNG THÁI</option>
              <option value="true">ĐANG BẬT</option>
              <option value="false">ĐÃ ẨN</option>
            </select>
          </div>

          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-2 p-4 bg-black/60 border-b border-zinc-900 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            <div className="col-span-6">Hình Ảnh / Chiến Dịch / Sàn</div>
            <div className="col-span-2 text-center">Vị Trí</div>
            <div className="col-span-2 text-right">Click / View</div>
            <div className="col-span-2 text-right">Thao Tác</div>
          </div>

          {/* Table Rows */}
          {isLoading ? (
            <div className="p-4 space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-16 w-full bg-zinc-900 rounded-none"
                />
              ))}
            </div>
          ) : ads.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <ShoppingBag className="w-10 h-10 text-zinc-700 mx-auto" />
              <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">
                Chưa có quảng cáo nào phù hợp tiêu chí
              </p>
              <Button
                onClick={handleResetForm}
                variant="outline"
                className="h-9 rounded-none font-mono text-xs uppercase text-white border-zinc-800 bg-black hover:bg-zinc-900"
              >
                Tạo chiến dịch mới
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-zinc-900">
              <AnimatePresence>
                {ads.map((ad: Advertisement) => {
                  const isSelected = editingId === ad.id;
                  const ctr =
                    ad.views_count > 0
                      ? ((ad.clicks_count / ad.views_count) * 100).toFixed(1)
                      : "0";

                  return (
                    <div
                      key={ad.id}
                      onClick={() => handleSelectEdit(ad)}
                      className={`grid grid-cols-1 md:grid-cols-12 gap-3 p-4 items-center cursor-pointer transition-colors group ${
                        isSelected
                          ? "bg-zinc-900/80 border-l-2 border-white"
                          : "hover:bg-zinc-900/40 bg-black/40"
                      }`}
                    >
                      {/* Col 1: Ảnh + Tiêu Đề + Sàn */}
                      <div className="col-span-12 md:col-span-6 flex items-center gap-3 min-w-0">
                        <div className="relative w-14 h-12 rounded-none overflow-hidden bg-zinc-900 border border-zinc-800 flex-shrink-0">
                          <img
                            src={getImageUrl(ad.image_url)}
                            alt={ad.title}
                            className="w-full h-full object-cover"
                          />
                          {ad.discount_tag && (
                            <span className="absolute top-0 left-0 bg-[#ee4d2d] text-white text-[8px] font-mono font-bold px-1 py-0.5">
                              {ad.discount_tag}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <PlatformBadge platform={ad.platform} />
                            <span className="text-[10px] font-mono text-zinc-600">
                              #{ad.id.toString().padStart(3, "0")}
                            </span>
                          </div>
                          <p className="font-medium text-xs text-white truncate group-hover:text-primary transition-colors">
                            {ad.title}
                          </p>
                          <a
                            href={ad.target_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500 hover:text-white truncate max-w-[200px]"
                          >
                            <Link2 className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{ad.target_url}</span>
                            <ExternalLink className="w-2.5 h-2.5 flex-shrink-0 opacity-60" />
                          </a>
                        </div>
                      </div>

                      {/* Col 2: Vị trí */}
                      <div className="col-span-6 md:col-span-2 text-left md:text-center">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 bg-zinc-900/80 px-2 py-1 border border-zinc-800">
                          {getPlacementLabel(ad.placement)}
                        </span>
                      </div>

                      {/* Col 3: Click / View */}
                      <div className="col-span-6 md:col-span-2 text-right">
                        <div className="font-mono text-xs text-white font-medium">
                          {ad.clicks_count}{" "}
                          <span className="text-zinc-600 font-normal">
                            / {ad.views_count}
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-emerald-400">
                          CTR {ctr}%
                        </div>
                      </div>

                      {/* Col 4: Thao tác & Toggle Active */}
                      <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggle(ad);
                          }}
                          className={`p-1.5 border transition-colors ${
                            ad.is_active
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                              : "bg-zinc-900 text-zinc-600 border-zinc-800 hover:text-zinc-400"
                          }`}
                          title={
                            ad.is_active ? "Nhấn để tạm ẩn" : "Nhấn để bật"
                          }
                        >
                          {ad.is_active ? (
                            <Eye className="w-3.5 h-3.5" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectEdit(ad);
                          }}
                          className="p-1.5 border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(ad);
                          }}
                          className="p-1.5 border border-zinc-800 bg-zinc-900 text-zinc-500 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
                          title="Xóa quảng cáo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Phân trang */}
          {adsData && adsData.totalPages > 1 && (
            <div className="px-6 py-4 bg-black border-t border-zinc-900 flex items-center justify-between text-xs font-mono text-zinc-500 uppercase">
              <div>
                TRANG {adsData.page} / {adsData.totalPages} ({adsData.total}{" "}
                MỤC)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="rounded-none bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 h-8 font-mono text-xs"
                >
                  TRƯỚC
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= adsData.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="rounded-none bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 h-8 font-mono text-xs"
                >
                  SAU
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Sticky Editor Form (Col 5) */}
        <div className="xl:col-span-5 bg-zinc-950 border border-zinc-900 sticky top-8 self-start">
          {/* Form Header */}
          <div className="p-5 border-b border-zinc-900 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                //{" "}
                {editingId
                  ? `CHỈNH SỬA #${editingId.toString().padStart(3, "0")}`
                  : "THÊM MỚI"}
              </div>
              <h3 className="text-base font-outfit text-white uppercase font-medium mt-0.5">
                {editingId
                  ? "Cập Nhật Chiến Dịch"
                  : "Tạo Quảng Cáo & Affiliate"}
              </h3>
            </div>
            {editingId && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResetForm}
                className="rounded-none text-zinc-500 hover:text-white font-mono text-[11px] uppercase h-8 px-2"
              >
                <RotateCcw className="w-3 h-3 mr-1" /> Làm Mới
              </Button>
            )}
          </div>

          {/* Live Preview Box */}
          <div className="p-5 border-b border-zinc-900 bg-black/60 space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 flex items-center justify-between">
              <span>XEM TRƯỚC HIỂN THỊ (LIVE PREVIEW)</span>
              <span className="text-emerald-400">CHẾ ĐỘ THỰC TẾ</span>
            </div>

            {/* Render Preview Card */}
            <div className="border border-zinc-800 bg-zinc-950 p-3 rounded-none">
              <div className="flex gap-3 items-center">
                <div className="relative w-16 h-16 bg-zinc-900 border border-zinc-800 flex-shrink-0 overflow-hidden">
                  {filePreview || formImageUrl ? (
                    <img
                      src={filePreview || getImageUrl(formImageUrl)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-700">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                  )}
                  {formDiscountTag && (
                    <span className="absolute top-0 left-0 bg-[#ee4d2d] text-white text-[8px] font-mono font-bold px-1">
                      {formDiscountTag}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <PlatformBadge platform={formPlatform} />
                    <span className="text-[9px] font-mono text-zinc-600 uppercase ml-auto">
                      Tài Trợ
                    </span>
                  </div>
                  <p className="font-medium text-xs text-white line-clamp-1">
                    {formTitle || "Tiêu đề quảng cáo / sản phẩm..."}
                  </p>
                  <div className="flex items-baseline gap-2">
                    {formSalePrice ? (
                      <span className="font-bold text-xs text-[#ee4d2d] font-mono">
                        {formatVND(formSalePrice)}
                      </span>
                    ) : null}
                    {formOriginalPrice && (
                      <span className="text-[10px] text-zinc-500 line-through font-mono">
                        {formatVND(formOriginalPrice)}
                      </span>
                    )}
                  </div>
                  <div className="pt-0.5">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 uppercase ${
                        formPlatform === "SHOPEE"
                          ? "bg-[#ee4d2d] text-white"
                          : formPlatform === "TIKTOK"
                            ? "bg-zinc-800 text-white border border-zinc-700"
                            : "bg-white text-black"
                      }`}
                    >
                      {formCtaText || "Mua ngay"}
                      <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Chọn sàn TMĐT */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                Nền Tảng Sàn TMĐT *
              </Label>
              <div className="grid grid-cols-5 gap-1">
                {(
                  [
                    "SHOPEE",
                    "TIKTOK",
                    "LAZADA",
                    "TIKI",
                    "OTHER",
                  ] as AdPlatform[]
                ).map((p) => {
                  const isSelected = formPlatform === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handlePlatformChange(p)}
                      className={`flex flex-col items-center justify-center p-2 border text-[10px] font-mono uppercase tracking-wider transition-all ${
                        isSelected
                          ? p === "SHOPEE"
                            ? "bg-[#ee4d2d]/10 border-[#ee4d2d] text-[#ee4d2d]"
                            : p === "TIKTOK"
                              ? "bg-zinc-900 border-white text-white"
                              : "bg-zinc-900 border-white text-white"
                          : "bg-black border-zinc-800 text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {p === "SHOPEE" && (
                        <ShopeeIcon className="w-3.5 h-3.5 mb-1" />
                      )}
                      {p === "TIKTOK" && (
                        <TikTokIcon className="w-3.5 h-3.5 mb-1" />
                      )}
                      {p === "LAZADA" && (
                        <LazadaIcon className="w-3.5 h-3.5 mb-1" />
                      )}
                      {p === "TIKI" && (
                        <TikiIcon className="w-3.5 h-3.5 mb-1" />
                      )}
                      {p === "OTHER" && (
                        <ShoppingBag className="w-3.5 h-3.5 mb-1 text-zinc-500" />
                      )}
                      <span>
                        {p === "SHOPEE"
                          ? "Shopee"
                          : p === "TIKTOK"
                            ? "TikTok"
                            : p}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tiêu đề */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                Tiêu Đề Quảng Cáo / Sản Phẩm *
              </Label>
              <Input
                required
                placeholder="Vd: Săn Sale Shopee 9.9 - Voucher Giảm 50K"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="bg-black border-zinc-800 text-white placeholder:text-zinc-700 font-mono text-xs rounded-none h-9 focus-visible:ring-zinc-700"
              />
            </div>

            {/* Link đích affiliate */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                Link Bán Hàng / Affiliate Link Đích *
              </Label>
              <div className="relative">
                <Link2 className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <Input
                  required
                  placeholder="https://shope.ee/... hoặc https://vt.tiktok.com/..."
                  value={formTargetUrl}
                  onChange={(e) => setFormTargetUrl(e.target.value)}
                  className="pl-8 bg-black border-zinc-800 text-white placeholder:text-zinc-700 font-mono text-xs rounded-none h-9 focus-visible:ring-zinc-700"
                />
              </div>
            </div>

            {/* Vị trí & Định dạng */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                  Vị Trí Phân Bổ *
                </Label>
                <select
                  value={formPlacement}
                  onChange={(e) =>
                    setFormPlacement(e.target.value as AdPlacement)
                  }
                  className="w-full bg-black border border-zinc-800 p-2 text-xs font-mono text-zinc-200 outline-none rounded-none focus:border-zinc-700 uppercase h-9"
                >
                  <option value="HOME_BANNER">Trang chủ (Banner)</option>
                  <option value="STORY_SIDEBAR">Trang truyện (Sidebar)</option>
                  <option value="CHAPTER_BOTTOM">
                    Đọc chương (Cuối trang)
                  </option>
                  <option value="CHAPTER_NAV">
                    Chuyển chương (Mở tab tiếp thị liên kết)
                  </option>
                  <option value="FLOATING_BOTTOM">
                    Modal giữa dưới (Có thể bỏ qua)
                  </option>
                  <option value="ALL">Mọi vị trí</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                  Kiểu Định Dạng *
                </Label>
                <select
                  value={formDisplayType}
                  onChange={(e) =>
                    setFormDisplayType(e.target.value as AdDisplayType)
                  }
                  className="w-full bg-black border border-zinc-800 p-2 text-xs font-mono text-zinc-200 outline-none rounded-none focus:border-zinc-700 uppercase h-9"
                >
                  <option value="BANNER">Banner Ngang Lớn</option>
                  <option value="PRODUCT_CARD">Thẻ Sản Phẩm Mini</option>
                </select>
              </div>
            </div>

            {/* Hình ảnh */}
            <div className="space-y-2 pt-1">
              <Label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                Hình Ảnh Quảng Cáo *
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex flex-col items-center justify-center border border-dashed border-zinc-800 hover:border-zinc-700 p-2.5 cursor-pointer transition-colors bg-black">
                  <Upload className="w-4 h-4 text-zinc-500 mb-1" />
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">
                    Tải file ảnh
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                <div className="flex flex-col justify-center">
                  <Input
                    placeholder="Hoặc dán URL ảnh..."
                    value={formImageUrl}
                    onChange={(e) => {
                      setFormImageUrl(e.target.value);
                      if (!selectedFile) setFilePreview(null);
                    }}
                    className="bg-black border-zinc-800 text-white placeholder:text-zinc-700 font-mono text-[11px] rounded-none h-9"
                  />
                </div>
              </div>
            </div>

            {/* Giá bán & Tag giảm giá */}
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-[10px] font-mono uppercase text-zinc-500">
                  Giá Gốc
                </Label>
                <Input
                  type="number"
                  placeholder="Vd: 150000"
                  value={formOriginalPrice}
                  onChange={(e) => setFormOriginalPrice(e.target.value)}
                  className="bg-black border-zinc-800 text-white font-mono text-xs rounded-none h-8"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] font-mono uppercase text-zinc-500">
                  Giá Sale
                </Label>
                <Input
                  type="number"
                  placeholder="Vd: 99000"
                  value={formSalePrice}
                  onChange={(e) => setFormSalePrice(e.target.value)}
                  className="bg-black border-zinc-800 text-[#ee4d2d] font-mono text-xs font-bold rounded-none h-8"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] font-mono uppercase text-zinc-500">
                  Huy Hiệu
                </Label>
                <Input
                  placeholder="Vd: -30%"
                  value={formDiscountTag}
                  onChange={(e) => setFormDiscountTag(e.target.value)}
                  className="bg-black border-zinc-800 text-white font-mono text-xs rounded-none h-8"
                />
              </div>
            </div>

            {/* Chữ trên nút CTA & Thứ tự */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-[10px] font-mono uppercase text-zinc-500">
                  Nút Bấm (CTA)
                </Label>
                <Input
                  placeholder="Mua ngay"
                  value={formCtaText}
                  onChange={(e) => setFormCtaText(e.target.value)}
                  className="bg-black border-zinc-800 text-white font-mono text-xs rounded-none h-8"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] font-mono uppercase text-zinc-500">
                  Thứ Tự Ưu Tiên
                </Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formSortOrder}
                  onChange={(e) => setFormSortOrder(e.target.value)}
                  className="bg-black border-zinc-800 text-white font-mono text-xs rounded-none h-8"
                />
              </div>
            </div>

            {/* Mô tả ngắn */}
            <div className="space-y-1">
              <Label className="text-[10px] font-mono uppercase text-zinc-500">
                Mô Tả / Ưu Đãi
              </Label>
              <Textarea
                placeholder="Vd: Freeship toàn quốc, voucher 20k cho đơn từ 150k"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={2}
                className="bg-black border-zinc-800 text-white placeholder:text-zinc-700 font-mono text-xs rounded-none"
              />
            </div>

            {/* Switch Active */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="active_switch"
                checked={formIsActive}
                onChange={(e) => setFormIsActive(e.target.checked)}
                className="w-4 h-4 rounded-none bg-black border-zinc-700 text-white cursor-pointer"
              />
              <Label
                htmlFor="active_switch"
                className="text-xs font-mono uppercase text-zinc-400 cursor-pointer"
              >
                Kích hoạt hiển thị chiến dịch
              </Label>
            </div>

            {/* Submit & Reset Button */}
            <div className="pt-2 flex items-center gap-2">
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className="flex-1 rounded-none font-mono text-xs uppercase tracking-widest bg-white text-black hover:bg-zinc-200 h-10 font-medium"
              >
                {isCreating || isUpdating
                  ? "ĐANG XỬ LÝ..."
                  : editingId
                    ? "LƯU THAY ĐỔI"
                    : "TẠO QUẢNG CÁO"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetForm}
                  className="rounded-none border-zinc-800 bg-black text-zinc-400 font-mono text-xs uppercase h-10 px-4"
                >
                  HỦY
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
