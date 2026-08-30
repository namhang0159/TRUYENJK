"use client";

import { useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowDownRight, ArrowUpRight, Gift, Unlock, CreditCard } from "lucide-react";
import { useTransactions } from "@/hooks/use-finance";
type TransactionType = "topup" | "unlock" | "gift";
type TransactionStatus = "success" | "pending" | "failed";

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  createdAt: string;
  description: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "tx_1", type: "topup", amount: 1100, status: "success", createdAt: "2026-08-08T10:30:00Z", description: "Nạp qua MoMo" },
  { id: "tx_2", type: "unlock", amount: -50, status: "success", createdAt: "2026-08-07T21:15:00Z", description: "Mở khóa Chương 45 - Thần Kiếm" },
  { id: "tx_3", type: "gift", amount: -200, status: "success", createdAt: "2026-08-06T19:40:00Z", description: "Tặng Hoa Hồng cho Tác giả A" },
  { id: "tx_4", type: "topup", amount: 500, status: "failed", createdAt: "2026-08-05T08:20:00Z", description: "Nạp qua VNPay" },
  { id: "tx_5", type: "unlock", amount: -50, status: "success", createdAt: "2026-08-04T22:10:00Z", description: "Mở khóa Chương 44 - Thần Kiếm" },
  { id: "tx_6", type: "topup", amount: 200, status: "success", createdAt: "2026-08-01T14:00:00Z", description: "Nạp qua MoMo" },
  { id: "tx_7", type: "gift", amount: -500, status: "success", createdAt: "2026-07-28T09:30:00Z", description: "Tặng Tàu Vũ Trụ cho Tác giả B" },
  { id: "tx_8", type: "unlock", amount: -30, status: "success", createdAt: "2026-07-27T23:55:00Z", description: "Mở khóa Chương 10 - Tình Yêu" },
  { id: "tx_9", type: "topup", amount: 500, status: "success", createdAt: "2026-07-25T11:15:00Z", description: "Nạp qua Thẻ Cào" },
  { id: "tx_10", type: "unlock", amount: -30, status: "success", createdAt: "2026-07-24T20:20:00Z", description: "Mở khóa Chương 9 - Tình Yêu" },
  { id: "tx_11", type: "unlock", amount: -30, status: "success", createdAt: "2026-07-23T21:10:00Z", description: "Mở khóa Chương 8 - Tình Yêu" },
  { id: "tx_12", type: "topup", amount: 200, status: "success", createdAt: "2026-07-20T16:45:00Z", description: "Nạp qua MoMo" },
];

export function TransactionHistory() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { data: transactions = [], isLoading } = useTransactions();

  const filteredData = transactions.filter((tx) => {
    if (activeTab === "in") return tx.amount > 0;
    if (activeTab === "out") return tx.amount < 0;
    return true;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getTransactionIcon = (type: string) => {
    if (type.includes("TOPUP")) {
      return <div className="p-2 bg-green-100 text-green-600 rounded-full"><CreditCard className="w-4 h-4" /></div>;
    }
    if (type.includes("UNLOCK")) {
      return <div className="p-2 bg-orange-100 text-orange-600 rounded-full"><Unlock className="w-4 h-4" /></div>;
    }
    return <div className="p-2 bg-pink-100 text-pink-600 rounded-full"><Gift className="w-4 h-4" /></div>;
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "SUCCESS":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Thành công</Badge>;
      case "PENDING":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Đang chờ</Badge>;
      case "FAILED":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Thất bại</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card id="transaction-history" className="scroll-mt-24 shadow-xl border-none ring-1 ring-gray-200/50 rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
      <CardHeader className="border-b bg-gray-50/80 pb-5 pt-6">
        <CardTitle className="text-2xl font-black flex items-center gap-2">
          Lịch Sử Biến Động
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="all" onValueChange={(val) => { setActiveTab(val); setCurrentPage(1); }} className="w-full">
          <div className="px-6 py-4 border-b">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="in" className="text-green-600 data-[state=active]:text-green-700">Nạp vào</TabsTrigger>
              <TabsTrigger value="out" className="text-red-600 data-[state=active]:text-red-700">Tiêu dùng</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value={activeTab} className="m-0 border-none p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="w-[200px] pl-6">Thời gian</TableHead>
                    <TableHead>Loại & Nội dung</TableHead>
                    <TableHead className="text-right">Biến động</TableHead>
                    <TableHead className="w-[120px] text-center pr-6">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.length > 0 ? (
                    currentData.map((tx) => (
                      <TableRow key={tx.id} className="hover:bg-gray-50/80 transition-colors">
                        <TableCell className="pl-6 font-medium text-gray-500">
                          {format(new Date(tx.created_at || new Date()), "HH:mm - dd/MM/yyyy", { locale: vi })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {getTransactionIcon(tx.type)}
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900">
                                {tx.type.includes("TOPUP") ? "Nạp Coin" : tx.type.includes("UNLOCK") ? "Mở khóa chương" : "Giao dịch"}
                              </span>
                              <span className="text-xs text-gray-500">{tx.description}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end font-bold text-base">
                            {tx.amount > 0 ? (
                              <span className="text-green-600 flex items-center">
                                +{tx.amount} <ArrowUpRight className="w-4 h-4 ml-1" />
                              </span>
                            ) : (
                              <span className="text-red-600 flex items-center">
                                {tx.amount} <ArrowDownRight className="w-4 h-4 ml-1" />
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center pr-6">
                          {getStatusBadge(tx.status)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32 text-center text-gray-500">
                        Không có dữ liệu giao dịch.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50/30">
                <span className="text-sm text-gray-500">
                  Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredData.length)} trong số {filteredData.length} giao dịch
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <Button
                        key={i}
                        variant={currentPage === i + 1 ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handlePageChange(i + 1)}
                        className={`h-8 w-8 p-0 ${currentPage === i + 1 ? "bg-gray-900" : ""}`}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
