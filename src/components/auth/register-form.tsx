"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useRef } from "react";
import {
  Loader2,
  Mail,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import {
  registerSchema,
  RegisterSchemaType,
  otpSchema,
  OtpSchemaType,
} from "@/schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export function RegisterForm() {
  const [step, setStep] = useState<"form" | "otp">("form");
  const [formData, setFormData] = useState<RegisterSchemaType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const otpInputRef = useRef<HTMLInputElement>(null);

  const { register: authRegister, sendRegisterOtp } = useAuth();

  // Form bước 1: Thông tin tài khoản
  const {
    register: registerField,
    handleSubmit: handleSubmitForm,
    formState: { errors: formErrors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
  });

  // Form bước 2: Xác thực OTP
  const {
    register: registerOtpField,
    handleSubmit: handleSubmitOtp,
    setValue: setOtpValue,
    watch: watchOtp,
    formState: { errors: otpErrors },
  } = useForm<OtpSchemaType>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const otpValue = watchOtp("otp");

  // Focus ô OTP khi chuyển sang step 2
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => {
        otpInputRef.current?.focus();
      }, 150);
    }
  }, [step]);

  // Quản lý đếm ngược OTP cooldown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpCountdown > 0) {
      timer = setTimeout(() => {
        setOtpCountdown((c) => {
          const next = c - 1;
          if (next <= 0 && formData?.email) {
            localStorage.removeItem(
              `otp_cooldown_register_${formData.email.trim().toLowerCase()}`,
            );
          }
          return next;
        });
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown, formData?.email]);

  // Submit Bước 1: Gửi OTP và chuyển sang Bước 2
  const onFormSubmit = async (data: RegisterSchemaType) => {
    setIsLoading(true);
    const trimmedEmail = data.email.trim().toLowerCase();

    try {
      await sendRegisterOtp(trimmedEmail);
      setFormData(data);
      setStep("otp");
      toast.success("Mã xác thực OTP đã được gửi đến email của bạn!");

      // Khởi tạo cooldown 60s
      const expiry = Date.now() + 60 * 1000;
      localStorage.setItem(
        `otp_cooldown_register_${trimmedEmail}`,
        expiry.toString(),
      );
      setOtpCountdown(60);
    } catch (error: any) {
      const errMsg = error.message || "Không thể gửi mã OTP";
      toast.error(errMsg);

      // Nếu lỗi do cooldown còn thời gian, lưu state để chuyển sang OTP step nếu cần
      const matchSeconds = errMsg.match(/(\d+)\s*giây/);
      if (matchSeconds && matchSeconds[1]) {
        const secs = parseInt(matchSeconds[1], 10);
        if (secs > 0) {
          const expiry = Date.now() + secs * 1000;
          localStorage.setItem(
            `otp_cooldown_register_${trimmedEmail}`,
            expiry.toString(),
          );
          setOtpCountdown(secs);
          setFormData(data);
          setStep("otp");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Gửi lại mã OTP ở Bước 2
  const handleResendOtp = async () => {
    if (!formData?.email || otpCountdown > 0 || isResendingOtp) return;

    setIsResendingOtp(true);
    const trimmedEmail = formData.email.trim().toLowerCase();

    try {
      await sendRegisterOtp(trimmedEmail);
      toast.success("Đã gửi lại mã xác thực mới vào email của bạn!");
      const expiry = Date.now() + 60 * 1000;
      localStorage.setItem(
        `otp_cooldown_register_${trimmedEmail}`,
        expiry.toString(),
      );
      setOtpCountdown(60);
    } catch (error: any) {
      toast.error(error.message || "Không thể gửi lại mã OTP");
    } finally {
      setIsResendingOtp(false);
    }
  };

  // Submit Bước 2: Hoàn tất đăng ký với mã OTP
  const onOtpSubmit = async (otpData: OtpSchemaType) => {
    if (!formData) {
      toast.error("Thiếu thông tin đăng ký, vui lòng nhập lại");
      setStep("form");
      return;
    }

    setIsLoading(true);
    try {
      await authRegister({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        display_name: formData.displayName,
        otp: otpData.otp,
      });

      toast.success("Đăng ký tài khoản thành công! Đang chuyển hướng...");
      
      // Xóa cooldown lưu trữ
      localStorage.removeItem(
        `otp_cooldown_register_${formData.email.trim().toLowerCase()}`,
      );

      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || "Xác thực OTP thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {step === "form" ? (
        // ================= BƯỚC 1: NHẬP THÔNG TIN ĐĂNG KÝ =================
        <form onSubmit={handleSubmitForm(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Tên hiển thị</Label>
            <Input
              id="displayName"
              type="text"
              placeholder="VD: Nguyễn Văn A"
              {...registerField("displayName")}
            />
            {formErrors.displayName && (
              <p className="text-sm text-red-500">
                {formErrors.displayName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-email">Email</Label>
            <Input
              id="reg-email"
              type="email"
              placeholder="name@example.com"
              {...registerField("email")}
            />
            {formErrors.email && (
              <p className="text-sm text-red-500">
                {formErrors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-password">Mật khẩu</Label>
            <Input
              id="reg-password"
              type="password"
              placeholder="••••••••"
              {...registerField("password")}
            />
            {formErrors.password && (
              <p className="text-sm text-red-500">
                {formErrors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...registerField("confirmPassword")}
            />
            {formErrors.confirmPassword && (
              <p className="text-sm text-red-500">
                {formErrors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang kiểm tra & gửi mã xác nhận...
              </>
            ) : (
              <>
                Đăng ký tài khoản
              </>
            )}
          </Button>
        </form>
      ) : (
        // ================= BƯỚC 2: XÁC THỰC EMAIL BẰNG OTP =================
        <div className="space-y-5 animate-in fade-in-50 duration-200">
          <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-base text-foreground">
              Xác thực địa chỉ Email
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Mã xác thực OTP gồm 6 chữ số đã được gửi đến:
              <br />
              <span className="font-medium text-foreground text-sm">
                {formData?.email}
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmitOtp(onOtpSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp-input" className="text-center block text-xs uppercase tracking-wider text-muted-foreground">
                Nhập mã xác thực (OTP)
              </Label>
              <div className="relative">
                <Input
                  id="otp-input"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="000000"
                  className="font-mono text-center tracking-[0.6em] text-2xl h-14 uppercase font-bold"
                  {...registerOtpField("otp", {
                    onChange: (e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setOtpValue("otp", val);
                    },
                  })}
                />
              </div>
              {otpErrors.otp && (
                <p className="text-sm text-red-500 text-center">
                  {otpErrors.otp.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span>Chưa nhận được mã?</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResendOtp}
                disabled={isResendingOtp || otpCountdown > 0}
                className="h-auto p-0 text-primary hover:bg-transparent font-medium disabled:opacity-60"
              >
                {isResendingOtp ? (
                  <span className="flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Đang gửi...
                  </span>
                ) : otpCountdown > 0 ? (
                  <span className="text-muted-foreground font-mono">
                    Gửi lại sau {otpCountdown}s
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-primary hover:underline">
                    <RotateCcw className="w-3 h-3" /> Gửi lại mã OTP
                  </span>
                )}
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-sm font-semibold"
              disabled={isLoading || !otpValue || otpValue.length < 6}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xác thực & kích hoạt tài khoản...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Xác nhận & Hoàn tất
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setStep("form")}
              disabled={isLoading}
              className="w-full text-xs text-muted-foreground"
            >
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Đổi email hoặc sửa thông tin
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
