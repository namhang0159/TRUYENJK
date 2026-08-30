import { FileText } from "lucide-react";

export const metadata = {
  title: "Điều Khoản Sử Dụng - Truyện Chữ",
  description: "Điều khoản sử dụng dịch vụ tại Truyện Chữ",
};

export default function TermsPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-6">
          <FileText className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Điều Khoản Sử Dụng</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Cập nhật lần cuối: Tháng 8 năm 2026
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h2>1. Chấp Thuận Điều Khoản</h2>
        <p>
          Bằng việc truy cập và sử dụng dịch vụ của <strong>Truyện Chữ</strong>, bạn đồng ý tuân thủ các Điều khoản sử dụng này. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng nền tảng của chúng tôi.
        </p>

        <h2>2. Quyền Truy Cập và Sử Dụng</h2>
        <p>
          Chúng tôi cấp cho bạn quyền truy cập cá nhân, không độc quyền, không thể chuyển nhượng để sử dụng dịch vụ phục vụ cho mục đích giải trí phi thương mại. Bạn không được phép sao chép, phát tán, hoặc bán lại bất kỳ nội dung nào từ Truyện Chữ mà không có sự cho phép bằng văn bản từ chúng tôi và tác giả sở hữu tác phẩm.
        </p>

        <h2>3. Nội Dung Người Dùng</h2>
        <p>
          Khi đăng tải bình luận, đánh giá hoặc tác phẩm (đối với Tác giả), bạn phải chịu hoàn toàn trách nhiệm về nội dung của mình. Bạn cam kết không đăng tải nội dung vi phạm pháp luật, thuần phong mỹ tục, đồi trụy, bạo lực hoặc vi phạm bản quyền.
        </p>
        <p>
          Truyện Chữ có quyền, nhưng không có nghĩa vụ, kiểm duyệt và gỡ bỏ bất kỳ nội dung nào vi phạm Điều khoản sử dụng mà không cần thông báo trước.
        </p>

        <h2>4. Tài Khoản và Bảo Mật</h2>
        <p>
          Bạn chịu trách nhiệm bảo mật thông tin tài khoản và mật khẩu của mình. Bạn đồng ý thông báo ngay cho chúng tôi nếu phát hiện bất kỳ hành vi sử dụng trái phép nào đối với tài khoản của bạn.
        </p>

        <h2>5. Thanh Toán và Dịch Vụ VIP</h2>
        <p>
          Các giao dịch mua Coin hoặc mở khóa chương VIP trên hệ thống là không hoàn lại, trừ trường hợp có lỗi phát sinh từ hệ thống của Truyện Chữ. Chúng tôi bảo lưu quyền thay đổi giá dịch vụ bất kỳ lúc nào và sẽ thông báo công khai trên website.
        </p>

        <h2>6. Miễn Trừ Trách Nhiệm</h2>
        <p>
          Truyện Chữ không đảm bảo rằng dịch vụ sẽ hoạt động liên tục, không có lỗi hoặc hoàn toàn an toàn. Chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại trực tiếp hay gián tiếp nào phát sinh từ việc sử dụng dịch vụ.
        </p>
      </div>
    </div>
  );
}
