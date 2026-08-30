"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useCreateReport } from "@/hooks/use-stories";
import { useAuthStore } from "@/store/auth-store";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: number;
  targetType: 'STORY' | 'CHAPTER' | 'REVIEW';
}

const REASONS = [
  "Nội dung vi phạm bản quyền",
  "Chứa nội dung đồi trụy, phản cảm",
  "Spam, quảng cáo trái phép",
  "Sai tả, lỗi hiển thị",
  "Khác"
];

export function ReportModal({ isOpen, onClose, targetId, targetType }: ReportModalProps) {
  const { mutate: createReport, isPending } = useCreateReport();
  const { isAuthenticated } = useAuthStore();
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để báo cáo.");
      return;
    }
    if (!reason) {
      alert("Vui lòng chọn lý do.");
      return;
    }

    createReport(
      { target_type: targetType, target_id: targetId, reason, description },
      {
        onSuccess: () => {
          alert("Báo cáo của bạn đã được gửi. Chúng tôi sẽ xử lý sớm nhất có thể.");
          setReason("");
          setDescription("");
          onClose();
        },
        onError: (err: any) => {
          alert(err.response?.data?.message || "Có lỗi xảy ra");
        }
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-white font-sans">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium tracking-tight">Báo cáo vi phạm</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Giúp chúng tôi giữ môi trường đọc sách trong sạch bằng cách báo cáo nội dung không phù hợp.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-3">
            <Label>Lý do <span className="text-red-500">*</span></Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="w-full bg-black border-zinc-800 text-white">
                <SelectValue placeholder="Chọn lý do báo cáo..." />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
                {REASONS.map((r) => (
                  <SelectItem key={r} value={r} className="focus:bg-zinc-900 focus:text-white">
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Mô tả chi tiết (Tùy chọn)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Cung cấp thêm thông tin giúp quản trị viên dễ dàng xác minh..."
              className="min-h-[100px] bg-black border-zinc-800 text-white focus-visible:ring-primary/50"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="bg-transparent border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white"
            >
              Hủy
            </Button>
            <Button 
              type="submit" 
              disabled={isPending || !reason}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Gửi báo cáo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
