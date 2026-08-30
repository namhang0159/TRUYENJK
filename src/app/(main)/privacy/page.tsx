import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Chính Sách Bảo Mật - Truyện Chữ",
  description: "Chính sách bảo mật thông tin tại Truyện Chữ",
};

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-6">
          <ShieldCheck className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Chính Sách Bảo Mật</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Cập nhật lần cuối: Tháng 8 năm 2026
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h2>1. Thu Thập Thông Tin</h2>
        <p>
          Truyện Chữ cam kết bảo vệ quyền riêng tư của bạn. Chúng tôi chỉ thu thập các thông tin cá nhân tối thiểu cần thiết để cung cấp dịch vụ tốt nhất, bao gồm:
        </p>
        <ul>
          <li><strong>Thông tin tài khoản:</strong> Địa chỉ email, tên hiển thị, mật khẩu (được mã hóa) khi bạn đăng ký.</li>
          <li><strong>Thông tin sử dụng:</strong> Lịch sử đọc truyện, đánh giá, bình luận, thời gian nghe audio.</li>
          <li><strong>Thông tin thanh toán:</strong> Khi nạp Coin, chúng tôi sử dụng các cổng thanh toán bên thứ ba bảo mật. Chúng tôi không lưu trữ trực tiếp thông tin thẻ tín dụng của bạn.</li>
        </ul>

        <h2>2. Sử Dụng Thông Tin</h2>
        <p>
          Chúng tôi sử dụng thông tin của bạn để:
        </p>
        <ul>
          <li>Duy trì và cung cấp dịch vụ trên Truyện Chữ.</li>
          <li>Lưu trữ lịch sử đọc để bạn có thể tiếp tục đọc dễ dàng ở nhiều thiết bị.</li>
          <li>Gợi ý truyện phù hợp với sở thích cá nhân.</li>
          <li>Liên lạc với bạn về các thông báo quan trọng, cập nhật điều khoản hoặc hỗ trợ kỹ thuật.</li>
        </ul>

        <h2>3. Chia Sẻ Thông Tin</h2>
        <p>
          Truyện Chữ cam kết <strong>không bán, cho thuê hoặc chia sẻ</strong> thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào vì mục đích tiếp thị. Chúng tôi chỉ chia sẻ thông tin trong các trường hợp sau:
        </p>
        <ul>
          <li>Có sự đồng ý rõ ràng của bạn.</li>
          <li>Để tuân thủ các yêu cầu pháp lý từ cơ quan có thẩm quyền.</li>
          <li>Sử dụng các dịch vụ bên thứ ba (như Google Analytics, Stripe) theo điều khoản bảo mật nghiêm ngặt để vận hành hệ thống.</li>
        </ul>

        <h2>4. Bảo Mật Dữ Liệu</h2>
        <p>
          Chúng tôi áp dụng các biện pháp an ninh kỹ thuật và tổ chức để bảo vệ dữ liệu của bạn khỏi việc truy cập trái phép, mất mát, phá hủy hoặc thay đổi. Tuy nhiên, không có phương thức truyền tải qua Internet nào là an toàn 100%, do đó chúng tôi không thể đảm bảo an toàn tuyệt đối.
        </p>

        <h2>5. Quyền Của Bạn</h2>
        <p>
          Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa tài khoản và thông tin cá nhân của mình bất kỳ lúc nào bằng cách sử dụng các tính năng trong phần Quản lý tài khoản hoặc liên hệ với chúng tôi qua email hỗ trợ.
        </p>
      </div>
    </div>
  );
}
