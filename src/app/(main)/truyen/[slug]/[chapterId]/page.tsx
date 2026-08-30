"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useChapterDetail, useStoryChapters, useUpsertHistory, useUnlockChapter } from "@/hooks/use-stories";
import { useWallet } from "@/hooks/use-finance";
import { useReaderStore } from "@/store/reader-store";
import { useAuthStore } from "@/store/auth-store";
import { useAudioStore } from "@/store/audio-store";
import { ReadingSettings } from "@/components/reading/reading-settings";
import { AudioPlayer } from "@/components/reading/audio-player";
import { VipUnlockModal } from "@/components/reading/vip-unlock-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import Link from "next/link";

export default function ReadingPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const chapterId = params.chapterId as string;

  const { data: chapter, isLoading } = useChapterDetail(slug, chapterId);
  const { data: chapters } = useStoryChapters(slug);
  const { data: wallet } = useWallet();
  const { theme, fontSize, fontFamily, lineHeight } = useReaderStore();
  const { toggleOpen, isPlaying } = useAudioStore();
  const { isAuthenticated } = useAuthStore();
  const { mutate: upsertHistory } = useUpsertHistory();

  const currentChapterIndex = chapters?.findIndex((c) => c.chapterNumber.toString() === chapterId) ?? -1;
  const prevChapter = currentChapterIndex > 0 ? chapters?.[currentChapterIndex - 1] : null;
  const nextChapter = (chapters && currentChapterIndex !== -1 && currentChapterIndex < chapters.length - 1) ? chapters[currentChapterIndex + 1] : null;

  const [showVipModal, setShowVipModal] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false); // Local state for unlock
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { mutateAsync: unlockChapter } = useUnlockChapter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Ghi nhận lịch sử đọc
  useEffect(() => {
    if (chapter && isAuthenticated) {
      upsertHistory({
        story_id: chapter.story_id || slug,
        chapter_id: chapter.id,
        progress_seconds: 0
      });
    }
  }, [chapter, isAuthenticated, slug]);

  // Xử lý logic VIP
  useEffect(() => {
    if (chapter && chapter.isVip && !chapter.isUnlocked && !isUnlocked) {
      setShowVipModal(true);
    }
  }, [chapter, isUnlocked]);

  // Xử lý auto-next audio event
  useEffect(() => {
    const handleAudioEnded = (e: any) => {
      // Ví dụ: tự động sang chương 2 nếu chương 1 hết
      console.log("Audio ended for chapter:", e.detail?.chapterId);
      // alert("Audio kết thúc. Tự động chuyển chương...");
    };
    window.addEventListener('audioEnded', handleAudioEnded);
    return () => window.removeEventListener('audioEnded', handleAudioEnded);
  }, []);

  // Xử lý style theo Store (Chờ mounted để tránh Hydration Mismatch của Zustand Persist)
  const themeClasses = mounted ? {
    light: "bg-white text-gray-900",
    dark: "bg-gray-950 text-gray-200",
    sepia: "bg-[#f4ecd8] text-[#5b4636]",
  }[theme] : "bg-gray-950 text-gray-200"; // Mặc định server

  const fontClasses = mounted ? {
    sans: "font-sans",
    serif: "font-serif",
    outfit: "font-[family-name:var(--font-outfit)]",
  }[fontFamily] : "font-sans";

  const leadingClasses = mounted ? {
    tight: "leading-snug",
    normal: "leading-normal",
    relaxed: "leading-loose",
  }[lineHeight] : "leading-relaxed";

  if (isLoading) {
    return (
      <div className={`min-h-screen ${themeClasses} transition-colors p-8`}>
        <div className="max-w-3xl mx-auto space-y-4">
          <Skeleton className="w-1/2 h-10 mx-auto mb-12" />
          {Array.from({ length: 15 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-4" />
          ))}
        </div>
      </div>
    );
  }

  if (!chapter) return <div>Không tìm thấy chương</div>;


  const handleUnlock = async () => {
    if (!chapter) return;
    try {
      setIsUnlocking(true);
      await unlockChapter({ slug, chapterId: chapter.id, chapterNumber: chapterId });
      setIsUnlocked(true);
      setShowVipModal(false);
    } catch (error: any) {
      alert(error.response?.data?.message || error.message || "Mở khóa thất bại");
    } finally {
      setIsUnlocking(false);
    }
  };

  // Xác định xem nội dung có bị làm mờ không (chưa unlock VIP)
  const isBlur = chapter.isVip && !chapter.isUnlocked && !isUnlocked;

  return (
    <div className={`min-h-screen ${themeClasses} ${fontClasses} transition-colors pb-24`}>
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-inherit border-b border-border/10 shadow-sm backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href={`/truyen/${slug}`}
            className={buttonVariants({ variant: "ghost", size: "sm" }) + " hover:bg-black/5 dark:hover:bg-white/5"}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            {chapter.title}
          </Link>
          <div className="flex items-center gap-2">
            <ReadingSettings />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-center mb-12">{chapter.title}</h1>

        <div className={`text-justify whitespace-pre-wrap ${leadingClasses} [&>p]:mb-4 [&>strong]:font-bold [&>em]:italic`} style={{ fontSize: mounted ? `${fontSize}px` : '20px' }}>
          {isBlur ? (
            <div className="relative">
              {/* Hiển thị đoạn đầu rồi làm mờ */}
              <div className="blur-sm select-none opacity-50" dangerouslySetInnerHTML={{ __html: chapter.content }} />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-50" />
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: chapter.content }} />
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="mt-16 flex items-center justify-between">
          {prevChapter ? (
            <Link href={`/truyen/${slug}/${prevChapter.chapterNumber}`} className={buttonVariants({ variant: "outline" }) + " border-current/20 hover:bg-black/5 dark:hover:bg-white/5 bg-transparent"}>
              <ChevronLeft className="w-4 h-4 mr-2" /> Chương Trước
            </Link>
          ) : (
            <Button variant="outline" disabled className="border-current/20 bg-transparent">
              <ChevronLeft className="w-4 h-4 mr-2" /> Chương Trước
            </Button>
          )}

          <Link
            href={`/truyen/${slug}`}
            className={buttonVariants({ variant: "ghost" })}
          >
            <Menu className="w-4 h-4 mr-2" /> Mục Lục
          </Link>

          {nextChapter ? (
            <Link href={`/truyen/${slug}/${nextChapter.chapterNumber}`} className={buttonVariants({ variant: "outline" }) + " border-current/20 hover:bg-black/5 dark:hover:bg-white/5 bg-transparent"}>
              Chương Sau <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          ) : (
            <Button variant="outline" disabled className="border-current/20 bg-transparent">
              Chương Sau <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Audio Player */}
      <AudioPlayer 
        storyId={chapter.story_id} 
        chapterId={chapter.id} 
        chapterTitle={chapter.title} 
        initialProgress={chapter.progress_seconds || 0} 
      />

      {/* VIP Modal */}
      <VipUnlockModal
        isOpen={showVipModal}
        onClose={() => router.push(`/truyen/${slug}`)}
        onUnlock={handleUnlock}
        isLoading={isUnlocking}
        price={chapter.price}
        userCoins={wallet?.coin_balance || 0}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}
