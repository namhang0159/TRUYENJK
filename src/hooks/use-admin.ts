import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

export const useSystemStats = () => {
  return useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/admin/stats");
      return data.data;
    },
  });
};

export const useAdminAudioStories = (page = 1, limit = 20, search = "") => {
  return useQuery({
    queryKey: ["adminAudioStories", page, limit, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search) params.append("search", search);
      
      const { data } = await axiosInstance.get(`/admin/audios/stories?${params.toString()}`);
      return data.data;
    },
  });
};

export const useAdminStoryAudioChapters = (storyId: number | string, page = 1, limit = 50) => {
  return useQuery({
    queryKey: ["adminStoryAudioChapters", storyId, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      const { data } = await axiosInstance.get(`/admin/audios/stories/${storyId}/chapters?${params.toString()}`);
      return data.data;
    },
    enabled: !!storyId,
  });
};

export const useAdminStories = (page = 1, limit = 20, search = "", status = "", visibility = "") => {
  return useQuery({
    queryKey: ["adminStories", page, limit, search, status, visibility],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search) params.append("search", search);
      if (status) params.append("status", status);
      if (visibility) params.append("visibility", visibility);
      
      const { data } = await axiosInstance.get(`/admin/stories?${params.toString()}`);
      return data.data;
    },
  });
};

export const useToggleStoryVisibility = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (storyId: number) => {
      const { data } = await axiosInstance.put(`/admin/stories/${storyId}/toggle-visibility`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminStories"] });
    },
  });
};

export const useAdminCategories = () => {
  return useQuery({
    queryKey: ["adminCategories"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/admin/categories`);
      return data.data;
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; slug: string }) => {
      const { data } = await axiosInstance.post(`/admin/categories`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: number; name?: string; slug?: string }) => {
      const { data } = await axiosInstance.put(`/admin/categories/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await axiosInstance.delete(`/admin/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
    },
  });
};

export const useAdminUsers = (page = 1, limit = 20, search = "", status = "", verified = "") => {
  return useQuery({
    queryKey: ["adminUsers", page, limit, search, status, verified],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search) params.append("search", search);
      if (status) params.append("status", status);
      if (verified) params.append("verified", verified);
      
      const { data } = await axiosInstance.get(`/admin/users?${params.toString()}`);
      return data.data;
    },
  });
};

export const useAdminUserDetail = (userId: number | null) => {
  return useQuery({
    queryKey: ["adminUserDetail", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await axiosInstance.get(`/admin/users/${userId}`);
      return data.data;
    },
    enabled: !!userId,
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: number) => {
      const { data } = await axiosInstance.put(`/admin/users/${userId}/toggle-active`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
  });
};

export const useAdminTransactions = (page = 1, limit = 20, type = "", status = "") => {
  return useQuery({
    queryKey: ["adminTransactions", page, limit, type, status],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (type) params.append("type", type);
      if (status) params.append("status", status);
      
      const { data } = await axiosInstance.get(`/admin/transactions?${params.toString()}`);
      return data.data;
    },
  });
};

export const useManualTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, amount, type, description }: { userId: number; amount: number; type: 'ADD' | 'SUBTRACT'; description: string }) => {
      const { data } = await axiosInstance.post(`/admin/users/${userId}/transactions`, { amount, type, description });
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["adminTransactions"] });
      queryClient.invalidateQueries({ queryKey: ["adminUserDetail", variables.userId] });
    },
  });
};

export const useAdminSettings = () => {
  return useQuery({
    queryKey: ["adminSettings"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/admin/settings`);
      return data.data;
    },
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: { key: string; value: string }[]) => {
      const { data } = await axiosInstance.put(`/admin/settings`, { settings });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSettings"] });
    },
  });
};

// --- Approvals ---

export const useApproveStory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: 'APPROVED' | 'REJECTED' }) => {
      const { data } = await axiosInstance.patch(`/admin/stories/${id}/approve`, { status });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminStories"] });
    },
  });
};

export const useAdminChapters = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ["adminChapters", page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      const { data } = await axiosInstance.get(`/admin/chapters?${params.toString()}`);
      return data.data;
    },
  });
};

export const useApproveChapter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: 'PUBLISHED' | 'REJECTED' }) => {
      const { data } = await axiosInstance.patch(`/admin/chapters/${id}/approve`, { status });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminChapters"] });
    },
  });
};

export const useAdminPayouts = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ["adminPayouts", page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      const { data } = await axiosInstance.get(`/admin/payouts?${params.toString()}`);
      return data.data;
    },
  });
};

export const useApprovePayout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: 'SUCCESS' | 'REJECTED' }) => {
      const { data } = await axiosInstance.patch(`/admin/payouts/${id}/approve`, { status });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPayouts"] });
      queryClient.invalidateQueries({ queryKey: ["adminTransactions"] });
    },
  });
};

// --- Authors Approval ---
export const useAdminAuthors = (page = 1, limit = 20, status = "") => {
  return useQuery({
    queryKey: ["adminAuthors", page, limit, status],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (status) params.append("status", status);
      const { data } = await axiosInstance.get(`/admin/authors?${params.toString()}`);
      return data.data;
    },
  });
};

export const useApproveAuthor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: 'ACTIVE' | 'REJECTED' }) => {
      const { data } = await axiosInstance.patch(`/admin/authors/${id}/approve`, { status });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAuthors"] });
    },
  });
};

// --- Revenue ---
export const useAdminRevenue = () => {
  return useQuery({
    queryKey: ["adminRevenue"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/admin/reports/revenue`);
      return data.data;
    },
  });
};

// --- Story Detail ---
export const useAdminStoryDetail = (storyId: number) => {
  return useQuery({
    queryKey: ["adminStoryDetail", storyId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/admin/stories/${storyId}/detail`);
      return data.data;
    },
    enabled: !!storyId,
  });
};

export const useAdminUpdateStory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number, payload: any }) => {
      const { data } = await axiosInstance.put(`/admin/stories/${id}`, payload);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["adminStoryDetail", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["adminStories"] });
    },
  });
};

export const useAdminUpdateChapter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ storyId, chapterId, payload }: { storyId: number, chapterId: number, payload: any }) => {
      const { data } = await axiosInstance.put(`/admin/stories/${storyId}/chapters/${chapterId}`, payload);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["adminStoryDetail", variables.storyId] });
    },
  });
};

export const useAdminToggleChapterLock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ storyId, chapterId }: { storyId: number, chapterId: number }) => {
      const { data } = await axiosInstance.patch(`/admin/stories/${storyId}/chapters/${chapterId}/toggle-lock`);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["adminStoryDetail", variables.storyId] });
    },
  });
};

// --- Reports ---
export const useAdminReports = (page = 1, limit = 20, status = "") => {
  return useQuery({
    queryKey: ["adminReports", page, limit, status],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (status) params.append("status", status);
      const { data } = await axiosInstance.get(`/admin/reports?${params.toString()}`);
      return data.data;
    },
  });
};

export const useResolveReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: 'RESOLVED' | 'REJECTED' }) => {
      const { data } = await axiosInstance.patch(`/admin/reports/${id}/resolve`, { status });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminReports"] });
    },
  });
};


