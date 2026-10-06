import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BottomCenterAdModal } from "@/components/ads/bottom-center-ad-modal";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      {/* Modal quảng cáo tiếp thị có thể bỏ qua ở giữa dưới */}
      <BottomCenterAdModal />
    </div>
  );
}
