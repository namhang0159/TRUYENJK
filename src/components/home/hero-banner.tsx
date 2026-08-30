"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useFeaturedStories } from "@/hooks/use-stories";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Play, BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function HeroBanner() {
  const { data: stories, isLoading } = useFeaturedStories();
  const [activeIndex, setActiveIndex] = React.useState(0);

  // Auto cycle active index
  React.useEffect(() => {
    if (!stories?.length) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % Math.min(stories.length, 5));
    }, 5000);
    return () => clearInterval(interval);
  }, [stories]);

  if (isLoading) {
    return <Skeleton className="w-full h-[500px] rounded-3xl" />;
  }

  if (!stories?.length) return null;

  const topStories = stories.slice(0, 5);
  const activeStory = topStories[activeIndex];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-zinc-950/5 dark:bg-zinc-900/20 border border-border/50 shadow-2xl min-h-[500px] flex items-center">
      {/* Dynamic Background based on active story */}
      <motion.div
        key={activeStory.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-cover bg-center blur-3xl scale-110"
        style={{ backgroundImage: `url(${activeStory.coverImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-0" />

      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 md:p-12 lg:p-16 items-center">
        {/* Left: Content */}
        <div className="flex flex-col gap-6">
          <motion.div
            key={`badge-${activeStory.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-fit"
          >
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/20 backdrop-blur-md px-3 py-1.5 text-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Tác phẩm Đề cử
            </Badge>
          </motion.div>

          <motion.h1
            key={`title-${activeStory.id}`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground drop-shadow-sm line-clamp-2"
          >
            {activeStory.title}
          </motion.h1>

          <motion.p
            key={`author-${activeStory.id}`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground flex items-center gap-2"
          >
            Sáng tác bởi <span className="text-foreground font-semibold">{activeStory.author}</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4 mt-4"
          >
            <Button render={<Link href={`/truyen/${activeStory.id}`} />} nativeButton={false} size="lg" className="rounded-full font-semibold shadow-lg shadow-primary/25 h-14 px-8 text-base">
              <BookOpen className="mr-2 h-5 w-5" /> Đọc Ngay
            </Button>
            <Button render={<Link href={`/truyen/${activeStory.id}/audio`} />} nativeButton={false} size="lg" variant="secondary" className="rounded-full bg-secondary/80 backdrop-blur border border-border/50 h-14 px-8 text-base hover:bg-secondary">
              <Play className="mr-2 h-5 w-5" /> Nghe Audio
            </Button>
          </motion.div>
        </div>

        {/* Right: 3D Stacking Cards */}
        <div className="relative h-[400px] hidden md:flex items-center justify-center perspective-[1000px]">
          {topStories.map((story, index) => {
            const isActive = index === activeIndex;
            const diff = (index - activeIndex + topStories.length) % topStories.length;
            
            // Calculate 3D transforms based on position relative to active card
            let x = 0;
            let z = 0;
            let rotateY = 0;
            let opacity = 1;
            let zIndex = 50 - diff;

            if (diff === 0) {
              x = 0; z = 0; rotateY = 0; opacity = 1;
            } else if (diff === 1) {
              x = 80; z = -100; rotateY = -15; opacity = 0.8;
            } else if (diff === 2) {
              x = 160; z = -200; rotateY = -25; opacity = 0.5;
            } else if (diff === topStories.length - 1) {
              x = -80; z = -100; rotateY = 15; opacity = 0;
            } else {
              opacity = 0;
            }

            return (
              <motion.div
                key={story.id}
                initial={false}
                animate={{
                  x,
                  z,
                  rotateY,
                  opacity,
                  scale: isActive ? 1.05 : 1,
                }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
                className={cn(
                  "absolute w-[220px] lg:w-[260px] aspect-[2/3] rounded-2xl shadow-2xl overflow-hidden cursor-pointer",
                  isActive ? "ring-4 ring-primary/50 ring-offset-4 ring-offset-background" : "hover:ring-2 hover:ring-primary/30"
                )}
                style={{ zIndex }}
                onClick={() => setActiveIndex(index)}
              >
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
                {!isActive && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
