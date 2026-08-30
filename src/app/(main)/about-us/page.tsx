import { BookOpen } from "lucide-react";

export const metadata = {
  title: "Về Chúng Tôi - Truyện Chữ",
  description: "Giới thiệu về nền tảng Truyện Chữ",
};

export default function AboutUsPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-6">
          <BookOpen className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Về Chúng Tôi</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Truyện Chữ - Nền tảng đọc truyện trực tuyến hàng đầu dành cho những người yêu thích thế giới văn học mạng.
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h2>Sứ Mệnh Của Chúng Tôi</h2>
        <p>
          Chúng tôi xây dựng <strong>Truyện Chữ</strong> với mục tiêu mang đến một không gian giải trí lành mạnh, chất lượng cao và hoàn toàn miễn phí cho độc giả Việt Nam. Chúng tôi tin rằng mỗi câu chuyện đều chứa đựng những giá trị sâu sắc, những chuyến phiêu lưu kỳ thú và những bài học đáng giá. Sứ mệnh của chúng tôi là kết nối các tác giả tài năng với hàng triệu độc giả khao khát những trang sách mới.
        </p>

        <h2>Nền Tảng Của Tương Lai</h2>
        <p>
          Không chỉ dừng lại ở việc đọc chữ, Truyện Chữ còn tiên phong trong việc ứng dụng công nghệ chuyển đổi văn bản thành giọng nói (Text-to-Speech) AI tiên tiến. Giờ đây, bạn có thể "nghe" những bộ truyện yêu thích ở bất cứ đâu, dù đang lái xe, tập thể dục hay trước khi đi ngủ.
        </p>

        <h2>Đồng Hành Cùng Tác Giả</h2>
        <p>
          Chúng tôi cung cấp hệ thống <strong>Author Studio</strong> mạnh mẽ, giúp các tác giả dễ dàng đăng tải, quản lý tác phẩm và tương tác với độc giả. Với hệ thống chia sẻ doanh thu minh bạch và tính năng Donate, chúng tôi đảm bảo các tác giả luôn nhận được phần thưởng xứng đáng cho công sức sáng tạo của mình.
        </p>

        <h2>Liên Hệ</h2>
        <p>
          Mọi thắc mắc, góp ý hoặc hợp tác, vui lòng liên hệ với chúng tôi qua email: <strong>contact@truyenchu.vn</strong> hoặc tham gia cộng đồng của chúng tôi trên các nền tảng mạng xã hội.
        </p>
      </div>
    </div>
  );
}
