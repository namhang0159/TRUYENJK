"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { PenTool } from "lucide-react";

interface RegisterAuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RegisterAuthorModal({ isOpen, onClose }: RegisterAuthorModalProps) {
  const [penName, setPenName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { registerAuthor } = useAuth();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!penName.trim()) {
      alert("Vui lòng nhập bút danh");
      return;
    }
    if (!phone.trim()) {
      alert("Vui lòng nhập Số Điện Thoại / Zalo");
      return;
    }
    if (!agreeTerms) {
      alert("Vui lòng đồng ý với các điều khoản và quy định");
      return;
    }

    try {
      setIsLoading(true);
      await registerAuthor(penName.trim(), bio.trim(), phone.trim(), facebookLink.trim());
      alert("Đăng ký làm tác giả thành công! Vui lòng chờ Admin phê duyệt.");
      onClose();
      router.push("/profile");
    } catch (error: any) {
      alert(error.message || "Đăng ký thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <PenTool className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-center text-xl">Trở thành Tác Giả</DialogTitle>
            <DialogDescription className="text-center">
              Bạn đã sẵn sàng chia sẻ những câu chuyện tuyệt vời của mình với độc giả chưa? Hãy cung cấp một số thông tin để bắt đầu!
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRegister} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="penName">Bút danh của bạn <span className="text-red-500">*</span></Label>
              <Input
                id="penName"
                placeholder="Ví dụ: Lão Mực, Thần Đồng Đất Việt..."
                value={penName}
                onChange={(e) => setPenName(e.target.value)}
                disabled={isLoading}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số Điện Thoại / Zalo <span className="text-red-500">*</span></Label>
              <Input
                id="phone"
                placeholder="Dùng để Admin liên hệ khi có vấn đề bản quyền..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebookLink">Link Facebook / Portfolio (Tùy chọn)</Label>
              <Input
                id="facebookLink"
                placeholder="Giúp Admin xác minh và duyệt nhanh hơn..."
                value={facebookLink}
                onChange={(e) => setFacebookLink(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Giới thiệu ngắn (Tùy chọn)</Label>
              <textarea
                id="bio"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Vài dòng giới thiệu về bạn và thể loại bạn muốn viết..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                disabled={isLoading}
              />
              <Label htmlFor="terms" className="text-xs leading-relaxed text-muted-foreground cursor-pointer">
                Tôi đã đọc và cam kết tuân thủ{" "}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsTermsOpen(true);
                  }}
                  className="text-primary underline hover:text-primary/80 font-medium"
                >
                  điều khoản và quy định dành cho tác giả
                </button>
                .
              </Label>
            </div>

            <DialogFooter className="flex-col sm:flex-col gap-2 pt-2">
              <Button type="submit" className="w-full" disabled={isLoading || !agreeTerms}>
                {isLoading ? "Đang xử lý..." : "Đăng ký ngay"}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={onClose} disabled={isLoading}>
                Để sau
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isTermsOpen} onOpenChange={setIsTermsOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl">Điều Khoản & Quy Định Dành Cho Tác Giả</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-sm text-muted-foreground">
            <h3 className="text-base font-semibold text-foreground">1. Quy định về Bản quyền</h3>
            <p>
              Tác giả cam kết tác phẩm được đăng tải thuộc quyền sở hữu trí tuệ của mình, không sao chép trái phép hoặc vi phạm bản quyền của cá nhân/tổ chức khác. Nếu có tranh chấp bản quyền, tác giả hoàn toàn chịu trách nhiệm trước pháp luật.
            </p>
            <h3 className="text-base font-semibold text-foreground">2. Nội dung Cấm</h3>
            <p>
              Nghiêm cấm đăng tải các nội dung vi phạm pháp luật, chống phá Nhà nước, vi phạm thuần phong mỹ tục, đồi trụy, bạo lực, hoặc kích động thù hằn. Ban quản trị có quyền xóa bỏ tác phẩm và khóa tài khoản vĩnh viễn nếu phát hiện vi phạm.
            </p>
            <h3 className="text-base font-semibold text-foreground">3. Quyền lợi và Trách nhiệm</h3>
            <p>
              Tác giả có quyền nhận chia sẻ doanh thu từ các chương VIP và quà tặng từ độc giả. Tuy nhiên, tác giả phải chịu trách nhiệm đảm bảo chất lượng nội dung và tiến độ cập nhật như đã cam kết (nếu có).
            </p>
            <h3 className="text-base font-semibold text-foreground">4. Quyền của Ban Quản Trị</h3>
            <p>
              Ban quản trị nền tảng có quyền sử dụng hình ảnh, tên tác phẩm cho mục đích quảng bá nền tảng mà không cần báo trước. Chúng tôi cũng giữ quyền đơn phương từ chối duyệt các tác phẩm không phù hợp với định hướng của nền tảng.
            </p>
          </div>
          <DialogFooter className="pt-4 sm:justify-center">
            <Button onClick={() => { setIsTermsOpen(false); setAgreeTerms(true); }} className="w-full sm:w-auto">
              Tôi đã đọc và đồng ý
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
