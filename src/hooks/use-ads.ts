import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

export type AdPlatform = "SHOPEE" | "TIKTOK" | "LAZADA" | "TIKI" | "OTHER";
export type AdPlacement = "HOME_BANNER" | "STORY_SIDEBAR" | "CHAPTER_BOTTOM" | "FLOATING_BOTTOM" | "CHAPTER_NAV" | "ALL";
export type AdDisplayType = "BANNER" | "PRODUCT_CARD";

export interface Advertisement {
  id: number;
  title: string;
  platform: AdPlatform;
  placement: AdPlacement;
  display_type: AdDisplayType;
  target_url: string;
  image_url: string;
  description: string | null;
  original_price: number | null;
  sale_price: number | null;
  discount_tag: string | null;
  cta_text: string;
  sort_order: number;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  views_count: number;
  clicks_count: number;
  created_at: string;
  updated_at: string;
}

export interface AdminAdStats {
  totalAds: number;
  activeAds: number;
  totalViews: number;
  totalClicks: number;
  ctr: number;
  byPlatform: Record<string, { total: number; clicks: number; views: number }>;
}

export interface AdminAdsResponse {
  ads: Advertisement[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

// ==================== READER HOOKS ====================

/**
 * Lấy danh sách quảng cáo đang kích hoạt theo vị trí hiển thị
 */
export const useReaderAds = (placement?: AdPlacement | string) => {
  return useQuery<Advertisement[]>({
    queryKey: ["readerAds", placement || "ALL"],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (placement) params.append("placement", placement);
      const { data } = await axiosInstance.get(`/reader/ads?${params.toString()}`);
      return data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 phút
  });
};

/**
 * Ghi nhận lượt click chuyển sàn
 */
export const useTrackAdClick = () => {
  return useMutation({
    mutationFn: async (adId: number) => {
      const { data } = await axiosInstance.post(`/reader/ads/${adId}/click`);
      return data.data;
    },
  });
};

/**
 * Ghi nhận lượt hiển thị (view)
 */
export const useTrackAdImpression = () => {
  return useMutation({
    mutationFn: async (adId: number) => {
      const { data } = await axiosInstance.post(`/reader/ads/${adId}/impression`);
      return data.data;
    },
  });
};

// ==================== ADMIN HOOKS ====================

/**
 * Lấy danh sách quảng cáo quản trị kèm bộ lọc
 */
export const useAdminAds = (params: {
  page?: number;
  limit?: number;
  search?: string;
  platform?: string;
  placement?: string;
  is_active?: string;
}) => {
  return useQuery<AdminAdsResponse>({
    queryKey: ["adminAds", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.search) queryParams.append("search", params.search);
      if (params.platform && params.platform !== "ALL") queryParams.append("platform", params.platform);
      if (params.placement && params.placement !== "ALL") queryParams.append("placement", params.placement);
      if (params.is_active !== undefined && params.is_active !== "ALL") queryParams.append("is_active", params.is_active);

      const { data } = await axiosInstance.get(`/admin/ads?${queryParams.toString()}`);
      return data.data;
    },
  });
};

/**
 * Lấy thống kê hiệu quả quảng cáo cho Admin
 */
export const useAdminAdStats = () => {
  return useQuery<AdminAdStats>({
    queryKey: ["adminAdStats"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/admin/ads/stats");
      return data.data;
    },
  });
};

/**
 * Tạo mới quảng cáo
 */
export const useCreateAd = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await axiosInstance.post("/admin/ads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAds"] });
      queryClient.invalidateQueries({ queryKey: ["adminAdStats"] });
      queryClient.invalidateQueries({ queryKey: ["readerAds"] });
    },
  });
};

/**
 * Cập nhật quảng cáo
 */
export const useUpdateAd = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, formData }: { id: number; formData: FormData }) => {
      const { data } = await axiosInstance.put(`/admin/ads/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAds"] });
      queryClient.invalidateQueries({ queryKey: ["adminAdStats"] });
      queryClient.invalidateQueries({ queryKey: ["readerAds"] });
    },
  });
};

/**
 * Bật / Tắt hiển thị quảng cáo
 */
export const useToggleAdActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axiosInstance.patch(`/admin/ads/${id}/toggle`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAds"] });
      queryClient.invalidateQueries({ queryKey: ["adminAdStats"] });
      queryClient.invalidateQueries({ queryKey: ["readerAds"] });
    },
  });
};

/**
 * Xóa quảng cáo
 */
export const useDeleteAd = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axiosInstance.delete(`/admin/ads/${id}`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAds"] });
      queryClient.invalidateQueries({ queryKey: ["adminAdStats"] });
      queryClient.invalidateQueries({ queryKey: ["readerAds"] });
    },
  });
};
