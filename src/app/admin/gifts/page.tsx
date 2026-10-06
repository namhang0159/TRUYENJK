"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Gift,
  Coins,
  Users,
  TrendingUp,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  Heart,
  Coffee,
  Gem,
  Trophy,
  Crown,
  Rocket,
  Castle,
  Flame,
  Zap,
  Star,
  Shield,
  PartyPopper,
  Disc,
  Beer,
  Smile,
  Wand2,
  RotateCcw,
} from "lucide-react";
import {
  useAdminGifts,
  useCreateGift,
  useUpdateGift,
  useDeleteGift,
  useToggleGiftActive,
  AdminGiftItem,
} from "@/hooks/use-admin";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Icon options mapping
export const AVAILABLE_ICONS: { [key: string]: React.ElementType } = {
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

export const TIER_CONFIG: Record<
  string,
  { label: string; color: string; border: string; bg: string; text: string }
> = {
  COMMON: {
    label: "Thường",
    color: "text-zinc-300",
    border: "border-zinc-700",
    bg: "bg-zinc-800/60",
    text: "text-zinc-400",
  },
  RARE: {
    label: "Hiếm",
    color: "text-blue-400",
    border: "border-blue-500/40",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
  },
  EPIC: {
    label: "Cực Phẩm",
    color: "text-purple-400",
    border: "border-purple-500/40",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
  },
  LEGENDARY: {
    label: "Huyền Thoại",
    color: "text-amber-400",
    border: "border-amber-500/40",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
  },
  MYTHIC: {
    label: "Thần Thoại",
    color: "text-rose-400",
    border: "border-rose-500/40",
    bg: "bg-rose-500/10",
    text: "text-rose-400",
  },
};

export const COLOR_OPTIONS = [
  { label: "Đỏ Hồng", value: "text-rose-500", bg: "bg-rose-500" },
  { label: "Hổ Phách", value: "text-amber-500", bg: "bg-amber-500" },
  { label: "Hồng Phấn", value: "text-pink-500", bg: "bg-pink-500" },
  { label: "Cam Lửa", value: "text-orange-500", bg: "bg-orange-500" },
  { label: "Xanh Lam", value: "text-cyan-400", bg: "bg-cyan-400" },
  { label: "Vàng Gold", value: "text-yellow-400", bg: "bg-yellow-400" },
  { label: "Tím Huyền", value: "text-purple-400", bg: "bg-purple-400" },
  { label: "Xanh Ngọc", value: "text-emerald-400", bg: "bg-emerald-400" },
  { label: "Đỏ Rực", value: "text-red-500", bg: "bg-red-500" },
];

export default function AdminGiftsPage() {
  const { data, isLoading } = useAdminGifts();
  const { mutate: createGift, isPending: isCreating } = useCreateGift();
  const { mutate: updateGift, isPending: isUpdating } = useUpdateGift();
  const { mutate: deleteGift, isPending: isDeleting } = useDeleteGift();
  const { mutate: toggleActive, isPending: isToggling } = useToggleGiftActive();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    coin_price: 10,
    icon: "Gift",
    tier: "COMMON",
    color: "text-amber-500",
    description: "",
    sort_order: 0,
    is_active: true,
  });

  const handleResetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      code: "",
      coin_price: 10,
      icon: "Gift",
      tier: "COMMON",
      color: "text-amber-500",
      description: "",
      sort_order: 0,
      is_active: true,
    });
  };

  const handleSelectEdit = (gift: AdminGiftItem) => {
    setEditingId(gift.id);
    setFormData({
      name: gift.name || "",
      code: gift.code || "",
      coin_price: gift.coin_price || 10,
      icon: gift.icon || "Gift",
      tier: gift.tier || "COMMON",
      color: gift.color || "text-amber-500",
      description: gift.description || "",
      sort_order: gift.sort_order || 0,
      is_active: gift.is_active !== undefined ? gift.is_active : true,
    });

    // Smooth scroll to form on mobile/desktop
    const formElement = document.getElementById("gift-editor-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên quà tặng");
      return;
    }
    if (Number(formData.coin_price) <= 0) {
      toast.error("Giá Xu phải lớn hơn 0");
      return;
    }

    if (editingId) {
      updateGift(
        { id: editingId, ...formData },
        {
          onSuccess: () => {
            toast.success("Cập nhật quà tặng thành công!");
            handleResetForm();
          },
          onError: (err: any) => {
            toast.error(err.response?.data?.message || "Lỗi khi cập nhật quà tặng");
          },
        }
      );
    } else {
      createGift(formData, {
        onSuccess: () => {
          toast.success("Thêm quà tặng mới thành công!");
          handleResetForm();
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "Lỗi khi tạo quà tặng");
        },
      });
    }
  };

  const handleDelete = (gift: AdminGiftItem) => {
    if (
      confirm(
        `Xác nhận xóa quà tặng "${gift.name}"? Nếu quà đã có độc giả ủng hộ, hệ thống sẽ chuyển sang trạng thái Ẩn để bảo toàn lịch sử giao dịch.`
      )
    ) {
      deleteGift(gift.id, {
        onSuccess: (res: any) => {
          toast.success(res?.message || "Thao tác thành công!");
          if (editingId === gift.id) handleResetForm();
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "Lỗi khi xóa quà tặng");
        },
      });
    }
  };

  const handleToggle = (gift: AdminGiftItem) => {
    toggleActive(gift.id, {
      onSuccess: () => {
        toast.success(
          `Đã ${!gift.is_active ? "kích hoạt" : "tạm ẩn"} quà tặng "${gift.name}"`
        );
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || "Lỗi khi cập nhật trạng thái");
      },
    });
  };

  const gifts = data?.gifts || [];
  const summary = data?.summary || {
    totalGifts: 0,
    activeGifts: 0,
    totalDonations: 0,
    totalRevenueCoins: 0,
    topGift: null,
  };

  // Preview icon component
  const PreviewIconComponent = AVAILABLE_ICONS[formData.icon] || Gift;
  const previewTier = TIER_CONFIG[formData.tier] || TIER_CONFIG.COMMON;

  return (
    <div className="space-y-10 pb-16">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-zinc-900">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Gift className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">
              Tài Chính // Quản Trị Quà Tặng
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-outfit font-medium tracking-tight text-white uppercase">
            Quản Lý Quà Tặng
          </h1>
          <p className="text-zinc-500 font-mono text-xs tracking-wide uppercase mt-1">
            Thiết lập danh mục quà tặng · Theo dõi doanh thu · Lượt người ủng hộ
          </p>
        </div>

        <Button
          onClick={handleResetForm}
          className="h-11 rounded-none bg-white hover:bg-zinc-200 text-black font-mono text-xs tracking-widest uppercase flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Thêm Quà Mới
        </Button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Gifts */}
        <div className="bg-zinc-950 border border-zinc-900 p-6 relative overflow-hidden group hover:border-zinc-800 transition-colors">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-mono uppercase mb-3">
            <span>Tổng Loại Quà</span>
            <Gift className="w-4 h-4 text-zinc-600 group-hover:text-amber-400 transition-colors" />
          </div>
          <div className="text-3xl font-outfit font-semibold text-white tracking-tight">
            {isLoading ? <Skeleton className="h-9 w-16 bg-zinc-900" /> : summary.totalGifts}
          </div>
          <div className="mt-2 text-[11px] font-mono text-zinc-500 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {summary.activeGifts} đang hiển thị · {summary.totalGifts - summary.activeGifts} đang ẩn
          </div>
        </div>

        {/* Card 2: Total Donors / Donations */}
        <div className="bg-zinc-950 border border-zinc-900 p-6 relative overflow-hidden group hover:border-zinc-800 transition-colors">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-mono uppercase mb-3">
            <span>Tổng Lượt Tặng</span>
            <Users className="w-4 h-4 text-zinc-600 group-hover:text-blue-400 transition-colors" />
          </div>
          <div className="text-3xl font-outfit font-semibold text-white tracking-tight">
            {isLoading ? <Skeleton className="h-9 w-24 bg-zinc-900" /> : summary.totalDonations.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] font-mono text-zinc-500">
            Lượt tặng thành công trên hệ thống
          </div>
        </div>

        {/* Card 3: Total Revenue */}
        <div className="bg-zinc-950 border border-zinc-900 p-6 relative overflow-hidden group hover:border-zinc-800 transition-colors">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-mono uppercase mb-3">
            <span>Tổng Doanh Thu Quà</span>
            <Coins className="w-4 h-4 text-amber-500/70 group-hover:text-amber-400 transition-colors" />
          </div>
          <div className="text-3xl font-outfit font-semibold text-amber-400 tracking-tight flex items-baseline gap-1.5">
            {isLoading ? (
              <Skeleton className="h-9 w-32 bg-zinc-900" />
            ) : (
              <>
                {summary.totalRevenueCoins.toLocaleString()}
                <span className="text-xs font-mono text-zinc-500 font-normal">Xu</span>
              </>
            )}
          </div>
          <div className="mt-2 text-[11px] font-mono text-zinc-500">
            Ủng hộ trực tiếp cho tác giả & sàn
          </div>
        </div>

        {/* Card 4: Top Gift */}
        <div className="bg-zinc-950 border border-zinc-900 p-6 relative overflow-hidden group hover:border-zinc-800 transition-colors">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-mono uppercase mb-3">
            <span>Quà Hot Nhất</span>
            <TrendingUp className="w-4 h-4 text-zinc-600 group-hover:text-rose-400 transition-colors" />
          </div>
          <div className="text-xl font-outfit font-semibold text-white tracking-tight truncate">
            {isLoading ? (
              <Skeleton className="h-9 w-28 bg-zinc-900" />
            ) : summary.topGift ? (
              summary.topGift.name
            ) : (
              "—"
            )}
          </div>
          <div className="mt-2 text-[11px] font-mono text-zinc-500 truncate">
            {summary.topGift
              ? `${summary.topGift.total_revenue.toLocaleString()} Xu · ${summary.topGift.sender_count} người tặng`
              : "Chưa có dữ liệu tặng"}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Table & Right Editor Form */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Side: Gifts Table (Col 8) */}
        <div className="xl:col-span-8 bg-zinc-950 border border-zinc-900">
          <div className="p-5 border-b border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-outfit text-white uppercase font-medium">
                Danh Sách Quà Tặng Hệ Thống
              </h2>
              <p className="text-[11px] font-mono text-zinc-500">
                Sắp xếp theo thứ tự hiển thị · Bấm vào hàng để chỉnh sửa
              </p>
            </div>
            <div className="text-xs font-mono text-zinc-400 bg-zinc-900/60 px-3 py-1.5 border border-zinc-800 self-start sm:self-auto">
              {gifts.length} MÓN QUÀ
            </div>
          </div>

          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-2 p-4 bg-black/60 border-b border-zinc-900 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            <div className="col-span-4">Quà Tặng / Cấp Bậc</div>
            <div className="col-span-2 text-right">Giá Xu</div>
            <div className="col-span-2 text-right">Người Tặng</div>
            <div className="col-span-2 text-right">Doanh Thu</div>
            <div className="col-span-2 text-right">Thao Tác</div>
          </div>

          {/* Table Body */}
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full bg-zinc-900 rounded-none" />
              ))}
            </div>
          ) : gifts.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <Gift className="w-10 h-10 text-zinc-700 mx-auto" />
              <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">
                Chưa có quà tặng nào trong hệ thống
              </p>
              <Button
                onClick={handleResetForm}
                variant="outline"
                className="h-9 rounded-none font-mono text-xs uppercase text-white border-zinc-800"
              >
                Tạo quà đầu tiên
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-zinc-900/80">
              <AnimatePresence>
                {gifts.map((gift: AdminGiftItem) => {
                  const IconComp = AVAILABLE_ICONS[gift.icon] || Gift;
                  const tierInfo = TIER_CONFIG[gift.tier] || TIER_CONFIG.COMMON;
                  const isSelected = editingId === gift.id;

                  return (
                    <div
                      key={gift.id}
                      onClick={() => handleSelectEdit(gift)}
                      className={`grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-2 p-4 items-center cursor-pointer transition-colors group ${
                        isSelected
                          ? "bg-zinc-900/80 border-l-2 border-white"
                          : "hover:bg-zinc-900/40"
                      }`}
                    >
                      {/* Item Info */}
                      <div className="col-span-1 md:col-span-4 flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded border flex items-center justify-center shrink-0 ${tierInfo.bg} ${tierInfo.border}`}
                        >
                          <IconComp className={`w-5 h-5 ${gift.color || tierInfo.color}`} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white truncate group-hover:text-amber-400 transition-colors">
                              {gift.name}
                            </span>
                            {!gift.is_active && (
                              <Badge
                                variant="outline"
                                className="text-[9px] font-mono uppercase bg-red-500/10 text-red-400 border-red-500/20 px-1 py-0"
                              >
                                Đang ẩn
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] font-mono ${tierInfo.text}`}>
                              {tierInfo.label}
                            </span>
                            <span className="text-zinc-700 text-xs">·</span>
                            <span className="text-[10px] font-mono text-zinc-500 truncate">
                              #{gift.code}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Coin Price */}
                      <div className="col-span-1 md:col-span-2 md:text-right flex md:flex-col justify-between items-center md:items-end">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase md:hidden">
                          Giá Xu:
                        </span>
                        <div className="font-mono text-xs font-bold text-amber-400 flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5" />
                          {gift.coin_price.toLocaleString()}
                        </div>
                      </div>

                      {/* Donors Count */}
                      <div className="col-span-1 md:col-span-2 md:text-right flex md:flex-col justify-between items-center md:items-end">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase md:hidden">
                          Người Tặng:
                        </span>
                        <div>
                          <div className="font-mono text-xs text-white">
                            {gift.sender_count || 0} <span className="text-zinc-500 text-[10px]">người</span>
                          </div>
                          <div className="text-[10px] font-mono text-zinc-500">
                            {gift.total_sent || 0} lượt tặng
                          </div>
                        </div>
                      </div>

                      {/* Revenue */}
                      <div className="col-span-1 md:col-span-2 md:text-right flex md:flex-col justify-between items-center md:items-end">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase md:hidden">
                          Doanh Thu:
                        </span>
                        <div>
                          <div className="font-mono text-xs font-semibold text-emerald-400">
                            {(gift.total_revenue || 0).toLocaleString()} Xu
                          </div>
                          <div className="text-[10px] font-mono text-zinc-500">
                            Doanh số tích lũy
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div
                        className="col-span-1 md:col-span-2 flex items-center justify-end gap-1.5 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-900"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggle(gift)}
                          disabled={isToggling}
                          title={gift.is_active ? "Tạm ẩn quà này" : "Kích hoạt quà này"}
                          className={`h-8 w-8 rounded-none transition-colors ${
                            gift.is_active
                              ? "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                              : "text-zinc-600 hover:text-zinc-400 hover:bg-zinc-900"
                          }`}
                        >
                          {gift.is_active ? (
                            <Eye className="w-3.5 h-3.5" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5" />
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSelectEdit(gift)}
                          className="h-8 w-8 rounded-none text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(gift)}
                          disabled={isDeleting}
                          className="h-8 w-8 rounded-none text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Xóa quà"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Right Side: Editor / Creator Form (Col 4) */}
        <div id="gift-editor-form" className="xl:col-span-4 sticky top-6 space-y-6">
          <div className="bg-zinc-950 border border-zinc-900">
            {/* Form Header */}
            <div className="p-5 border-b border-zinc-900 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-outfit text-white uppercase font-medium">
                  {editingId ? "Chỉnh Sửa Quà Tặng" : "Tạo Mới Quà Tặng"}
                </h3>
                <p className="text-[10px] font-mono text-zinc-500">
                  {editingId ? `ID: #${editingId.toString().padStart(3, "0")}` : "Thêm quà mới vào catalog"}
                </p>
              </div>

              {editingId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetForm}
                  className="h-7 text-[10px] font-mono uppercase text-zinc-400 hover:text-white rounded-none flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Hủy Sửa
                </Button>
              )}
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              {/* Tên Quà Tặng */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                  Tên Quà Tặng <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      name,
                      code:
                        !editingId && !prev.code
                          ? name
                              .toLowerCase()
                              .normalize("NFD")
                              .replace(/[\u0300-\u036f]/g, "")
                              .replace(/[^a-z0-9]+/g, "_")
                              .replace(/^_+|_+$/g, "")
                          : prev.code,
                    }));
                  }}
                  required
                  placeholder="VD: Trà Sữa Full Topping"
                  className="bg-black border-zinc-800 rounded-none h-10 text-xs font-sans text-white focus-visible:ring-0 focus-visible:border-amber-400"
                />
              </div>

              {/* Mã Định Danh Code & Giá Xu */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                    Mã Code
                  </Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="tra_sua"
                    className="bg-black border-zinc-800 rounded-none h-10 text-xs font-mono text-zinc-300 focus-visible:ring-0 focus-visible:border-amber-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coin_price" className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                    Giá Xu <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-500" />
                    <Input
                      id="coin_price"
                      type="number"
                      min={1}
                      value={formData.coin_price}
                      onChange={(e) =>
                        setFormData({ ...formData, coin_price: Math.max(1, Number(e.target.value)) })
                      }
                      required
                      className="bg-black border-zinc-800 rounded-none h-10 pl-9 text-xs font-mono font-bold text-amber-400 focus-visible:ring-0 focus-visible:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Phân Cấp Tier */}
              <div className="space-y-2">
                <Label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                  Cấp Bậc (Tier)
                </Label>
                <div className="grid grid-cols-3 gap-1.5">
                  {Object.keys(TIER_CONFIG).map((tierKey) => {
                    const tier = TIER_CONFIG[tierKey];
                    const isSelected = formData.tier === tierKey;
                    return (
                      <button
                        type="button"
                        key={tierKey}
                        onClick={() => setFormData({ ...formData, tier: tierKey })}
                        className={`p-2 text-center rounded-none text-[10px] font-mono uppercase tracking-wider border transition-all ${
                          isSelected
                            ? "bg-white text-black font-bold border-white"
                            : "bg-black text-zinc-400 border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        {tier.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bộ Chọn Icon */}
              <div className="space-y-2">
                <Label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                  Biểu Tượng (Icon)
                </Label>
                <div className="grid grid-cols-6 gap-1.5 p-2 bg-black border border-zinc-800 max-h-36 overflow-y-auto">
                  {Object.keys(AVAILABLE_ICONS).map((iconKey) => {
                    const IconItem = AVAILABLE_ICONS[iconKey];
                    const isSelected = formData.icon === iconKey;
                    return (
                      <button
                        type="button"
                        key={iconKey}
                        onClick={() => setFormData({ ...formData, icon: iconKey })}
                        className={`p-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-amber-500/20 text-amber-400 ring-1 ring-amber-400"
                            : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
                        }`}
                        title={iconKey}
                      >
                        <IconItem className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Màu Sắc / Accent */}
              <div className="space-y-2">
                <Label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                  Màu Sắc Nhận Diện
                </Label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      type="button"
                      key={c.value}
                      onClick={() => setFormData({ ...formData, color: c.value })}
                      className={`w-6 h-6 rounded-full ${c.bg} transition-all relative ${
                        formData.color === c.value
                          ? "ring-2 ring-white ring-offset-2 ring-offset-black scale-110"
                          : "opacity-60 hover:opacity-100"
                      }`}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              {/* Mô Tả Lời Chúc */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                  Mô Tả / Ý Nghĩa Lời Chúc
                </Label>
                <Textarea
                  id="description"
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Lời chúc truyền năng lượng gửi đến tác giả..."
                  className="bg-black border-zinc-800 rounded-none text-xs font-sans text-white resize-none focus-visible:ring-0 focus-visible:border-amber-400"
                />
              </div>

              {/* Thứ Tự Sắp Xếp & Trạng Thái */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-2">
                  <Label htmlFor="sort_order" className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                    Thứ Tự (Sort)
                  </Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                    className="bg-black border-zinc-800 rounded-none h-10 text-xs font-mono text-white focus-visible:ring-0 focus-visible:border-amber-400"
                  />
                </div>

                <div className="space-y-2 flex flex-col justify-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-zinc-300">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4 rounded-none accent-amber-500 bg-black border-zinc-800"
                    />
                    <span>Kích Hoạt (Hiện)</span>
                  </label>
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="pt-3 border-t border-zinc-900 space-y-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                  Xem Trước Thẻ Quà Tặng (Preview):
                </span>
                <div
                  className={`p-4 rounded-xl border relative overflow-hidden bg-black/80 flex flex-col items-center text-center gap-2.5 shadow-lg ${previewTier.border}`}
                >
                  <div className="absolute top-2 right-2">
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${previewTier.bg} ${previewTier.border} ${previewTier.text}`}
                    >
                      {previewTier.label}
                    </span>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mt-2 ${previewTier.bg} ${previewTier.border}`}
                  >
                    <PreviewIconComponent className={`w-6 h-6 ${formData.color}`} />
                  </div>
                  <div>
                    <span className="font-semibold text-sm text-white block">
                      {formData.name || "Tên Món Quà"}
                    </span>
                    <span className="text-[11px] text-zinc-400 block line-clamp-1 mt-0.5 px-4">
                      {formData.description || "Ý nghĩa và thông điệp gửi tác giả..."}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                    {formData.coin_price} <Coins className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="w-full h-11 rounded-none bg-white hover:bg-zinc-200 text-black font-mono text-xs tracking-widest uppercase font-bold"
                >
                  {isCreating || isUpdating
                    ? "ĐANG XỬ LÝ..."
                    : editingId
                    ? "LƯU THAY ĐỔI"
                    : "TẠO QUÀ MỚI"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
