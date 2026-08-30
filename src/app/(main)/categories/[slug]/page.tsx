"use client";

import { useState, useMemo } from "react";
import { StoryCard } from "@/components/story/story-card";
import { useExploreStories, useCategories } from "@/hooks/use-stories";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BookOpen, Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PremiumFilters } from "@/components/ui/premium-filters";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

// Hàm tạo màu gradient ngẫu nhiên nhưng cố định dựa trên string
const getGradientBySlug = (slug: string) => {
  const hash = slug.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  const gradients = [
    "from-violet-500/10 via-transparent to-transparent dark:from-violet-900/30",
    "from-pink-500/10 via-transparent to-transparent dark:from-pink-900/30",
    "from-blue-500/10 via-transparent to-transparent dark:from-blue-900/30",
    "from-amber-500/10 via-transparent to-transparent dark:from-amber-900/30",
    "from-rose-500/10 via-transparent to-transparent dark:from-rose-900/30",
    "from-cyan-500/10 via-transparent to-transparent dark:from-cyan-900/30",
  ];
  const colors = [
    "text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-500/20 shadow-violet-500/10",
    "text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-500/20 shadow-pink-500/10",
    "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20 shadow-blue-500/10",
    "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/20 shadow-amber-500/10",
    "text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-500/20 shadow-rose-500/10",
    "text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-500/20 shadow-cyan-500/10",
  ];
  const textGradients = [
    "from-violet-500 to-fuchsia-500",
    "from-pink-500 to-rose-500",
    "from-blue-500 to-cyan-500",
    "from-amber-500 to-orange-500",
    "from-rose-500 to-red-500",
    "from-cyan-500 to-teal-500",
  ];
  return {
    bg: gradients[hash % gradients.length],
    icon: colors[hash % colors.length],
    text: textGradients[hash % textGradients.length],
  };
};

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { data: categories } = useCategories();
  const currentCategory = categories?.find((c: any) => c.slug === slug);

  const theme = useMemo(() => getGradientBySlug(slug), [slug]);

  const [filters, setFilters] = useState({
    category_slug: slug,
    tag_slug: "all",
    status: "all",
    sort_by: "created_at",
    page: 1,
  });

  const { data, isLoading } = useExploreStories(filters);

  const handleFilterChange = (key: string, value: string) => {
    if (key === "category_slug" && value !== "all") {
      router.push(`/categories/${value}`);
    } else if (key === "category_slug" && value === "all") {
      router.push("/explore");
    } else {
      setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] pb-24">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-black border-b border-zinc-200 dark:border-white/10 pt-16 pb-12">
        <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${theme.bg}`} />
        <div className="container max-w-7xl mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl ${theme.icon}`}
          >
            <BookOpen className="w-8 h-8" />
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-4"
          >
            Thể Loại <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.text}`}>
              {currentCategory ? currentCategory.name : "..."}
            </span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl"
          >
            {currentCategory?.description || "Khám phá những bộ truyện hay nhất và mới nhất thuộc thể loại này. Các tác phẩm được chọn lọc kỹ lưỡng dành riêng cho bạn."}
          </motion.p>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8 space-y-10">
        {/* Filters */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="sticky top-[72px] z-40 bg-zinc-50/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl py-4 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          <PremiumFilters 
            categories={categories || []} 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />
        </motion.div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="aspect-[2/3] w-full rounded-2xl bg-zinc-200 dark:bg-zinc-800/50" />
                <Skeleton className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800/50" />
                <Skeleton className="h-3 w-1/2 bg-zinc-200 dark:bg-zinc-800/50" />
              </div>
            ))}
          </div>
        ) : data?.stories?.length === 0 ? (
           <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-full py-32 flex flex-col items-center justify-center text-center bg-white dark:bg-zinc-900/20 rounded-3xl border border-zinc-100 dark:border-white/5 shadow-sm"
          >
            <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-zinc-400 dark:text-zinc-500" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Không tìm thấy truyện</h3>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md">Chưa có bộ truyện nào thuộc thể loại này với các bộ lọc bạn đã chọn.</p>
            <Button 
              onClick={() => setFilters({ category_slug: slug, tag_slug: "all", status: "all", sort_by: "created_at", page: 1 })}
              className={`mt-6 rounded-full bg-gradient-to-r ${theme.text} text-white border-0`}
            >
              Xóa bộ lọc
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-6"
          >
            {data?.stories?.map((story: any) => (
              <motion.div key={story.id} variants={itemVariants}>
                <StoryCard story={story} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {data?.meta && data.meta.total_pages > 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center items-center gap-3 pt-12"
          >
            <Button 
              variant="outline" 
              className="rounded-full border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              disabled={filters.page === 1}
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
            >
              Trang trước
            </Button>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full px-6 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 shadow-sm">
              Trang {filters.page} / {data.meta.total_pages}
            </div>
            <Button 
              variant="outline" 
              className="rounded-full border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              disabled={filters.page === data.meta.total_pages}
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
            >
              Trang sau
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
