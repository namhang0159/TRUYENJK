"use client";

import { useState } from "react";
import { useStoryDonations, StoryTopDonator, StoryRecentDonation } from "@/hooks/use-finance";
import { DonateModal } from "./donate-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Crown, Gift, Coins, Sparkles, Clock, MessageSquareQuote } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { getImageUrl } from "@/lib/utils";

interface StoryTopDonatorsProps {
  storyId: number | string;
}

export function StoryTopDonators({ storyId }: StoryTopDonatorsProps) {
  const { data, isLoading } = useStoryDonations(storyId);
  const [activeTab, setActiveTab] = useState<"top" | "recent">("top");
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl border p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  const topDonators = data?.topDonators || [];
  const recentDonations = data?.recentDonations || [];
  const totalCoins = data?.totalCoins || 0;
  const hasDonations = topDonators.length > 0;

  return (
    <div className="bg-card rounded-xl border border-amber-500/20 p-5 shadow-sm relative overflow-hidden">
      {/* Subtle ambient decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-500 border border-amber-500/30">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground flex items-center gap-1.5">
              Bảng Vàng Donate
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400/40" />
            </h3>
          </div>
        </div>

        {hasDonations && totalCoins > 0 && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
            <Coins className="w-3.5 h-3.5" />
            {totalCoins.toLocaleString()} Xu
          </span>
        )}
      </div>

      {/* Tabs */}
      {hasDonations && (
        <div className="flex items-center p-1 bg-muted/60 rounded-lg mb-4 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("top")}
            className={`flex-1 py-1.5 px-3 rounded-md transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "top"
                ? "bg-card text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            Top Đại Gia ({topDonators.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("recent")}
            className={`flex-1 py-1.5 px-3 rounded-md transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "recent"
                ? "bg-card text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            Mới Nhất ({recentDonations.length})
          </button>
        </div>
      )}

      {/* Content */}
      {!hasDonations ? (
        <div className="py-6 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <Gift className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Chưa có ai ủng hộ truyện này</p>
            <p className="text-xs text-muted-foreground max-w-[240px] mx-auto">
              Hãy là người đầu tiên tiếp thêm động lực cho tác giả và ghi danh bảng vàng!
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setIsDonateOpen(true)}
            className="rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-medium text-xs px-5 shadow-md shadow-amber-500/20"
          >
            <Gift className="w-3.5 h-3.5 mr-1.5" />
            Ủng Hộ Ngay
          </Button>
        </div>
      ) : activeTab === "top" ? (
        <div className="space-y-2.5">
          {topDonators.slice(0, 5).map((item: StoryTopDonator, index: number) => {
            const name = item.reader?.display_name || item.reader?.account?.display_name || item.reader?.username || "Độc giả ẩn danh";
            const avatar = getImageUrl(item.reader?.avatar_url);
            const coins = Number(item.total_coins ?? item.total_donated ?? 0);
            const isRank1 = index === 0;
            const isRank2 = index === 1;
            const isRank3 = index === 2;

            return (
              <div
                key={item.reader_id || index}
                className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                  isRank1
                    ? "bg-gradient-to-r from-amber-500/15 via-yellow-500/5 to-transparent border-amber-500/40 shadow-sm"
                    : isRank2
                    ? "bg-muted/40 border-border/80"
                    : isRank3
                    ? "bg-muted/30 border-border/60"
                    : "border-transparent hover:bg-muted/20"
                }`}
              >
                {/* Rank Badge */}
                <div className="w-6 flex items-center justify-center shrink-0">
                  {isRank1 ? (
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-black font-extrabold text-xs flex items-center justify-center shadow-sm ring-2 ring-amber-400/30">
                      1
                    </div>
                  ) : isRank2 ? (
                    <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-extrabold text-xs flex items-center justify-center">
                      2
                    </div>
                  ) : isRank3 ? (
                    <div className="w-6 h-6 rounded-full bg-amber-700/80 text-amber-100 font-extrabold text-xs flex items-center justify-center">
                      3
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-muted-foreground">
                      #{index + 1}
                    </span>
                  )}
                </div>

                {/* Avatar with potential crown */}
                <div className="relative shrink-0">
                  <Avatar className="w-9 h-9 border border-border">
                    <AvatarImage src={avatar} alt={name} />
                    <AvatarFallback className="text-xs font-semibold bg-amber-500/20 text-amber-500">
                      {name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isRank1 && (
                    <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400 absolute -top-1.5 -right-1 drop-shadow" />
                  )}
                </div>

                {/* Reader Name */}
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-foreground truncate flex items-center gap-1">
                    {name}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {item.donation_count} lượt ủng hộ
                  </div>
                </div>

                {/* Coins */}
                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-amber-500 flex items-center justify-end gap-1">
                    <Coins className="w-3 h-3" />
                    {coins.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-muted-foreground">Xu</div>
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDonateOpen(true)}
              className="w-full text-xs font-medium border-amber-500/30 hover:bg-amber-500/10 text-amber-500 hover:text-amber-400 flex items-center justify-center gap-1.5 h-9"
            >
              <Gift className="w-3.5 h-3.5" />
              Tặng quà tiếp sức tác giả
            </Button>
          </div>
        </div>
      ) : (
        /* Recent Donations Tab */
        <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
          {recentDonations.map((donation: StoryRecentDonation) => {
            const name = donation.reader?.display_name || (donation.reader as any)?.account?.display_name || donation.reader?.username || "Độc giả ẩn danh";
            const avatar = getImageUrl(donation.reader?.avatar_url);
            let timeAgo = "";
            try {
              timeAgo = formatDistanceToNow(new Date(donation.created_at), {
                addSuffix: true,
                locale: vi,
              });
            } catch {
              timeAgo = "";
            }

            return (
              <div
                key={donation.id}
                className="p-2.5 rounded-lg bg-muted/30 border border-border/50 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar className="w-6 h-6 border shrink-0">
                      <AvatarImage src={avatar} alt={name} />
                      <AvatarFallback className="text-[10px] font-semibold">
                        {name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-foreground truncate">{name}</span>
                  </div>
                  <span className="text-[11px] font-bold text-amber-500 shrink-0 flex items-center gap-0.5">
                    +{donation.coin_amount} Xu
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pl-8">
                  <span className="font-medium text-amber-400/90">{donation.item_name}</span>
                  <span>{timeAgo}</span>
                </div>

                {donation.message && (
                  <div className="pl-8 pt-0.5">
                    <p className="text-[11px] text-muted-foreground/90 italic bg-background/50 rounded px-2 py-1 border border-border/40 flex items-start gap-1">
                      <MessageSquareQuote className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{donation.message}</span>
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDonateOpen(true)}
              className="w-full text-xs font-medium border-amber-500/30 hover:bg-amber-500/10 text-amber-500 hover:text-amber-400 flex items-center justify-center gap-1.5 h-9"
            >
              <Gift className="w-3.5 h-3.5" />
              Tặng quà cho tác giả
            </Button>
          </div>
        </div>
      )}

      {/* Donate Modal */}
      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        storyId={storyId}
      />
    </div>
  );
}
