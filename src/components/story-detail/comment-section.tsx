"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import {
  useComments,
  useCreateComment,
  useLikeComment,
  useDeleteComment,
  CommentItem,
} from "@/hooks/use-comments";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageSquare,
  Heart,
  Reply,
  Trash2,
  Send,
  Sparkles,
  ShieldCheck,
  Crown,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner";
import Link from "next/link";

interface CommentSectionProps {
  storyId: number;
  chapterId?: number;
  title?: string;
}

export function CommentSection({
  storyId,
  chapterId,
  title = "Bình luận & Thảo luận",
}: CommentSectionProps) {
  const { user, isAuthenticated } = useAuthStore();
  const [content, setContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useComments({
    storyId,
    chapterId,
    page,
    limit: 15,
  });

  const { mutateAsync: createComment, isPending: isSubmitting } = useCreateComment();
  const { mutate: likeComment } = useLikeComment();
  const { mutate: deleteComment } = useDeleteComment();

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await createComment({
        storyId,
        chapterId: chapterId || null,
        content: content.trim(),
      });
      setContent("");
      toast.success("Đã đăng bình luận thành công!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể đăng bình luận");
    }
  };

  const handlePostReply = async (parentId: number) => {
    if (!replyContent.trim()) return;

    try {
      await createComment({
        storyId,
        chapterId: chapterId || null,
        parentId,
        content: replyContent.trim(),
      });
      setReplyContent("");
      setReplyingTo(null);
      toast.success("Đã gửi phản hồi thành công!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể gửi phản hồi");
    }
  };

  const handleDelete = (commentId: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
      deleteComment(commentId, {
        onSuccess: () => toast.success("Đã xóa bình luận"),
        onError: (err: any) =>
          toast.error(err.response?.data?.message || "Xóa bình luận thất bại"),
      });
    }
  };

  const comments = data?.data || [];
  const total = data?.pagination?.total || 0;

  return (
    <section className="mt-12 pt-8 border-t border-border/40">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          {title}
          <span className="text-sm font-normal text-muted-foreground">
            ({total})
          </span>
        </h2>
      </div>

      {/* Main Comment Box */}
      {isAuthenticated ? (
        <form onSubmit={handlePostComment} className="mb-8 space-y-3">
          <div className="flex gap-3">
            <Avatar className="w-10 h-10 border border-primary/20">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback>
                {user?.displayName?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Chia sẻ cảm nghĩ của bạn về tác phẩm..."
                rows={3}
                className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  Hãy giữ lịch sự và tôn trọng cộng đồng độc giả.
                </span>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting || !content.trim()}
                  className="gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? "Đang gửi..." : "Bình luận"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 rounded-lg bg-muted/30 border border-border/60 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Vui lòng đăng nhập để tham gia thảo luận cùng cộng đồng độc giả.
          </p>
          <Link href="/login">
            <Button variant="outline" size="sm" className="cursor-pointer">
              Đăng nhập ngay
            </Button>
          </Link>
        </div>
      )}

      {/* Comment List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="w-10 h-10 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="w-1/4 h-4 bg-muted rounded" />
                <div className="w-full h-12 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground text-sm">
          Chưa có bình luận nào. Hãy là người đầu tiên để lại cảm nghĩ!
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItemNode
              key={comment.id}
              comment={comment}
              currentUserId={user?.id}
              currentUserRole={user?.role}
              onLike={() => likeComment(comment.id)}
              onDelete={() => handleDelete(comment.id)}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              onPostReply={handlePostReply}
              isSubmittingReply={isSubmitting}
            />
          ))}

          {/* Pagination */}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Trang trước
              </Button>
              <span className="flex items-center px-3 text-sm text-muted-foreground">
                {page} / {data.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Trang sau
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function CommentItemNode({
  comment,
  currentUserId,
  currentUserRole,
  onLike,
  onDelete,
  replyingTo,
  setReplyingTo,
  replyContent,
  setReplyContent,
  onPostReply,
  isSubmittingReply,
}: {
  comment: CommentItem;
  currentUserId?: number;
  currentUserRole?: string;
  onLike: () => void;
  onDelete: () => void;
  replyingTo: number | null;
  setReplyingTo: (id: number | null) => void;
  replyContent: string;
  setReplyContent: (val: string) => void;
  onPostReply: (parentId: number) => void;
  isSubmittingReply: boolean;
}) {
  const isOwner = currentUserId === comment.account_id;
  const canDelete = isOwner || currentUserRole === "ADMIN";
  const displayName =
    comment.account?.reader?.display_name ||
    comment.account?.author?.pen_name ||
    comment.account?.email?.split("@")[0] ||
    "Độc giả";
  const avatarUrl =
    comment.account?.reader?.avatar_url || comment.account?.author?.avatar_url;
  const isVip = comment.account?.reader?.tier === "VIP";
  const isAuthor = !!comment.account?.author;

  return (
    <div className="group space-y-3">
      <div className="flex gap-3">
        <Avatar className="w-9 h-9 border border-border">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-foreground">
              {displayName}
            </span>

            {isVip && (
              <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold border border-amber-500/20">
                <Crown className="w-3 h-3" /> VIP
              </span>
            )}

            {isAuthor && (
              <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold border border-purple-500/20">
                <Sparkles className="w-3 h-3" /> Tác Giả
              </span>
            )}

            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), {
                addSuffix: true,
                locale: vi,
              })}
            </span>
          </div>

          <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
            {comment.content}
          </p>

          <div className="flex items-center gap-4 pt-1">
            <button
              onClick={onLike}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 transition-colors cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5" />
              <span>{comment.like_count || 0}</span>
            </button>

            <button
              onClick={() =>
                setReplyingTo(replyingTo === comment.id ? null : comment.id)
              }
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              <Reply className="w-3.5 h-3.5" />
              <span>Phản hồi</span>
            </button>

            {canDelete && (
              <button
                onClick={onDelete}
                className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa</span>
              </button>
            )}
          </div>

          {/* Reply Form */}
          {replyingTo === comment.id && (
            <div className="pt-3 flex gap-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Trả lời ${displayName}...`}
                className="flex-1 px-3 py-1.5 rounded-md border border-border bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onPostReply(comment.id);
                  }
                }}
              />
              <Button
                size="sm"
                className="h-8 text-xs cursor-pointer"
                disabled={isSubmittingReply || !replyContent.trim()}
                onClick={() => onPostReply(comment.id)}
              >
                Gửi
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 text-xs cursor-pointer"
                onClick={() => {
                  setReplyingTo(null);
                  setReplyContent("");
                }}
              >
                Hủy
              </Button>
            </div>
          )}

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 pl-4 border-l-2 border-border/40 space-y-3">
              {comment.replies.map((reply) => {
                const replyDisplayName =
                  reply.account?.reader?.display_name ||
                  reply.account?.author?.pen_name ||
                  reply.account?.email?.split("@")[0] ||
                  "Độc giả";
                const isReplyOwner = currentUserId === reply.account_id;
                const canDeleteReply = isReplyOwner || currentUserRole === "ADMIN";

                return (
                  <div key={reply.id} className="flex gap-2.5 text-xs group/reply">
                    <Avatar className="w-7 h-7 border border-border">
                      <AvatarImage
                        src={
                          reply.account?.reader?.avatar_url ||
                          reply.account?.author?.avatar_url
                        }
                      />
                      <AvatarFallback>
                        {replyDisplayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {replyDisplayName}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {formatDistanceToNow(new Date(reply.created_at), {
                            addSuffix: true,
                            locale: vi,
                          })}
                        </span>
                      </div>
                      <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">
                        {reply.content}
                      </p>
                      {canDeleteReply && (
                        <button
                          onClick={() => onDelete()}
                          className="opacity-0 group-hover/reply:opacity-100 flex items-center gap-1 text-[11px] text-muted-foreground hover:text-destructive transition-all cursor-pointer pt-0.5"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Xóa</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
