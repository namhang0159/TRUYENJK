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

export const useDonate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { story_id: number; item_name: string; coin_amount: number; message?: string }) => {
      const { data } = await axiosInstance.post("/finance/donate", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["topDonators"] });
    },
  });
};

export const useTopDonators = () => {
  return useQuery({
    queryKey: ["topDonators"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/finance/top-donators");
      return data.data;
    },
  });
};
