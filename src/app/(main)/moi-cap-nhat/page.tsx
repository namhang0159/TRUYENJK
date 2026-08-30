"use client";

import { useState } from "react";
import { StoryCard } from "@/components/story/story-card";
import { useExploreStories, useCategories } from "@/hooks/use-stories";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Search, Clock } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { PremiumFilters } from "@/components/ui/premium-filters";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function MoiCapNhatPage() {
  const [filters, setFilters] = useState({
    category_slug: "all",
    tag_slug: "all",
    status: "all",
    sort_by: "updated_at",
    page: 1,
  });

  const { data, isLoading } = useExploreStories(filters);
  const { data: categories } = useCategories();

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] pb-24">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-black border-b border-zinc-200 dark:border-white/10 pt-16 pb-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent dark:from-emerald-900/30" />
        <div className="container max-w-7xl mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/10 relative"
          >
            {/* Pulsing glow */}
            <div className="absolute inset-0 rounded-2xl bg-emerald-400/30 animate-ping" />
            <Clock className="w-8 h-8 relative z-10" />
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex items-center gap-3 mb-4"
          >
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white">
              Mới <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Cập Nhật</span>
            </h1>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </motion.div>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl"
          >
            Bám sát nhịp độ của tác giả. Những chương truyện nóng hổi vừa mới "ra lò" đều tụ hội tại đây.
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
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md">Chúng tôi không tìm thấy truyện nào phù hợp với bộ lọc hiện tại. Thử thay đổi thể loại hoặc trạng thái xem sao.</p>
            <Button 
              onClick={() => setFilters({ category_slug: "all", tag_slug: "all", status: "all", sort_by: "updated_at", page: 1 })}
              className="mt-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white"
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
