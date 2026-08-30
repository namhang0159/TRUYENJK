import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { GoogleProvider } from "@/providers/google-provider";
import { SocketProvider } from "@/providers/socket-provider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Hệ Thống Truyện Premium',
    default: 'Đọc Truyện Audio Tiên Hiệp, Kiếm Hiệp Premium',
  },
  description: "Trải nghiệm đọc truyện và nghe truyện audio AI chất lượng cao với hàng ngàn tác phẩm độc quyền, cập nhật liên tục.",
  keywords: ['đọc truyện', 'truyện audio', 'truyện tiên hiệp', 'nghe truyện AI', 'truyện chữ'],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://duantruyen.com',
    siteName: 'Hệ Thống Truyện Premium',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <GoogleProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ReactQueryProvider>
              <SocketProvider>
                {children}
              </SocketProvider>
            </ReactQueryProvider>
          </ThemeProvider>
        </GoogleProvider>
      </body>
    </html>
  );
}
