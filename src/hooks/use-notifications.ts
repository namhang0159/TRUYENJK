import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

export interface NotificationItem {
  id: number;
  account_id: number;
  title: string;
  content: string | null;
  image_url: string | null;
  action_link: string | null;
  action_type: string | null;
  is_read: boolean;
  created_at: string;
}

export interface NotificationsResponse {
  message: string;
  data: NotificationItem[];
  unreadCount: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function useNotifications(page: number = 1, limit: number = 20, enabled: boolean = true) {
  return useQuery<NotificationsResponse>({
    queryKey: ["notifications", page, limit],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/notifications?page=${page}&limit=${limit}`);
      return data;
    },
    enabled,
    refetchInterval: 30000, // Polling định kỳ 30 giây nếu chưa có websocket event
  });
}

export function useUnreadNotificationsCount(enabled: boolean = true) {
  return useQuery<{ unreadCount: number }>({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/notifications/unread-count");
      return data;
    },
    enabled,
    refetchInterval: 30000,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId: number) => {
      const { data } = await axiosInstance.patch(`/notifications/${notificationId}/read`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.patch("/notifications/read-all");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
