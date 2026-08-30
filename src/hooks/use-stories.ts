import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/components/ui/toast";
import { getImageUrl } from "@/lib/utils";

export interface Story {
  id: string | number;
  title: string;
  coverImage: string;
  author: string;
  latestChapter?: string;
  updatedAt?: string;
  views?: number;
  isAudio?: boolean;
  category?: string;
  categories?: { id: string | number, name: string, slug: string }[];
  status?: "Đang ra" | "Hoàn thành";
  wordCount?: number;
  viewCount?: number;
  rating?: number;
  reviewCount?: number;
  summary?: string;
  chapters?: Chapter[];
}

export interface Chapter {
  id: string;
  storyId: string;
  title: string;
  chapterNumber: number;
  isVip: boolean;
  price?: number;
  createdAt: string;
}

const mapStory = (item: any): Story => {
  const maxChapter = item.chapters?.length ? Math.max(...item.chapters.map((c: any) => c.chapter_number)) : 0;
  return {
    id: item.slug || item.id,
    title: item.title,
    author: item.author?.pen_name || "Vô danh",
    coverImage: getImageUrl(item.cover_image),
    latestChapter: maxChapter > 0 ? `Chương ${maxChapter}` : "0 Chương",
    updatedAt: item.updated_at,
    views: item.view_count,
    category: item.categories?.[0]?.name || "Chưa phân loại",
    categories: item.categories || [],
    status: item.status === "COMPLETED" ? "Hoàn thành" : "Đang ra",
  wordCount: item.word_count || 0,
  viewCount: item.view_count || 0,
  rating: item.rating || 0,
  summary: item.summary,
  chapters: item.chapters?.map((c: any) => ({
    id: c.id?.toString() || "",
    storyId: item.slug,
    title: c.title || "",
    chapterNumber: c.chapter_number,
    isVip: c.type === "VIP",
    price: c.coin_price || 0,
    createdAt: c.created_at || ""
  }))
  };
};

export const useFeaturedStories = () => {
  return useQuery({
    queryKey: ["featuredStories"],
    queryFn: async (): Promise<Story[]> => {
      const { data } = await axiosInstance.get('/reader/stories?limit=5');
      return data.data.map(mapStory);
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/reader/categories');
      return data.data;
    },
  });
};

export const useRecentUpdates = () => {
  return useQuery({
    queryKey: ["recentUpdates"],
    queryFn: async (): Promise<Story[]> => {
      const { data } = await axiosInstance.get('/reader/stories?limit=8');
      return data.data.map(mapStory);
    },
  });
};

export const useHotAudioStories = () => {
  return useQuery({
    queryKey: ["hotAudioStories"],
    queryFn: async (): Promise<Story[]> => {
      // Tạm thời lấy danh sách truyện thường, vì chưa có audio logic
      const { data } = await axiosInstance.get('/reader/stories?limit=6');
      return data.data.map((item: any) => ({ ...mapStory(item), isAudio: true }));
    },
  });
};

export const useLeaderboard = (type: "month" | "week" | "nominate") => {
  return useQuery({
    queryKey: ["leaderboard", type],
    queryFn: async (): Promise<Story[]> => {
      let sort = "views";
      if (type === "nominate") sort = "rating";
      const { data } = await axiosInstance.get(`/reader/stories?limit=10&sort_by=${sort}`);
      return data.data.map(mapStory);
    },
  });
};

export const useSearchStories = (keyword: string) => {
  return useQuery({
    queryKey: ["searchStories", keyword],
    queryFn: async (): Promise<Story[]> => {
      if (!keyword) return [];
      const { data } = await axiosInstance.get(`/reader/stories?search=${encodeURIComponent(keyword)}&limit=5`);
      return data.data.map(mapStory);
    },
    enabled: !!keyword,
  });
};

export const useStoryDetail = (slug: string) => {
  return useQuery({
    queryKey: ["storyDetail", slug],
    queryFn: async (): Promise<Story> => {
      const { data } = await axiosInstance.get(`/reader/stories/${slug}`);
      return mapStory(data.data);
    },
  });
};

export const useStoryChapters = (slug: string) => {
  return useQuery({
    queryKey: ["storyChapters", slug],
    queryFn: async (): Promise<Chapter[]> => {
      const { data } = await axiosInstance.get(`/reader/stories/${slug}`);
      return mapStory(data.data).chapters || [];
    },
  });
};

export const useChapterDetail = (slug: string, chapterId: string) => {
  return useQuery({
    queryKey: ["chapterDetail", slug, chapterId],
    queryFn: async () => {
      // chapterId is actually chapter_number in our setup (like /truyen/kiem-dao/1)
      const { data } = await axiosInstance.get(`/reader/stories/${slug}/chapters/${chapterId}`);
      const c = data.data;
      return {
        id: c.id.toString(),
        story_id: c.story_id,
        title: c.title,
        content: c.text_content || c.content || "", // handle backend field name 'text_content'
        isVip: c.type === "VIP",
        price: c.coin_price,
        isUnlocked: c.is_unlocked ?? (c.type !== "VIP")
      };
    },
    retry: false // Don't retry on 403
  });
};

export const useExploreStories = (filters: { category_slug?: string; tag_slug?: string; status?: string; sort_by?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ["exploreStories", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.category_slug && filters.category_slug !== 'all') params.append('category_slug', filters.category_slug);
      if (filters.tag_slug && filters.tag_slug !== 'all') params.append('tag_slug', filters.tag_slug);
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.sort_by) params.append('sort_by', filters.sort_by);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const { data } = await axiosInstance.get(`/reader/stories?${params.toString()}`);
      return {
        stories: data.data.map(mapStory),
        meta: data.meta
      };
    },
  });
};

export const useLibrary = () => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ["library"],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/reader/library');
      return data.data;
    },
    enabled: isAuthenticated,
  });
};

export const useToggleBookmark = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (storyId: string | number) => {
      const { data } = await axiosInstance.post('/reader/library/bookmark', { story_id: storyId });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["library"] });
      if (data.data?.bookmarked) {
        toast.add({ title: "Thành công", description: "Đã lưu truyện vào Tủ sách" });
      } else {
        toast.add({ title: "Thành công", description: "Đã bỏ lưu truyện" });
      }
    },
    onError: () => {
      toast.add({ title: "Lỗi", description: "Có lỗi xảy ra, vui lòng thử lại sau!" });
    }
  });
};

export const useUpsertHistory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { story_id: string | number, chapter_id: string | number, progress_seconds: number }) => {
      const { data } = await axiosInstance.post('/reader/reading-histories', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library"] });
    },
  });
};

export const useReviews = (slug: string) => {
  return useQuery({
    queryKey: ["reviews", slug],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/social/stories/${slug}/reviews`);
      return data.data;
    },
    enabled: !!slug,
  });
};

export const useAddReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { slug: string; rating: number; content: string }) => {
      const { data } = await axiosInstance.post(`/social/stories/${payload.slug}/reviews`, {
        rating: payload.rating,
        content: payload.content,
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.slug] });
      queryClient.invalidateQueries({ queryKey: ["storyDetail", variables.slug] });
    },
  });
};

export const useUnlockChapter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { slug: string, chapterId: string, chapterNumber: string }) => {
      const { data } = await axiosInstance.post(`/finance/unlock/${payload.chapterId}`);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["chapterDetail", variables.slug, variables.chapterNumber] });
      // Might also want to invalidate wallet balance
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
};

export const useCreateReport = () => {
  return useMutation({
    mutationFn: async (data: { target_type: string; target_id: number; reason: string; description?: string }) => {
      const response = await axiosInstance.post(`/social/reports`, data);
      return response.data;
    },
  });
};
