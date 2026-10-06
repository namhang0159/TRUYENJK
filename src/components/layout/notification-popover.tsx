"use client";

import { useState } from "react";
import {
  useNotifications,
  useUnreadNotificationsCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  NotificationItem,
} from "@/hooks/use-notifications";
import { useAuthStore } from "@/store/auth-store";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck, BookOpen, MessageSquare, Gift, CreditCard } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function NotificationPopover() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const { data: countData } = useUnreadNotificationsCount(isAuthenticated);
  const { data: listData, isLoading } = useNotifications(1, 10, isAuthenticated && isOpen);
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllNotificationsAsRead();

  if (!isAuthenticated) return null;

  const unreadCount = countData?.unreadCount || 0;
  const notifications = listData?.data || [];

  const handleNotificationClick = (item: NotificationItem) => {
    if (!item.is_read) {
      markAsRead(item.id);
    }
    setIsOpen(false);
    if (item.action_link) {
      router.push(item.action_link);
    }
  };

  const getIcon = (type?: string | null) => {
    switch (type) {
      case "NEW_CHAPTER":
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      case "COMMENT_REPLY":
      case "STORY_COMMENT":
        return <MessageSquare className="w-4 h-4 text-emerald-500" />;
      case "NEW_DONATION":
        return <Gift className="w-4 h-4 text-amber-500" />;
      case "PAYOUT_APPROVED":
      case "PAYOUT_REJECTED":
        return <CreditCard className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="relative cursor-pointer" />}>
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 md:w-96 p-0 shadow-xl border border-border"
      >
        <div className="flex items-center justify-between p-3.5 border-b border-border bg-muted/40">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">Thông báo</h3>
            {unreadCount > 0 && (
              <span className="text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                {unreadCount} mới
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead()}
              disabled={isMarkingAll}
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Đọc tất cả</span>
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-border/40">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted" />
                  <div className="flex-1 space-y-1.5">
                    <div className="w-3/4 h-3.5 bg-muted rounded" />
                    <div className="w-1/2 h-3 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-xs">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              Bạn chưa có thông báo nào.
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`p-3.5 flex gap-3 items-start cursor-pointer hover:bg-muted/50 transition-colors ${
                  !item.is_read ? "bg-primary/5" : ""
                }`}
              >
                <div className="p-2 rounded-full bg-muted/80 mt-0.5 shrink-0">
                  {getIcon(item.action_type)}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs leading-snug line-clamp-1 ${
                      !item.is_read ? "font-semibold text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {item.title}
                  </p>
                  {item.content && (
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                      {item.content}
                    </p>
                  )}
                  <span className="text-[10px] text-muted-foreground/70 block mt-1">
                    {formatDistanceToNow(new Date(item.created_at), {
                      addSuffix: true,
                      locale: vi,
                    })}
                  </span>
                </div>

                {!item.is_read && (
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                )}
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
