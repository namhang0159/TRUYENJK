import { Chapter } from "@/hooks/use-stories";
import { Lock, Unlock, Clock, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface ChapterListProps {
  chapters: Chapter[];
  storyId: string;
}

export function ChapterList({ chapters, storyId }: ChapterListProps) {
  return (
    <div className="bg-card rounded-xl border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <span className="w-1.5 h-6 bg-primary rounded-full inline-block"></span>
          Danh Sách Chương
        </h2>
        <span className="text-sm text-muted-foreground">{chapters.length} chương</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
        {chapters.map((chapter) => (
          <Link
            key={chapter.id}
            href={`/truyen/${storyId}/${chapter.chapterNumber}`}
            className="group flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border-b md:border-b-0 border-border/50"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="text-sm font-medium text-muted-foreground w-8 shrink-0">
                {chapter.chapterNumber}
              </span>
              <span className={`text-sm truncate ${chapter.isVip ? 'text-foreground/80 group-hover:text-primary' : 'text-foreground group-hover:text-primary'}`}>
                {chapter.title}
              </span>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <span className="text-xs text-muted-foreground hidden sm:inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(chapter.createdAt), { addSuffix: true, locale: vi })}
              </span>

              {chapter.isVip ? (
                <div className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 px-2 py-1 rounded-md text-xs font-semibold">
                  <Lock className="w-3 h-3" />
                  <span>{chapter.price} <Coins className="w-3 h-3 inline ml-0.5" /></span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-green-600 dark:text-green-500 px-2 py-1 text-xs font-medium">
                  <Unlock className="w-3 h-3" />
                  <span>Miễn phí</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button variant="outline" className="w-full max-w-sm rounded-full">
          Xem thêm các chương trước
        </Button>
      </div>
    </div>
  );
}
