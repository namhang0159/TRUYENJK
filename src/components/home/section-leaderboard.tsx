"use client";

import { useLeaderboard, Story } from "@/hooks/use-stories";
import { StoryCard } from "@/components/story/story-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Trophy, ChevronRight, Crown, Medal } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function PodiumItem({ story, rank }: { story: Story, rank: number }) {
  const isFirst = rank === 1;
  const isSecond = rank === 2;
  const isThird = rank === 3;
  
  return (
    <Link href={`/truyen/${story.id}`} className={cn(
      "flex flex-col items-center relative group",
      isFirst ? "order-2 z-20" : isSecond ? "order-1 z-10" : "order-3 z-10",
      isFirst ? "-mt-4" : "mt-8"
    )}>
      {/* Rank Badge / Crown */}
      <div className={cn(
        "absolute -top-4 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-lg z-30 transition-transform group-hover:-translate-y-2",
        isFirst ? 'bg-gradient-to-br from-yellow-300 to-yellow-600 scale-125 -top-6' : 
        isSecond ? 'bg-gradient-to-br from-slate-300 to-slate-500' : 
        'bg-gradient-to-br from-amber-600 to-orange-800'
      )}>
        {isFirst ? <Crown className="w-5 h-5" /> : rank}
      </div>
      
      {/* Cover Image */}
      <div className={cn(
        "relative rounded-lg overflow-hidden shadow-xl transition-transform duration-500 group-hover:scale-110",
        isFirst ? "w-24 h-36 ring-4 ring-yellow-500/50" : "w-20 h-28 ring-2 ring-border"
      )}>
        <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
      </div>
      
      {/* Podium Base */}
      <div className={cn(
        "w-full bg-gradient-to-t mt-2 rounded-t-md border-t border-white/10 flex flex-col items-center pt-2 px-1",
        isFirst ? "h-24 from-yellow-900/40 to-yellow-500/20" : 
        isSecond ? "h-16 from-slate-900/40 to-slate-500/20" : 
        "h-12 from-orange-900/40 to-orange-500/20"
      )}>
        <span className="text-[10px] sm:text-xs font-bold text-center line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {story.title}
        </span>
      </div>
    </Link>
  );
}

function LeaderboardColumn({ type, title }: { type: "month" | "week" | "nominate", title: string }) {
  const { data: stories, isLoading } = useLeaderboard(type);

  return (
    <div className="flex flex-col border rounded-3xl overflow-hidden bg-card shadow-lg hover:shadow-xl transition-shadow relative">
      {/* Subtle background glow */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-primary/5 to-transparent z-0" />
      
      <div className="relative z-10 p-5 border-b flex items-center justify-between bg-card/50 backdrop-blur-sm">
        <h3 className="text-lg font-bold flex items-center gap-2">
          {type === 'nominate' ? <Trophy className="h-5 w-5 text-yellow-500" /> : <Medal className="h-5 w-5 text-primary" />}
          {title}
        </h3>
        <Button variant="ghost" size="sm" render={<Link href={`/bxh/${type}`} />} nativeButton={false} className="h-8 text-xs rounded-full">
          Xem tất cả
        </Button>
      </div>
      
      <ScrollArea className="h-[550px]">
        <div className="p-4 flex flex-col gap-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-40 w-full rounded-xl" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <>
              {/* Top 3 Podium */}
              {stories && stories.length >= 3 && (
                <div className="flex justify-center items-end gap-2 sm:gap-4 mt-8 mb-4 px-2">
                  <PodiumItem story={stories[1]} rank={2} />
                  <PodiumItem story={stories[0]} rank={1} />
                  <PodiumItem story={stories[2]} rank={3} />
                </div>
              )}
              
              {/* Rank 4-10 */}
              <div className="flex flex-col gap-3">
                {stories?.slice(3, 10).map((story, index) => (
                  <StoryCard 
                    key={story.id} 
                    story={story} 
                    layout="horizontal" 
                    showRank={index + 4}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export function SectionLeaderboard() {
  return (
    <section className="space-y-8 pt-8 relative">
      <div className="flex flex-col">
        <h2 className="text-3xl font-black tracking-tight flex items-center gap-2">
          <span className="w-1.5 h-8 bg-gradient-to-b from-red-500 to-orange-500 rounded-full inline-block"></span>
          Bảng Xếp Hạng
        </h2>
        <p className="text-muted-foreground mt-1 ml-3 text-sm">Những tác phẩm được yêu thích nhất mọi thời đại</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <LeaderboardColumn type="month" title="Top Tháng" />
        <LeaderboardColumn type="week" title="Top Tuần" />
        <LeaderboardColumn type="nominate" title="Top Đề Cử" />
      </div>
    </section>
  );
}
