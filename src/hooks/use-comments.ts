import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

export interface CommentUser {
  id: number;
  email: string;
  reader?: {
    display_name: string;
    avatar_url: string;
    tier: string;
  };
  author?: {
    pen_name: string;
    avatar_url: string;
  };
}

export interface CommentItem {
  id: number;
  account_id: number;
  story_id: number;
  chapter_id: number | null;
  parent_id: number | null;
  content: string;
  like_count: number;
  status: string;
  created_at: string;
  account?: CommentUser;
  replies?: CommentItem[];
}

export interface CommentsResponse {
  message: string;
  data: CommentItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function useComments(params: {
  storyId?: number;
  chapterId?: number;
  page?: number;
  limit?: number;
}) {
  return useQuery<CommentsResponse>({
    queryKey: ["comments", params],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (params.storyId) query.append("storyId", String(params.storyId));
      if (params.chapterId) query.append("chapterId", String(params.chapterId));
      if (params.page) query.append("page", String(params.page));
      if (params.limit) query.append("limit", String(params.limit));

      const { data } = await axiosInstance.get(`/comments?${query.toString()}`);
      return data;
    },
    enabled: !!(params.storyId || params.chapterId),
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      storyId: number;
      chapterId?: number | null;
      parentId?: number | null;
      content: string;
    }) => {
      const { data } = await axiosInstance.post("/comments", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
}

export function useLikeComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: number) => {
      const { data } = await axiosInstance.post(`/comments/${commentId}/like`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: number) => {
      const { data } = await axiosInstance.delete(`/comments/${commentId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
}
