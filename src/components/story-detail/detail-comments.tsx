import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, MoreVertical, ThumbsUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

import { useState } from "react";
import { useReviews, useAddReview, useStoryDetail } from "@/hooks/use-stories";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

export function DetailComments({ slug }: { slug: string }) {
  const { data: story } = useStoryDetail(slug);
  const { data: reviews, isLoading } = useReviews(slug);
  const { mutate: addReview, isPending } = useAddReview();
  const { isAuthenticated } = useAuth();
  
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
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <span className="w-1.5 h-6 bg-primary rounded-full inline-block"></span>
          Bình Luận & Đánh Giá
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-foreground">
            {story?.rating ? Number(story.rating).toFixed(1) : "0.0"}
          </span>
          <div className="flex text-yellow-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.round(Number(story?.rating) || 0) ? "fill-current" : "opacity-30"}`} />
            ))}
          </div>
          <span className="text-sm text-muted-foreground ml-2">({story?.reviewCount || 0} đánh giá)</span>
        </div>
      </div>

      {/* Form Review */}
      <div className="flex gap-4 mb-10">
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
            placeholder="Viết cảm nhận của bạn về bộ truyện này..." 
            className="min-h-[100px] resize-none bg-muted/50 focus:bg-background transition-colors"
          />
          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={isPending || !content.trim()} className="rounded-full px-6">
              {isPending ? "Đang gửi..." : "Gửi Đánh Giá"}
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="w-full h-24 rounded-xl" />
            <Skeleton className="w-full h-24 rounded-xl" />
          </div>
        ) : reviews?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Chưa có đánh giá nào. Hãy là người đầu tiên!
          </div>
        ) : (
          reviews?.map((review: any) => (
            <div key={review.id} className="flex gap-4 pb-6 border-b border-border/50 last:border-0">
              <Avatar className="w-10 h-10 border border-border shrink-0">
                <AvatarImage src={review.reader?.account?.avatar_url} />
                <AvatarFallback>{review.reader?.account?.display_name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-sm">{review.reader?.account?.display_name || 'Vô danh'}</h4>
                    <div className="flex text-yellow-500">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-foreground/90 mb-3 leading-relaxed">
                  {review.content}
                </p>
                <div className="flex items-center gap-6 text-xs text-muted-foreground">
                  <span>{formatDistanceToNow(new Date(review.created_at), { addSuffix: true, locale: vi })}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-8 flex justify-center">
        <Button variant="outline" className="rounded-full">
          Xem thêm bình luận
        </Button>
      </div>
    </div>
  );
}
