import { AuthTabs } from "@/components/auth/auth-tabs";

export const metadata = {
  title: "Đăng ký - Truyện Chữ",
  description: "Trang đăng ký tài khoản cho ứng dụng Truyện Chữ.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <AuthTabs defaultTab="register" />
      </div>
    </div>
  );
}
