import { Metadata } from "next";
import { WalletBalance } from "@/components/profile/wallet/wallet-balance";
import { TopUpPackages } from "@/components/profile/wallet/topup-packages";
import { VipSubscription } from "@/components/profile/wallet/vip-subscription";
import { TransactionHistory } from "@/components/profile/wallet/transaction-history";

export const metadata: Metadata = {
  title: "Quản lý Ví Tiền | STruyen",
  description: "Quản lý số dư Coin, nạp tiền và xem lịch sử giao dịch",
};

export default function WalletPage() {
  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Quản Lý Ví Tiền
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Kiểm tra số dư, nạp Coin để trải nghiệm đọc truyện VIP và ủng hộ tác giả.
        </p>
      </div>

      {/* Balance Card */}
      <WalletBalance />

      {/* VIP Subscription */}
      <VipSubscription />

      {/* Top up packages */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-sm text-gray-500 uppercase tracking-widest font-semibold">
            Nạp Coin
          </span>
        </div>
      </div>
      <TopUpPackages />

      {/* Transaction History */}
      <div className="relative pt-8">
        <TransactionHistory />
      </div>
    </div>
  );
}
