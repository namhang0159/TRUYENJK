import Link from "next/link";
import { Header } from "@/components/layout/header";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40 py-8 mt-12">
      <div className="container max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>© 2026 Truyện Chữ. Nền tảng đọc truyện trực tuyến hàng đầu.</p>
        <div className="flex justify-center gap-4 mt-4">
          <Link href="/about-us" className="hover:text-primary">Về chúng tôi</Link>
          <Link href="/terms" className="hover:text-primary">Điều khoản</Link>
          <Link href="/privacy" className="hover:text-primary">Bảo mật</Link>
        </div>
      </div>
    </footer>
  );
}
