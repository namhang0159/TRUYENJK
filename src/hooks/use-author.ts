import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

export const useAuthorStories = () => {
  return useQuery({
    queryKey: ["authorStories"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/author/stories");
      return data.data;
    },
  });
};

export const useCreateStory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await axiosInstance.post("/author/stories", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authorStories"] });
    },
  });
};

export const useAuthorStory = (storyId: string | number) => {
  return useQuery({
    queryKey: ["authorStory", storyId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/author/stories/${storyId}`);
      return data.data;
    },
    enabled: !!storyId,
  });
};

export const useUpdateStory = (storyId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await axiosInstance.put(`/author/stories/${storyId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authorStories"] });
      queryClient.invalidateQueries({ queryKey: ["authorStory", storyId] });
    },
  });
};

export const useCreateChapter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (chapterData: any) => {
      const { data } = await axiosInstance.post("/author/chapters", chapterData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["authorStories"] });
      // If we had a specific story's chapter list query, we would invalidate it here
    },
  });
};

export const useAuthorChapter = (chapterId: string | number) => {
  return useQuery({
    queryKey: ["authorChapter", chapterId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/author/chapters/${chapterId}`);
      return data.data;
    },
    enabled: !!chapterId,
  });
};

export const useUpdateChapter = (chapterId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (chapterData: any) => {
      const { data } = await axiosInstance.put(`/author/chapters/${chapterId}`, chapterData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authorChapter", chapterId] });
      queryClient.invalidateQueries({ queryKey: ["authorStories"] });
      queryClient.invalidateQueries({ queryKey: ["chapterVersions", chapterId] });
    },
  });
};

export const useChapterVersions = (chapterId: string | number) => {
  return useQuery({
    queryKey: ["chapterVersions", chapterId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/author/chapters/${chapterId}/versions`);
      return data.data;
    },
    enabled: !!chapterId,
  });
};

export const useAuthorRevenue = () => {
  return useQuery({
    queryKey: ["authorRevenue"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/author/revenue");
      return data.data;
    },
  });
};

export const useAuthorWithdrawals = () => {
  return useQuery({
    queryKey: ["authorWithdrawals"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/author/withdrawals");
      return data.data;
    },
  });
};

export const useCreateWithdrawal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { amount: number; bankName: string; bankAccountNumber: string; bankAccountName: string }) => {
      const { data } = await axiosInstance.post("/author/withdrawals", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authorWithdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["authorRevenue"] });
    },
  });
};

export const useGenerateAudio = (chapterId: string | number) => {
  return useMutation({
    mutationFn: async (voiceId: number) => {
      const { data } = await axiosInstance.post(`/audio/chapters/${chapterId}/audio`, { voice_id: voiceId });
      return data;
    },
  });
};
