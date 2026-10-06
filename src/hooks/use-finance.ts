import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

export interface Transaction {
  id: number;
  type: string;
  amount: number;
  status: string;
  balance_before: number;
  balance_after: number;
  description: string;
  created_at: string;
}

export const useWallet = () => {
  return useQuery({
    queryKey: ["wallet"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/finance/wallet");
      return data.data; // { id, reader_id, coin_balance }
    },
  });
};

export const useTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async (): Promise<Transaction[]> => {
      const { data } = await axiosInstance.get("/finance/transactions");
      return data.data;
    },
  });
};

export const useCreateDeposit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { amount: number; payment_method: string }) => {
      const { data } = await axiosInstance.post("/payment/create-deposit", payload);
      return data;
    },
    onSuccess: () => {
      // Invalidate to refresh wallet/transactions if needed (webhook will actually do the update, but good practice)
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

export interface StoryTopDonator {
  reader_id: number;
  total_coins?: number;
  total_donated?: number;
  donation_count?: number;
  reader?: {
    id: number;
    display_name?: string;
    username?: string;
    avatar_url?: string;
    account?: {
      id?: number;
      display_name?: string;
    };
  };
}

export interface StoryRecentDonation {
  id: number;
  story_id: number;
  reader_id: number;
  coin_amount: number;
  item_name: string;
  message?: string;
  created_at: string;
  reader?: {
    id: number;
    display_name?: string;
    username?: string;
    avatar_url?: string;
  };
}

export interface StoryDonationsData {
  topDonators: StoryTopDonator[];
  recentDonations: StoryRecentDonation[];
  totalCoins: number;
  totalCount: number;
}

export interface GiftItem {
  id: number;
  name: string;
  code: string;
  coin_price: number;
  icon: string;
  tier: "COMMON" | "RARE" | "EPIC" | "LEGENDARY" | "MYTHIC";
  color: string;
  description: string;
  sort_order: number;
  is_active: boolean;
}

export const useGifts = () => {
  return useQuery({
    queryKey: ["gifts"],
    queryFn: async (): Promise<GiftItem[]> => {
      const { data } = await axiosInstance.get("/finance/gifts");
      return data.data;
    },
  });
};

export interface DonatePayload {
  story_id: number | string;
  item_name?: string;
  coin_amount?: number;
  gift_id?: number;
  quantity?: number;
  message?: string;
}

export const useDonate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: DonatePayload) => {
      const { data } = await axiosInstance.post("/finance/donate", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["topDonators"] });
      queryClient.invalidateQueries({ queryKey: ["storyDonations"] });
    },
  });
};

export const useTopDonators = (storyId?: number | string) => {
  return useQuery({
    queryKey: ["topDonators", storyId],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/finance/top-donators", {
        params: storyId ? { storyId } : undefined,
      });
      return data.data;
    },
  });
};

export const useStoryDonations = (storyId?: number | string) => {
  return useQuery({
    queryKey: ["storyDonations", storyId],
    queryFn: async (): Promise<StoryDonationsData | null> => {
      if (!storyId) return null;
      const { data } = await axiosInstance.get(`/finance/stories/${storyId}/donations`);
      return data.data;
    },
    enabled: Boolean(storyId),
  });
};
