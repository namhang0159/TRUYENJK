import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Headphones, Play, Star, Eye, FileText, BookmarkPlus, Flag } from "lucide-react";
import { Story, useLibrary, useToggleBookmark } from "@/hooks/use-stories";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";

interface DetailHeroProps {
  story: Story;
}

export function DetailHero({ story }: DetailHeroProps) {
  const { data: library } = useLibrary();
  const { isAuthenticated } = useAuthStore();
  const lastReadChapter = library?.readingHistories?.find((h: any) => h.story_id === story.id || h.story?.slug === story.id);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden mb-12 shadow-2xl">
      {/* Background Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 blur-2xl scale-110" 
        style={{ backgroundImage: `url(${story.coverImage})` }} 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      
      {/* Content */}
      <div className="relative p-6 md:p-12 z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
        {/* Cover Image */}
        <div className="shrink-0 group">
          <img 
            src={story.coverImage} 
            alt={story.title} 
            className="w-48 md:w-64 aspect-[2/3] object-cover rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 group-hover:scale-105 transition-transform duration-500" 
          />
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="display-font text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground drop-shadow-md">
            {story.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge variant="secondary" className="text-sm bg-primary/20 text-primary hover:bg-primary/30">
              {story.author}
            </Badge>
            {story.categories && story.categories.length > 0 ? (
              story.categories.map((cat: any) => (
                <Link key={cat.id} href={`/categories/${cat.slug}`}>
                  <Badge variant="outline" className="text-sm border-primary/30 hover:bg-primary/10 transition-colors cursor-pointer">
                    {cat.name}
                  </Badge>
                </Link>
              ))
            ) : (
              <Badge variant="outline" className="text-sm border-primary/30">
                {story.category}
              </Badge>
            )}
            <Badge variant="outline" className="text-sm border-primary/30">
              {story.status}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-1.5">
              <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
              <span className="font-semibold text-foreground">{story.rating}</span>
              <span>({story.reviewCount} đánh giá)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold text-foreground">{(story.viewCount || 0).toLocaleString()}</span>
              <span>lượt đọc</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold text-foreground">{(story.wordCount || 0).toLocaleString()}</span>
              <span>chữ</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            {lastReadChapter ? (
              <Link href={`/truyen/${story.id}/${lastReadChapter.chapter.chapter_number}`}>
                <Button size="lg" className="rounded-full font-bold shadow-lg shadow-primary/20 px-8 text-base">
                  <Play className="mr-2 h-5 w-5" /> Đọc tiếp (Chương {lastReadChapter.chapter.chapter_number})
                </Button>
              </Link>
            ) : (
              <Link href={`/truyen/${story.id}/1`}>
                <Button size="lg" className="rounded-full font-bold shadow-lg shadow-primary/20 px-8 text-base">
                  <Play className="mr-2 h-5 w-5" /> Đọc ngay
                </Button>
              </Link>
            )}
            
            <Link href={`/truyen/${story.id}/1`}>
              <Button size="lg" variant="secondary" className="rounded-full bg-secondary/80 backdrop-blur font-semibold px-8 text-base">
                <BookOpen className="mr-2 h-5 w-5" /> Đọc từ đầu
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="rounded-full font-semibold px-8 text-base"
              onClick={() => {
                if (!isAuthenticated) {
                  window.location.href = "/login";
                } else {
                  // Mở Audio Player. Thực tế có thể cần push router tới chương đầu tiên, sau đó bật audio
                  alert("Tính năng Audio đang được phát triển hoặc chọn chương để nghe.");
                }
              }}
            >
              <Headphones className="mr-2 h-5 w-5" /> Nghe Audio
            </Button>
            <DonateButton storyId={story.id} />
            <BookmarkButton storyId={story.id} />
            <ReportStoryButton storyId={story.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { DonateModal } from "./donate-modal";
import { ReportModal } from "./report-modal";
import { Gift } from "lucide-react";

function DonateButton({ storyId }: { storyId: string | number }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        size="icon" 
        className="rounded-full h-11 w-11 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md ml-auto md:ml-0"
      >
        <Gift className="h-5 w-5" />
      </Button>
      <DonateModal isOpen={isOpen} onClose={() => setIsOpen(false)} storyId={Number(storyId)} />
    </>
  );
}

function BookmarkButton({ storyId }: { storyId: string | number }) {
  const { data: library } = useLibrary();
  const { mutate: toggleBookmark, isPending } = useToggleBookmark();
  const { isAuthenticated } = useAuthStore();
  
  const isBookmarked = library?.bookmarks?.some((b: any) => b.story_id === storyId || b.story?.slug === storyId);

  const handleToggle = () => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để lưu truyện!");
      return;
    }
    toggleBookmark(storyId);
  };

  return (
    <Button 
      size="icon" 
      variant={isBookmarked ? "default" : "ghost"} 
      className={`rounded-full h-11 w-11 transition-colors ml-auto md:ml-0 ${
        isBookmarked 
          ? "bg-primary text-primary-foreground hover:bg-primary/90" 
          : "hover:bg-primary/20 hover:text-primary"
      }`}
      onClick={handleToggle}
      disabled={isPending}
    >
      <BookmarkPlus className={`h-6 w-6 ${isBookmarked ? "fill-current" : ""}`} />
    </Button>
  );
}

function ReportStoryButton({ storyId }: { storyId: string | number }) {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const handleOpen = () => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để báo cáo!");
      return;
    }
    setIsOpen(true);
  };

  return (
    <>
      <Button 
        size="icon" 
        variant="ghost" 
        className="rounded-full h-11 w-11 transition-colors hover:bg-red-500/20 hover:text-red-500 ml-auto md:ml-0 text-muted-foreground"
        onClick={handleOpen}
        title="Báo cáo vi phạm"
      >
        <Flag className="h-5 w-5" />
      </Button>
      <ReportModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        targetId={Number(storyId)} 
        targetType="STORY" 
      />
    </>
  );
}
