"use client";

import { useRecentUpdates } from "@/hooks/use-stories";
import { StoryCard } from "@/components/story/story-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronRight, Clock, Star } from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function SectionNewUpdates() {
  const { data: stories, isLoading } = useRecentUpdates();

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-8 bg-gradient-to-b from-primary to-blue-600 rounded-full inline-block"></span>
            Truyện Mới Cập Nhật
          </h2>
          <p className="text-muted-foreground mt-1 ml-3 text-sm">Các tác phẩm vừa ra lò chương mới nhất</p>
        </div>
        <Button variant="outline" render={<Link href="/moi-cap-nhat" />} nativeButton={false} className="hidden sm:flex rounded-full group hover:border-primary/50">
          <div className="flex items-center gap-1">
            Xem tất cả <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Button>
      </div>

      <motion.div 
        key={isLoading ? "loading" : "loaded"}
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
      >
        {isLoading
          ? Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className={`flex flex-col gap-2 ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
              <Skeleton className="w-full h-full min-h-[200px] rounded-2xl" />
            </div>
          ))
          : stories?.slice(0, 7).map((story, i) => {
              const isFeatured = i === 0;
              return (
                <motion.div 
                  key={story.id} 
                  variants={itemVariants}
                  className={isFeatured ? "col-span-2 row-span-2 md:col-span-2 md:row-span-2" : ""}
                >
                  {isFeatured ? (
                    <Link href={`/truyen/${story.id}`} className="group relative w-full h-full min-h-[300px] md:min-h-[400px] rounded-3xl overflow-hidden flex shadow-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                      <img 
                        src={story.coverImage} 
                        alt={story.title} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 z-20 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Vừa cập nhật
                      </div>
                      
                      <div className="relative z-20 mt-auto p-6 flex flex-col gap-2">
                        <h3 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md group-hover:text-primary transition-colors leading-tight">
                          {story.title}
                        </h3>
                        <p className="text-zinc-300 text-sm md:text-base flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> 
                          {story.author}
                        </p>
                        <p className="text-white/80 text-sm line-clamp-2 mt-2 max-w-lg">
                          Chương mới: <span className="font-semibold text-primary-foreground/90">{story.latestChapter}</span>
                        </p>
                      </div>
                    </Link>
                  ) : (
                    <StoryCard story={story} />
                  )}
                </motion.div>
              );
            })}
      </motion.div>

      <Button variant="outline" className="w-full sm:hidden mt-4 rounded-full">
        Xem tất cả
      </Button>
    </section>
  );
}
