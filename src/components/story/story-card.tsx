"use client";

import Link from "next/link";
import { Story } from "@/hooks/use-stories";
import { Headphones, Eye, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface StoryCardProps {
  story: Story;
  layout?: "vertical" | "horizontal";
  showRank?: number;
  badgeTopLeft?: string;
}

export function StoryCard({ story, layout = "vertical", showRank, badgeTopLeft }: StoryCardProps) {
  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-400 via-amber-500 to-yellow-600 shadow-yellow-500/50 ring-1 ring-yellow-400/50";
      case 2:
        return "from-slate-300 via-gray-400 to-slate-500 shadow-slate-400/50 ring-1 ring-slate-300/50";
      case 3:
        return "from-amber-600 via-orange-700 to-amber-800 shadow-amber-700/50 ring-1 ring-amber-600/50";
      default:
        return "from-gray-600 to-gray-800 shadow-gray-700/50 ring-1 ring-gray-600/50";
    }
  };

  if (layout === "horizontal") {
    return (
      <Link href={`/truyen/${story.id}`} className="block h-full w-full">
        <motion.div 
          whileHover={{ scale: 1.02, x: 4 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="group flex gap-4 p-3 rounded-2xl bg-white/5 dark:bg-zinc-900/40 hover:bg-white/10 dark:hover:bg-zinc-800/60 border border-transparent hover:border-indigo-500/30 transition-colors relative"
        >
          {showRank && (
            <div className={`absolute -left-3 -top-3 w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-lg z-20 bg-gradient-to-br ${getRankStyle(showRank)} rotate-[-6deg] group-hover:rotate-0 transition-transform duration-300`}>
              {showRank}
            </div>
          )}
          {badgeTopLeft && !showRank && (
            <div className="absolute left-2 top-2 z-20">
              <Badge className="bg-indigo-500/90 text-white backdrop-blur-md shadow-lg text-[10px] px-2 py-0.5 border border-indigo-400/30 font-semibold tracking-wider">
                {badgeTopLeft}
              </Badge>
            </div>
          )}
          <div className="relative w-20 h-28 sm:w-24 sm:h-32 flex-shrink-0 overflow-hidden rounded-xl shadow-md border border-white/10">
            <motion.img 
              src={story.coverImage} 
              alt={story.title} 
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            {story.isAudio && (
              <div className="absolute bottom-1.5 right-1.5 bg-black/60 rounded-full p-1.5 backdrop-blur-md border border-white/20 shadow-xl">
                <Headphones className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>
          <div className="flex flex-col py-1 flex-1 justify-between">
            <div>
              <h3 className="font-bold text-sm sm:text-base line-clamp-2 text-zinc-800 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                {story.title}
              </h3>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 flex items-center gap-1 font-medium">
                {story.author}
              </span>
            </div>
            <div className="mt-auto flex flex-col gap-1.5">
              {story.latestChapter && (
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <Sparkles className="w-3 h-3" />
                  <span className="line-clamp-1">{story.latestChapter}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
                {story.updatedAt && <span>{story.updatedAt}</span>}
                {story.views !== undefined && (
                  <span className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded-full">
                    <Eye className="w-3 h-3"/> {(story.views / 1000).toFixed(1)}k
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  // Vertical Layout (Card)
  return (
    <Link href={`/truyen/${story.id}`} className="block h-full w-full">
      <motion.div 
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative flex flex-col h-full rounded-2xl bg-transparent"
      >
        {/* Glow effect behind card */}
        <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/20 blur-2xl transition-all duration-500 -z-10 rounded-full" />

        {showRank && (
          <div className={`absolute -left-2 -top-2 w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-base shadow-lg z-20 bg-gradient-to-br ${getRankStyle(showRank)} rotate-[-6deg] group-hover:rotate-0 transition-transform duration-300`}>
            {showRank}
          </div>
        )}
        
        {badgeTopLeft && !showRank && (
          <div className="absolute left-2 top-2 z-20">
            <Badge className="bg-primary/80 backdrop-blur-md shadow-xl text-xs font-semibold px-2.5 py-0.5 border border-white/20">
              {badgeTopLeft}
            </Badge>
          </div>
        )}

        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl shadow-md border border-zinc-200 dark:border-white/10 group-hover:shadow-xl group-hover:border-indigo-500/50 transition-all duration-500">
          <motion.img 
            src={story.coverImage} 
            alt={story.title} 
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.12 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          {/* Elegant gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          
          {story.isAudio && (
            <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md border border-white/20 text-[10px] px-2 py-1 rounded-full flex items-center gap-1 text-white shadow-lg font-medium">
              <Headphones className="w-3 h-3" /> Audio
            </div>
          )}
          
          {story.latestChapter && (
            <div className="absolute bottom-3 left-3 right-3">
              <span className="text-xs font-bold text-white line-clamp-1 drop-shadow-md flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                {story.latestChapter}
              </span>
            </div>
          )}
        </div>
        <div className="pt-3 px-1">
          <h3 className="font-bold text-sm sm:text-base line-clamp-2 text-zinc-800 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
            {story.title}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1 font-medium">{story.author}</p>
        </div>
      </motion.div>
    </Link>
  );
}
