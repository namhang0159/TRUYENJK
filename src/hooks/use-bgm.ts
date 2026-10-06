import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

export interface BgmTrack {
  id: number;
  key: string;
  title: string;
  description: string | null;
  genre: string | null;
  audio_url: string;
  icon_name: string;
  color: string;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

// 1. Hook lấy danh sách BGM công khai cho Trình phát Audio
export const useBgmTracks = () => {
  return useQuery<BgmTrack[]>({
    queryKey: ["publicBgmTracks"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/bgm/public");
      return data.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

// 2. Hook Admin lấy toàn bộ danh sách BGM
export const useAdminBgmTracks = () => {
  return useQuery<BgmTrack[]>({
    queryKey: ["adminBgmTracks"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/bgm/admin");
      return data.data || [];
    },
  });
};

// 3. Hook Admin tạo BGM mới
export const useCreateBgm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await axiosInstance.post("/bgm/admin", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBgmTracks"] });
      queryClient.invalidateQueries({ queryKey: ["publicBgmTracks"] });
    },
  });
};

// 4. Hook Admin cập nhật BGM
export const useUpdateBgm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, formData }: { id: number; formData: FormData }) => {
      const { data } = await axiosInstance.put(`/bgm/admin/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBgmTracks"] });
      queryClient.invalidateQueries({ queryKey: ["publicBgmTracks"] });
    },
  });
};

// 5. Hook Admin xóa BGM
export const useDeleteBgm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axiosInstance.delete(`/bgm/admin/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBgmTracks"] });
      queryClient.invalidateQueries({ queryKey: ["publicBgmTracks"] });
    },
  });
};

// 6. Hook Admin bật/tắt trạng thái BGM
export const useToggleBgm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axiosInstance.patch(`/bgm/admin/${id}/toggle-status`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBgmTracks"] });
      queryClient.invalidateQueries({ queryKey: ["publicBgmTracks"] });
    },
  });
};
