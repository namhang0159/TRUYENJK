"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axiosInstance from "@/lib/axios";

import { Suspense } from 'react';

function VNPayResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Đang xử lý kết quả giao dịch...");

  useEffect(() => {
    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
    
    if (!vnp_ResponseCode) {
      setStatus("error");
      setMessage("Không tìm thấy thông tin giao dịch.");
      return;
    }

    // Call backend to verify and process
    const paramsString = searchParams.toString();
    axiosInstance.get(`/payment/vnpay-return?${paramsString}`)
      .then(res => {
        if (res.data.code === '00' || res.data.code === '02') {
          setStatus("success");
          setMessage("Giao dịch nạp xu thành công!");
        } else {
          setStatus("error");
          setMessage(res.data.message || "Giao dịch thất bại.");
        }
      })
      .catch(err => {
        setStatus("error");
        setMessage(err.response?.data?.message || "Lỗi khi xác minh giao dịch với máy chủ.");
      });
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-xl text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
            <h2 className="text-xl font-bold text-white">Đang xử lý...</h2>
            <p className="text-zinc-400">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center space-y-6">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Thanh Toán Thành Công</h2>
              <p className="text-zinc-400">{message}</p>
            </div>
            <Link href="/profile/wallet" className="w-full">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                Quay lại Ví
              </Button>
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center space-y-6">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-2">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Thanh Toán Thất Bại</h2>
              <p className="text-zinc-400">{message}</p>
            </div>
            <Link href="/profile/wallet" className="w-full">
              <Button variant="outline" className="w-full">
                Thử lại
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VNPayResultPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-xl text-center flex flex-col items-center space-y-4">
          <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
          <h2 className="text-xl font-bold text-white">Đang tải...</h2>
        </div>
      </div>
    }>
      <VNPayResultContent />
    </Suspense>
  );
}
