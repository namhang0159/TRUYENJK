"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Coins, TrendingUp, Download, Calendar, Loader2, BookOpen, Gift, Wallet, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuthorRevenue } from '@/hooks/use-author';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function RevenuePage() {
  const [isExporting, setIsExporting] = useState(false);
  const router = useRouter();

  const { data: stats, isLoading: isStatsLoading } = useAuthorRevenue();

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      alert("Đã xuất file báo cáo doanh thu!");
      setIsExporting(false);
    }, 1000);
  };

  if (isStatsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const totalRevenue = stats?.totalRevenue || 0;
  const currentBalance = stats?.currentBalance || 0;
  const totalUnlock = stats?.totalUnlock || 0;
  const totalDonate = stats?.totalDonate || 0;
  const monthlyData = stats?.monthlyData || [];
  const recentTransactions = stats?.recentTransactions || [];
  const revenueByStory = stats?.revenueByStory || [];
  const revenueByChapter = stats?.revenueByChapter || [];
  const revenueByGift = stats?.revenueByGift || [];

  const unlockPercent = totalRevenue > 0 ? Math.round((totalUnlock / totalRevenue) * 100) : 0;
  const donatePercent = totalRevenue > 0 ? Math.round((totalDonate / totalRevenue) * 100) : 0;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-zinc-900 pb-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-light tracking-tight text-white">Quản lý Doanh thu</h1>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-2">Xem chi tiết doanh thu (đã trừ phí nền tảng).</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-3"
        >
          <Button onClick={handleExport} disabled={isExporting} variant="outline" className="rounded-none border-zinc-800 bg-transparent hover:bg-white hover:text-black font-mono text-[10px] uppercase tracking-widest transition-colors h-10">
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? 'Đang xuất...' : 'Xuất báo cáo'}
          </Button>
          <Button onClick={() => router.push('/studio/withdrawals')} className="rounded-none border-emerald-500/50 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black font-mono text-[10px] uppercase tracking-widest transition-colors h-10">
            <Wallet className="mr-2 h-4 w-4" />
            Rút tiền
          </Button>
        </motion.div>
      </div>
      
      {/* Overview Cards (Bento/Glassmorphism) */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-4"
      >
        <motion.div variants={itemVariants} className="md:col-span-2 border border-zinc-900 bg-black p-6 flex flex-col justify-between group">
          <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
            <Wallet className="w-3 h-3 text-emerald-500" /> Số dư khả dụng
          </div>
          <div>
            <div className="text-5xl font-light text-white font-mono">{currentBalance.toLocaleString()} <span className="text-lg text-emerald-500">Xu</span></div>
            <div className="text-[10px] text-emerald-500 uppercase tracking-widest font-mono mt-4 flex items-center">
              <CheckCircle2 className="w-3 h-3 mr-2" /> Sẵn sàng để rút
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="border border-zinc-900 bg-black p-6 flex flex-col justify-between group">
          <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-6 flex justify-between items-center">
            <span>Từ Mở Khóa</span>
            <BookOpen className="w-3 h-3 text-zinc-400" />
          </div>
          <div>
            <div className="text-3xl font-light text-white font-mono mb-4">{totalUnlock.toLocaleString()}</div>
            <div className="h-[2px] w-full bg-zinc-900 mb-2">
              <div className="h-full bg-zinc-500" style={{ width: `${unlockPercent}%` }} />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">{unlockPercent}% tổng thu</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="border border-zinc-900 bg-black p-6 flex flex-col justify-between group">
          <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-6 flex justify-between items-center">
            <span>Từ Quà Tặng</span>
            <Gift className="w-3 h-3 text-amber-500" />
          </div>
          <div>
            <div className="text-3xl font-light text-white font-mono mb-4">{totalDonate.toLocaleString()}</div>
            <div className="h-[2px] w-full bg-zinc-900 mb-2">
              <div className="h-full bg-amber-500" style={{ width: `${donatePercent}%` }} />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">{donatePercent}% tổng thu</p>
          </div>
        </motion.div>
      </motion.div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex w-full bg-transparent border-b border-zinc-900 p-0 rounded-none mb-8">
          <TabsTrigger value="overview" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:text-white text-zinc-500 font-mono text-[10px] uppercase tracking-widest px-6 py-4 transition-colors">
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="stories" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:text-white text-zinc-500 font-mono text-[10px] uppercase tracking-widest px-6 py-4 transition-colors">
            Theo Truyện
          </TabsTrigger>
          <TabsTrigger value="chapters" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:text-white text-zinc-500 font-mono text-[10px] uppercase tracking-widest px-6 py-4 transition-colors">
            Theo Chương
          </TabsTrigger>
          <TabsTrigger value="gifts" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:text-white text-zinc-500 font-mono text-[10px] uppercase tracking-widest px-6 py-4 transition-colors">
            Quà tặng
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-zinc-900 bg-black p-6"
          >
            <div className="flex flex-row items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-light text-white">Biểu đồ Doanh thu (7 Tháng Gần Nhất)</h3>
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mt-2">Số Xu Tác giả thực nhận sau khi đã trừ phí nền tảng.</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500 border border-zinc-900 px-4 py-2">
                <Calendar className="h-3 w-3" />
                <span>Năm {new Date().getFullYear()}</span>
              </div>
            </div>
            
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#a1a1aa'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#a1a1aa'}} dx={-10} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #3f3f46', backgroundColor: '#18181b', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }} 
                    itemStyle={{ color: '#e4e4e7' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="unlock" name="Mở Khóa Chương" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="donate" name="Tặng Quà (Donate)" stackId="a" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border border-zinc-900 bg-black p-6"
          >
            <div className="mb-8">
              <h3 className="text-lg font-light text-white">Giao dịch gần đây</h3>
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mt-2">Lịch sử nhận chia sẻ doanh thu chi tiết</p>
            </div>
            
            <div className="space-y-0 border border-zinc-900 divide-y divide-zinc-900">
              {recentTransactions.length === 0 ? (
                <div className="text-center font-mono text-[10px] uppercase tracking-widest text-zinc-500 py-12">Chưa có giao dịch nào</div>
              ) : (
                recentTransactions.map((tx: any) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-transparent hover:bg-zinc-950 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 ${tx.type === 'DONATE' ? 'text-amber-500 border border-amber-500/20' : 'text-zinc-400 border border-zinc-800'} transition-colors`}>
                        {tx.type === 'DONATE' ? <Gift className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-mono text-xs text-white">
                          {tx.type === 'DONATE' 
                            ? `Nhận ${tx.gift?.item_name || 'quà'} từ ${tx.reader?.display_name || 'Ẩn danh'}` 
                            : `${tx.reader?.display_name || 'Ẩn danh'} mở khóa Chương ${tx.chapter?.chapter_number || ''}`}
                        </p>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mt-2 flex items-center gap-2">
                          <Clock className="w-3 h-3" /> {new Date(tx.created_at).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-emerald-500 text-sm">+{tx.amount} Xu</p>
                      <p className="font-mono text-[10px] text-zinc-600 mt-2 uppercase tracking-widest">Tổng chi: {tx.gross}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {recentTransactions.length >= 20 && (
              <Button variant="outline" className="w-full mt-6 rounded-none border-zinc-900 bg-transparent text-zinc-500 hover:bg-white hover:text-black font-mono text-[10px] uppercase tracking-widest transition-colors h-10">
                Xem tất cả lịch sử
              </Button>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="stories" className="space-y-6 mt-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-zinc-900 bg-black p-6"
          >
            <div className="mb-8">
              <h3 className="text-lg font-light text-white">Doanh thu theo Truyện</h3>
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mt-2">Chi tiết doanh thu của từng bộ truyện bạn đang sáng tác.</p>
            </div>
            <div className="border border-zinc-900 bg-black">
              <Table>
                <TableHeader className="border-b border-zinc-900 bg-zinc-950">
                  <TableRow className="border-zinc-900 hover:bg-transparent">
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 py-4">Tên truyện</TableHead>
                    <TableHead className="text-right font-mono text-[10px] uppercase tracking-widest text-zinc-500 py-4">Mở khóa (Xu)</TableHead>
                    <TableHead className="text-right font-mono text-[10px] uppercase tracking-widest text-zinc-500 py-4">Tặng quà (Xu)</TableHead>
                    <TableHead className="text-right font-mono text-[10px] uppercase tracking-widest text-emerald-500 py-4">Tổng thu</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenueByStory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center font-mono text-[10px] uppercase tracking-widest text-zinc-500 py-12">Chưa có dữ liệu doanh thu</TableCell>
                    </TableRow>
                  ) : (
                    revenueByStory.map((story: any) => (
                      <TableRow key={story.id} className="border-zinc-900 hover:bg-zinc-900/50 transition-colors">
                        <TableCell className="font-mono text-xs text-white py-4">{story.title}</TableCell>
                        <TableCell className="text-right font-mono text-xs text-zinc-400 py-4">{story.unlock.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono text-xs text-zinc-400 py-4">{story.donate.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono text-sm text-emerald-500 py-4">+{story.total.toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="chapters" className="space-y-6 mt-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-zinc-900 bg-black p-6"
          >
            <div className="mb-8">
              <h3 className="text-lg font-light text-white">Doanh thu theo Chương</h3>
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mt-2">Bảng xếp hạng các chương mang lại nhiều doanh thu mở khóa nhất.</p>
            </div>
              <div className="border border-zinc-900 bg-black">
              <Table>
                <TableHeader className="border-b border-zinc-900 bg-zinc-950">
                  <TableRow className="border-zinc-900 hover:bg-transparent">
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 py-4">Chương</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 py-4">Thuộc truyện</TableHead>
                    <TableHead className="text-right font-mono text-[10px] uppercase tracking-widest text-emerald-500 py-4">Tổng thu (Xu)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenueByChapter.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center font-mono text-[10px] uppercase tracking-widest text-zinc-500 py-12">Chưa có dữ liệu mở khóa chương</TableCell>
                    </TableRow>
                  ) : (
                    revenueByChapter.map((chap: any, index: number) => (
                      <TableRow key={chap.id} className="border-zinc-900 hover:bg-zinc-900/50 transition-colors">
                        <TableCell>
                          <div className="font-mono text-xs text-white flex items-center gap-3 py-2">
                            {index < 3 && (
                              <span className={`w-8 h-8 flex items-center justify-center font-mono text-[10px] uppercase tracking-widest border ${index === 0 ? 'bg-amber-500/10 text-amber-500 border-amber-500/50' : index === 1 ? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/50' : 'bg-orange-500/10 text-orange-500 border-orange-500/50'}`}>
                                #{index + 1}
                              </span>
                            )}
                            <span>Chương {chap.chapter_number}: {chap.title}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">{chap.storyTitle}</TableCell>
                        <TableCell className="text-right font-mono text-sm text-emerald-500">+{chap.total.toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="gifts" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="border border-zinc-900 bg-black p-6"
            >
              <div className="mb-8">
                <h3 className="text-lg font-light text-white">Thống kê loại Quà tặng</h3>
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mt-2">Các loại quà độc giả yêu thích tặng nhất.</p>
              </div>
              <div className="border border-zinc-900 bg-black">
                <Table>
                  <TableHeader className="border-b border-zinc-900 bg-zinc-950">
                    <TableRow className="border-zinc-900 hover:bg-transparent">
                      <TableHead className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 py-4">Vật phẩm</TableHead>
                      <TableHead className="text-right font-mono text-[10px] uppercase tracking-widest text-zinc-500 py-4">Số lượt tặng</TableHead>
                      <TableHead className="text-right font-mono text-[10px] uppercase tracking-widest text-emerald-500 py-4">Tổng thu (Xu)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenueByGift.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center font-mono text-[10px] uppercase tracking-widest text-zinc-500 py-12">Chưa có dữ liệu tặng quà</TableCell>
                      </TableRow>
                    ) : (
                      revenueByGift.map((gift: any) => (
                        <TableRow key={gift.item_name} className="border-zinc-900 hover:bg-zinc-900/50 transition-colors">
                          <TableCell className="font-mono text-xs text-white py-4 flex items-center gap-3">
                            <div className="p-2 border border-amber-500/20 text-amber-500">
                              <Gift className="h-4 w-4" />
                            </div>
                            {gift.item_name}
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs text-zinc-400 py-4">{gift.count.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-mono text-sm text-emerald-500 py-4">+{gift.total.toLocaleString()}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="border border-zinc-900 bg-black p-6"
            >
              <div className="mb-8">
                <h3 className="text-lg font-light text-white">Biểu đồ Quà tặng</h3>
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mt-2">Tỷ trọng doanh thu từ các loại quà.</p>
              </div>
              <div className="flex justify-center items-center h-[300px]">
                {revenueByGift.length === 0 ? (
                  <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Chưa có dữ liệu</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueByGift}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        stroke="none"
                        fill="#8884d8"
                        dataKey="total"
                        nameKey="item_name"
                        label={({ name, percent = 0 }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      >
                        {revenueByGift.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '0px', border: '1px solid #27272a', backgroundColor: '#000', color: '#fff' }} 
                        itemStyle={{ color: '#a1a1aa', fontFamily: 'monospace', fontSize: '12px' }}
                        formatter={(value: any) => [`${value} Xu`, 'Doanh thu']} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
