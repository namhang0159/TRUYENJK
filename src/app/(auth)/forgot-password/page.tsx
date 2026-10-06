"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, KeyRound, Lock, ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"EMAIL" | "RESET">("EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Vui lòng nhập địa chỉ email");
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axiosInstance.post("/auth/forgot-password", { email: email.trim() });
      toast.success(data.message || "Mã xác thực đã được gửi đến email của bạn");
      setStep("RESET");
      setCooldown(60);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể gửi mã xác thực. Vui lòng kiểm tra lại email.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error("Vui lòng nhập mã OTP");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có tối thiểu 6 ký tự");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axiosInstance.post("/auth/reset-password", {
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      });
      toast.success(data.message || "Đặt lại mật khẩu thành công!");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Đặt lại mật khẩu thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-red-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="border-border shadow-xl backdrop-blur bg-card/90">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-center">
              {step === "EMAIL" ? "Quên mật khẩu" : "Đặt lại mật khẩu"}
            </CardTitle>
            <CardDescription className="text-center text-sm">
              {step === "EMAIL"
                ? "Nhập email tài khoản của bạn để nhận mã xác thực đặt lại mật khẩu"
                : `Nhập mã OTP vừa gửi tới ${email} và thiết lập mật khẩu mới`}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {step === "EMAIL" ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email đăng ký</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      className="pl-9"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                  {isLoading ? "Đang gửi mã..." : "Gửi mã xác thực"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mã OTP (6 chữ số)</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Nhập 6 số OTP"
                      className="pl-9 font-mono tracking-widest text-center text-lg"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Mật khẩu mới</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Tối thiểu 6 ký tự"
                      className="pl-9"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Xác nhận mật khẩu mới</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Nhập lại mật khẩu mới"
                      className="pl-9"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={cooldown > 0 || isLoading}
                    className="text-primary hover:underline disabled:text-muted-foreground cursor-pointer"
                  >
                    {cooldown > 0 ? `Gửi lại mã sau (${cooldown}s)` : "Chưa nhận được mã? Gửi lại"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep("EMAIL")}
                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Đổi email khác
                  </button>
                </div>

                <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                  {isLoading ? "Đang cập nhật..." : "Lưu mật khẩu mới"}
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex justify-center border-t border-border pt-4">
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại trang đăng nhập
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
