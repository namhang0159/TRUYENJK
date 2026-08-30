"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { GoogleButton } from "./google-button";
import { Separator } from "@/components/ui/separator";

export function AuthTabs({ defaultTab = "login" }: { defaultTab?: "login" | "register" }) {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card rounded-2xl shadow-xl border border-border/50">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Chào mừng đến với Truyện Chữ</h1>
        <p className="text-sm text-muted-foreground mt-2">Đăng nhập hoặc tạo tài khoản để trải nghiệm</p>
      </div>
      
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="login">Đăng nhập</TabsTrigger>
          <TabsTrigger value="register">Đăng ký</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login" className="mt-0">
          <LoginForm />
        </TabsContent>
        <TabsContent value="register" className="mt-0">
          <RegisterForm />
        </TabsContent>
      </Tabs>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Hoặc tiếp tục với
          </span>
        </div>
      </div>

      <GoogleButton />
    </div>
  );
}
