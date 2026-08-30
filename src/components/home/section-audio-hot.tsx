"use client";

import { useHotAudioStories } from "@/hooks/use-stories";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Headphones, ChevronRight, PlayCircle, Disc3 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function SectionAudioHot() {
  const { data: stories, isLoading } = useHotAudioStories();

  return (
    <section className="space-y-6 py-12 relative overflow-hidden rounded-3xl bg-zinc-950 text-white">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-green-500/10 via-transparent to-transparent opacity-50 blur-3xl mix-blend-screen" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 flex items-center justify-between px-6 sm:px-12">
        <div className="flex flex-col">
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <Headphones className="h-6 w-6 text-green-400" />
            </div>
            Thính Quán Premium
          </h2>
          <p className="text-zinc-400 mt-2 text-sm">Trải nghiệm thính giác đỉnh cao, giọng đọc AI truyền cảm</p>
        </div>
        <Button variant="ghost" render={<Link href="/audio-hot" />} nativeButton={false} className="hidden sm:flex text-zinc-300 hover:text-white hover:bg-white/10 rounded-full">
          <div className="flex items-center gap-1">
            Mở thư viện <ChevronRight className="ml-1 h-4 w-4" />
          </div>
        </Button>
      </div>

      <div className="relative z-10 px-6 sm:px-12 pb-4 mt-8">
        <Carousel
          opts={{
            align: "start",
            loop: true,
            dragFree: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 md:-ml-6">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                <CarouselItem key={i} className="pl-4 md:pl-6 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <Skeleton className="w-full h-24 bg-white/5 rounded-xl" />
                </CarouselItem>
              ))
              : stories?.map((story) => (
                <CarouselItem key={story.id} className="pl-4 md:pl-6 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <Link href={`/truyen/${story.id}/audio`} className="group flex items-center gap-4 p-3 pr-4 rounded-xl hover:bg-white/10 transition-colors border border-transparent hover:border-white/5">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 shadow-lg">
                      <img 
                        src={story.coverImage} 
                        alt={story.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle className="w-8 h-8 text-white fill-black/30" />
                      </div>
                    </div>
                    
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <h3 className="font-bold text-base truncate group-hover:text-green-400 transition-colors">
                        {story.title}
                      </h3>
                      <p className="text-zinc-400 text-sm truncate">{story.author}</p>
                      
                      {/* Audio visualizer simulation on hover */}
                      <div className="h-4 flex items-end gap-0.5 mt-1 opacity-50 group-hover:opacity-100 transition-opacity">
                        {[1, 2, 3, 4, 5, 6].map((bar) => (
                          <motion.div 
                            key={bar}
                            className="w-1 bg-green-500 rounded-t-sm"
                            animate={{ height: ["4px", `${Math.random() * 12 + 4}px`, "4px"] }}
                            transition={{ duration: 0.8 + Math.random(), repeat: Infinity, ease: "easeInOut" }}
                            style={{ height: "4px" }}
                          />
                        ))}
                      </div>
                    </div>

                    <Disc3 className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 group-hover:animate-spin-slow transition-colors flex-shrink-0" />
                  </Link>
                </CarouselItem>
              ))}
          </CarouselContent>
          <div className="hidden sm:block">
            <CarouselPrevious className="-left-4 bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white" />
            <CarouselNext className="-right-4 bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
