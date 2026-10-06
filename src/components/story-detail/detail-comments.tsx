import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquare, ThumbsUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

import { useState } from "react";
import { useReviews, useAddReview, useStoryDetail } from "@/hooks/use-stories";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { CommentSection } from "@/components/story-detail/comment-section";

export function DetailComments({ slug }: { slug: string }) {
  const { data: story } = useStoryDetail(slug);
  const { data: reviews, isLoading } = useReviews(slug);
  const { mutate: addReview, isPending } = useAddReview();
  const { isAuthenticated } = useAuth();
  
  const [activeTab, setActiveTab] = useState<"COMMENTS" | "REVIEWS">("COMMENTS");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!isAuthenticated) {
      alert("Bạn cần đăng nhập để gửi đánh giá!");
      return;
    }
    if (!content.trim()) return;

    addReview({ slug, rating, content }, {
      onSuccess: () => {
        setContent("");
        setRating(5);
        alert("Gửi đánh giá thành công!");
      },
      onError: (err: any) => {
        alert(err.response?.data?.message || "Có lỗi xảy ra");
      }
    });
  };

  return (
    <div className="bg-card rounded-xl border p-6 shadow-sm">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("COMMENTS")}
            className={`flex items-center gap-2 pb-1 font-bold text-lg transition-colors cursor-pointer border-b-2 ${
              activeTab === "COMMENTS"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            Thảo Luận Cộng Đồng
          </button>

          <button
            onClick={() => setActiveTab("REVIEWS")}
            className={`flex items-center gap-2 pb-1 font-bold text-lg transition-colors cursor-pointer border-b-2 ${
              activeTab === "REVIEWS"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Star className="w-5 h-5" />
            Đánh Giá Sao
            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 font-semibold">
              {story?.rating ? Number(story.rating).toFixed(1) : "5.0"} ★
            </span>
          </button>
        </div>
      </div>

      {activeTab === "COMMENTS" ? (
        story?.id ? (
          <CommentSection storyId={Number(story.id)} title="Bình luận tác phẩm" />
        ) : (
          <Skeleton className="w-full h-40 rounded-xl" />
        )
      ) : (
        <div>
          {/* Form Review */}
          <div className="flex gap-4 mb-8">
            <Avatar className="w-10 h-10 border border-border shrink-0">
              <AvatarFallback>Me</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Đánh giá của bạn:</span>
                <div className="flex cursor-pointer text-muted-foreground hover:text-yellow-500 transition-colors group">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      onClick={() => setRating(i + 1)}
                      className={`w-5 h-5 transition-colors ${i < rating ? "fill-yellow-500 text-yellow-500" : ""}`} 
                    />
                  ))}
                </div>
              </div>
              <Textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Viết cảm nhận của bạn về chất lượng tác phẩm..." 
                className="min-h-[100px] resize-none bg-muted/50 focus:bg-background transition-colors text-sm"
              />
              <div className="flex justify-end">
                <Button onClick={handleSubmit} disabled={isPending || !content.trim()} className="rounded-full px-6 cursor-pointer">
                  {isPending ? "Đang gửi..." : "Gửi Đánh Giá"}
                </Button>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="w-full h-20 rounded-xl" />
                <Skeleton className="w-full h-20 rounded-xl" />
              </div>
            ) : reviews?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Chưa có đánh giá nào. Hãy là người đầu tiên!
              </div>
            ) : (
              reviews?.map((review: any) => (
                <div key={review.id} className="flex gap-3 pb-4 border-b border-border/50 last:border-0">
                  <Avatar className="w-9 h-9 border border-border shrink-0">
                    <AvatarImage src={review.reader?.account?.avatar_url} />
                    <AvatarFallback>{review.reader?.account?.display_name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm">{review.reader?.account?.display_name || 'Vô danh'}</h4>
                        <div className="flex text-yellow-500">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(review.created_at), { addSuffix: true, locale: vi })}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {review.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
