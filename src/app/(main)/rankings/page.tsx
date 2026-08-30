"use client";

import { useExploreStories } from "@/hooks/use-stories";
import { useTopDonators } from "@/hooks/use-finance";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, TrendingUp, Star, Gem, Eye, Crown } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const podiumVariants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 200, damping: 20 } },
};

const listContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

export default function RankingsPage() {
  const { data: topViewsData, isLoading: isLoadingViews } = useExploreStories({ sort_by: "views", limit: 20 });
  const topViews = topViewsData?.stories || [];

  const { data: topRatingData, isLoading: isLoadingRating } = useExploreStories({ sort_by: "rating", limit: 20 });
  const topRating = topRatingData?.stories || [];

  const { data: topDonators, isLoading: isLoadingDonators } = useTopDonators();

  const renderPodium = (items: any[], type: "views" | "rating" | "donators") => {
    if (items.length < 3) return null;
    
    // Sắp xếp: Top 2 (Trái), Top 1 (Giữa), Top 3 (Phải)
    const podiumItems = [
      { item: items[1], rank: 2, height: "h-[180px]", color: "from-slate-300 via-gray-400 to-slate-500", shadow: "shadow-slate-400/50", delay: 0.2 },
      { item: items[0], rank: 1, height: "h-[220px]", color: "from-yellow-400 via-amber-500 to-yellow-600", shadow: "shadow-yellow-500/50", delay: 0.1 },
      { item: items[2], rank: 3, height: "h-[150px]", color: "from-amber-600 via-orange-700 to-amber-800", shadow: "shadow-amber-700/50", delay: 0.3 },
    ];

    return (
      <div className="flex justify-center items-end gap-2 sm:gap-6 pt-12 pb-16 px-4">
        {podiumItems.map((pi, idx) => (
          <motion.div 
            key={idx}
            variants={podiumVariants}
            initial="hidden"
            animate="show"
            transition={{ delay: pi.delay }}
            className={`relative flex flex-col items-center w-28 sm:w-40 ${pi.rank === 1 ? '-translate-y-4' : ''}`}
          >
            {/* Avatar / Cover */}
            <div className="relative z-20 mb-4 group cursor-pointer">
              {pi.rank === 1 && (
                <Crown className="w-8 h-8 text-yellow-400 absolute -top-8 left-1/2 -translate-x-1/2 drop-shadow-md z-30" />
              )}
              {type === "donators" ? (
                <Avatar className={`w-20 h-20 sm:w-28 sm:h-28 border-4 border-transparent bg-gradient-to-br ${pi.color} p-1 shadow-xl group-hover:scale-105 transition-transform`}>
                  <div className="w-full h-full rounded-full overflow-hidden bg-black">
                    <AvatarImage src={pi.item?.reader?.account?.avatar_url} className="object-cover" />
                    <AvatarFallback className="text-2xl font-black bg-zinc-800 text-white">{pi.item?.reader?.account?.display_name?.charAt(0) || 'U'}</AvatarFallback>
                  </div>
                </Avatar>
              ) : (
                <Link href={`/truyen/${pi.item.id}`}>
                  <div className={`w-20 h-28 sm:w-28 sm:h-40 rounded-xl p-1 bg-gradient-to-br ${pi.color} shadow-xl group-hover:scale-105 transition-transform`}>
                    <img src={pi.item.coverImage} className="w-full h-full object-cover rounded-lg" alt="" />
                  </div>
                </Link>
              )}
              
              {/* Rank Badge */}
              <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center font-black text-white text-lg shadow-lg bg-gradient-to-br ${pi.color} border-2 border-white dark:border-black`}>
                {pi.rank}
              </div>
            </div>

            {/* Title / Name */}
            <div className="text-center w-full px-1 mb-3">
              <h3 className="font-bold text-sm sm:text-base line-clamp-2 text-zinc-900 dark:text-white leading-tight">
                {type === "donators" ? (pi.item?.reader?.account?.display_name || 'Ẩn Danh') : pi.item.title}
              </h3>
              <p className="text-xs text-zinc-500 font-medium mt-1">
                {type === "donators" ? (
                  <span className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold"><Gem className="w-3 h-3"/> {pi.item.total_donated} Xu</span>
                ) : type === "rating" ? (
                  <span className="flex items-center justify-center gap-1 text-yellow-500 font-bold"><Star className="w-3 h-3 fill-current"/> {Number(pi.item.rating || 0).toFixed(1)}</span>
                ) : (
                  <span className="flex items-center justify-center gap-1 text-blue-500 font-bold"><Eye className="w-3 h-3"/> {(pi.item.views || 0).toLocaleString()}</span>
                )}
              </p>
            </div>

            {/* Podium Block */}
            <div className={`w-full ${pi.height} rounded-t-xl bg-gradient-to-b ${pi.color} opacity-20 dark:opacity-30 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-white/20 dark:bg-black/20" />
              <div className="absolute top-0 inset-x-0 h-1 bg-white/50 dark:bg-white/30" />
            </div>
            {/* Glow under podium */}
            <div className={`absolute bottom-0 w-[150%] h-8 bg-gradient-to-r ${pi.color} blur-xl opacity-30 -z-10`} />
          </motion.div>
        ))}
      </div>
    );
  };

  const renderList = (items: any[], type: "views" | "rating" | "donators") => {
    const listItems = items.slice(3);
    if (listItems.length === 0) return null;

    return (
      <motion.div 
        variants={listContainerVariants}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto space-y-3"
      >
        {listItems.map((item: any, idx: number) => {
          const rank = idx + 4;
          return (
            <motion.div key={item.id || item.reader_id} variants={listItemVariants}>
              {type === "donators" ? (
                <div className="group flex items-center gap-4 sm:gap-6 p-4 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-white/5 hover:border-indigo-500/30 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-all shadow-sm">
                  <div className="w-8 sm:w-12 text-center font-black text-xl sm:text-2xl text-zinc-300 dark:text-zinc-700 italic">
                    {rank}
                  </div>
                  <Avatar className="w-12 h-12 sm:w-14 sm:h-14 border border-zinc-200 dark:border-zinc-800">
                    <AvatarImage src={item.reader?.account?.avatar_url} className="object-cover" />
                    <AvatarFallback className="font-bold">{item.reader?.account?.display_name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base sm:text-lg text-zinc-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {item.reader?.account?.display_name || 'Độc giả Ẩn Danh'}
                    </h3>
                  </div>
                  <div className="text-right flex items-center gap-1.5 sm:gap-2 font-black text-emerald-600 dark:text-emerald-400 text-base sm:text-xl shrink-0">
                    <Gem className="w-4 h-4 sm:w-5 sm:h-5" />
                    {item.total_donated} <span className="text-xs sm:text-sm font-semibold opacity-70">Xu</span>
                  </div>
                </div>
              ) : (
                <Link href={`/truyen/${item.id}`}>
                  <div className="group flex items-center gap-4 sm:gap-6 p-3 sm:p-4 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-white/5 hover:border-indigo-500/30 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-all shadow-sm">
                    <div className="w-8 sm:w-12 text-center font-black text-xl sm:text-2xl text-zinc-300 dark:text-zinc-700 italic shrink-0">
                      {rank}
                    </div>
                    <div className="w-12 h-16 sm:w-16 sm:h-24 rounded-lg overflow-hidden shrink-0">
                      <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h3 className="font-bold text-base sm:text-lg text-zinc-900 dark:text-white line-clamp-1 sm:line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 truncate">{item.author}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {type === "rating" ? (
                        <div className="flex items-center gap-1.5 font-black text-yellow-500 text-lg sm:text-xl">
                          <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                          {Number(item.rating || 0).toFixed(1)}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 font-bold text-blue-500 text-base sm:text-lg">
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                          {(item.views || 0).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] pb-24">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-black border-b border-zinc-200 dark:border-white/10 pt-16 pb-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent dark:from-yellow-900/30" />
        <div className="container max-w-7xl mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-16 h-16 rounded-2xl bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 flex items-center justify-center mb-6 shadow-xl shadow-yellow-500/10"
          >
            <Trophy className="w-8 h-8" />
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-4"
          >
            Bảng <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-500">Xếp Hạng</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl"
          >
            Tôn vinh những siêu phẩm xuất sắc nhất và tri ân các đại gia bạo chi của tháng.
          </motion.p>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-4 py-8">
        <Tabs defaultValue="views" className="w-full">
          <TabsList className="flex flex-wrap md:inline-flex w-full md:w-auto mx-auto mb-8 bg-zinc-200/50 dark:bg-zinc-900/50 p-1 rounded-2xl shadow-inner backdrop-blur-md justify-center">
            <TabsTrigger value="views" className="flex-1 md:flex-none gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm transition-all text-sm font-bold">
              <TrendingUp className="w-4 h-4" /> Đọc Nhiều
            </TabsTrigger>
            <TabsTrigger value="rating" className="flex-1 md:flex-none gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-yellow-600 dark:data-[state=active]:text-yellow-400 data-[state=active]:shadow-sm transition-all text-sm font-bold">
              <Star className="w-4 h-4" /> Đánh Giá
            </TabsTrigger>
            <TabsTrigger value="donators" className="flex-1 md:flex-none gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-sm transition-all text-sm font-bold">
              <Gem className="w-4 h-4" /> Đại Gia
            </TabsTrigger>
          </TabsList>

          <TabsContent value="views" className="focus-visible:outline-none focus-visible:ring-0">
            {isLoadingViews ? (
              <div className="space-y-4 max-w-4xl mx-auto">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-full h-24 rounded-2xl bg-zinc-200 dark:bg-zinc-800/50" />)}
              </div>
            ) : (
              <div>
                {renderPodium(topViews, "views")}
                {renderList(topViews, "views")}
              </div>
            )}
          </TabsContent>

          <TabsContent value="rating" className="focus-visible:outline-none focus-visible:ring-0">
            {isLoadingRating ? (
              <div className="space-y-4 max-w-4xl mx-auto">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-full h-24 rounded-2xl bg-zinc-200 dark:bg-zinc-800/50" />)}
              </div>
            ) : (
              <div>
                {renderPodium(topRating, "rating")}
                {renderList(topRating, "rating")}
              </div>
            )}
          </TabsContent>

          <TabsContent value="donators" className="focus-visible:outline-none focus-visible:ring-0">
            {isLoadingDonators ? (
              <div className="space-y-4 max-w-4xl mx-auto">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-full h-24 rounded-2xl bg-zinc-200 dark:bg-zinc-800/50" />)}
              </div>
            ) : topDonators?.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-zinc-900/50 rounded-3xl border border-zinc-100 dark:border-white/5 shadow-sm max-w-4xl mx-auto">
                <Gem className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
                <p className="text-lg text-zinc-500 font-medium">Chưa có dữ liệu tặng quà tháng này.</p>
              </div>
            ) : (
              <div>
                {renderPodium(topDonators, "donators")}
                {renderList(topDonators, "donators")}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
