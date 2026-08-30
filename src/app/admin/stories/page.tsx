"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert, BookOpen, Search, Eye, EyeOff, Hash, Clock, CheckCircle, ExternalLink, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAdminStories, useToggleStoryVisibility, useApproveStory } from '@/hooks/use-admin';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/use-debounce';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function AdminStoriesPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");

  const { data, isLoading } = useAdminStories(
    page, 
    20, 
    debouncedSearch,
    statusFilter === "all" ? "" : statusFilter,
    visibilityFilter === "all" ? "" : visibilityFilter
  );
  const { mutate: toggleVisibility, isPending: isToggling } = useToggleStoryVisibility();
  const { mutate: approveStory, isPending: isApproving } = useApproveStory();

  const handleToggle = (storyId: number, currentVisibility: string) => {
    const action = currentVisibility === 'PUBLIC' ? "ẨN" : "HIỂN THỊ";
    if (confirm(`THỰC THI: ${action} TRUYỆN #${storyId}?`)) {
      toggleVisibility(storyId);
    }
  };

  const handleApprove = (storyId: number, status: 'APPROVED' | 'REJECTED') => {
    if (confirm(`Bạn có chắc muốn ${status === 'APPROVED' ? 'Duyệt' : 'Từ chối'} truyện này?`)) {
      approveStory({ id: storyId, status });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.03 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const } }
  };

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-zinc-900">
        <div>
          <h1 className="text-4xl md:text-6xl font-outfit font-medium tracking-tight text-white mb-2 uppercase">
            Quản Lý Truyện
          </h1>
          <p className="text-zinc-500 font-mono text-sm tracking-wide uppercase">
            Hồ Sơ Hệ Thống // Dữ Liệu Truyện // Quyền Hiển Thị
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto font-mono text-sm">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" strokeWidth={1.5} />
            <Input 
              placeholder="Tìm kiếm tên truyện..." 
              className="pl-8 bg-transparent border-0 border-b border-zinc-800 focus-visible:border-white text-white placeholder:text-zinc-600 h-10 rounded-none focus-visible:ring-0 px-0 transition-colors"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v || "all"); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-36 bg-transparent border-0 border-b border-zinc-800 focus:border-white h-10 text-white rounded-none focus:ring-0 px-0 uppercase tracking-wider">
              <SelectValue placeholder="Trạng Thái" />
            </SelectTrigger>
            <SelectContent className="bg-black border-zinc-800 text-white rounded-none font-mono text-xs uppercase tracking-wider">
              <SelectItem value="all" className="focus:bg-zinc-900 focus:text-white rounded-none">Tất Cả</SelectItem>
              <SelectItem value="ONGOING" className="focus:bg-zinc-900 focus:text-white rounded-none">Đang Ra</SelectItem>
              <SelectItem value="COMPLETED" className="focus:bg-zinc-900 focus:text-white rounded-none">Đã Hoàn Thành</SelectItem>
              <SelectItem value="PAUSED" className="focus:bg-zinc-900 focus:text-white rounded-none">Tạm Ngưng</SelectItem>
            </SelectContent>
          </Select>
          <Select value={visibilityFilter} onValueChange={(v) => { setVisibilityFilter(v || "all"); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-40 bg-transparent border-0 border-b border-zinc-800 focus:border-white h-10 text-white rounded-none focus:ring-0 px-0 uppercase tracking-wider">
              <SelectValue placeholder="Hiển Thị" />
            </SelectTrigger>
            <SelectContent className="bg-black border-zinc-800 text-white rounded-none font-mono text-xs uppercase tracking-wider">
              <SelectItem value="all" className="focus:bg-zinc-900 focus:text-white rounded-none">Tất Cả</SelectItem>
              <SelectItem value="PUBLIC" className="focus:bg-zinc-900 focus:text-white rounded-none">Công Khai</SelectItem>
              <SelectItem value="PRIVATE" className="focus:bg-zinc-900 focus:text-white rounded-none">Hạn Chế</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid Content */}
      <div className="relative z-10">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-zinc-900 border border-zinc-900">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-none bg-black" />
            ))}
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[1px] bg-zinc-900 border border-zinc-900"
          >
            <AnimatePresence>
              {data?.stories?.map((story: any) => (
                <motion.div 
                  variants={itemVariants}
                  key={story.id}
                  className="group relative bg-black p-6 flex flex-col justify-between h-[200px] transition-colors hover:bg-zinc-950"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2 text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
                      <Hash className="w-3 h-3" />
                      {story.id.toString().padStart(4, '0')}
                    </div>
                    <div className="flex items-center gap-2">
                      {story.approval_status === 'PENDING' && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleApprove(story.id, 'APPROVED')}
                            disabled={isApproving}
                            className="h-6 w-6 rounded-none text-green-500 border-b border-transparent hover:text-white hover:border-green-400 hover:bg-green-500/20 transition-colors"
                            title="Duyệt truyện"
                          >
                            <CheckCircle className="h-3 w-3" strokeWidth={1.5} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleApprove(story.id, 'REJECTED')}
                            disabled={isApproving}
                            className="h-6 w-6 rounded-none text-red-500 border-b border-transparent hover:text-white hover:border-red-400 hover:bg-red-500/20 transition-colors"
                            title="Từ chối truyện"
                          >
                            <XCircle className="h-3 w-3" strokeWidth={1.5} />
                          </Button>
                        </>
                      )}
                      
                      <Link href={`/truyen/${story.slug}`} target="_blank">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 rounded-none text-zinc-500 hover:text-white border-b border-transparent hover:border-white transition-colors"
                          title="Xem chi tiết trên web"
                        >
                          <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleToggle(story.id, story.visibility)}
                        disabled={isToggling}
                        className={`h-6 w-6 rounded-none border-b ${
                          story.visibility === 'PUBLIC' 
                            ? "text-zinc-500 border-transparent hover:text-red-400 hover:border-red-400" 
                            : "text-red-500 border-red-500 hover:text-white hover:border-white"
                        }`}
                        title={story.visibility === 'PUBLIC' ? "Ẩn truyện" : "Hiện truyện"}
                      >
                        {story.visibility === 'PUBLIC' ? <Eye className="h-3 w-3" strokeWidth={1.5} /> : <EyeOff className="h-3 w-3" strokeWidth={1.5} />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1">
                    <Link href={`/admin/stories/${story.id}`}>
                      <h3 className="text-lg font-medium text-zinc-100 group-hover:text-white transition-colors line-clamp-2 leading-tight hover:underline">
                        {story.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-zinc-600 font-mono mt-2 truncate uppercase">
                      TÁC GIẢ // {story.author?.pen_name || "KHÔNG RÕ"}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 mt-6 pt-4 border-t border-zinc-900 font-mono text-[10px] uppercase tracking-widest">
                    
                    <div className="flex items-center gap-1.5">
                      {story.status === 'COMPLETED' ? (
                        <><CheckCircle className="w-3 h-3 text-white" strokeWidth={2} /> <span className="text-zinc-300">Hoàn Thành</span></>
                      ) : (
                        <><Clock className="w-3 h-3 text-zinc-500" strokeWidth={2} /> <span className="text-zinc-500">Đang Ra</span></>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {story.approval_status === 'APPROVED' ? (
                        <><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> <span className="text-green-500">ĐÃ DUYỆT</span></>
                      ) : story.approval_status === 'REJECTED' ? (
                        <><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> <span className="text-red-500">TỪ CHỐI</span></>
                      ) : (
                        <><div className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> <span className="text-yellow-500">CHỜ DUYỆT</span></>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      {story.visibility === 'PUBLIC' ? (
                        <><div className="w-1.5 h-1.5 rounded-full bg-white" /> <span className="text-zinc-300">CÔNG KHAI</span></>
                      ) : (
                        <><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> <span className="text-red-500">BỊ ẨN</span></>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {!isLoading && (!data?.stories || data.stories.length === 0) && (
              <div className="col-span-full py-24 flex flex-col items-center justify-center bg-black">
                <ShieldAlert className="h-8 w-8 text-zinc-800 mb-4" strokeWidth={1} />
                <p className="text-zinc-500 font-mono uppercase tracking-widest text-sm">Không tìm thấy truyện nào.</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
      
      {/* Pagination */}
      <div className="flex justify-between items-center pt-8 border-t border-zinc-900 font-mono">
        <p className="text-xs text-zinc-600 uppercase tracking-widest hidden sm:block">
          Hiển thị trang <span className="text-white">{data?.page || 1}</span> trên {data?.total_pages || 1}
        </p>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            disabled={page === 1} 
            onClick={() => setPage(p => p - 1)}
            className="h-8 px-4 rounded-none text-xs uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-zinc-900 border border-transparent transition-colors disabled:opacity-30"
          >
            Trước
          </Button>
          <div className="w-px h-4 bg-zinc-800 mx-2" />
          <Button 
            variant="ghost" 
            size="sm" 
            disabled={page >= (data?.total_pages || 1)} 
            onClick={() => setPage(p => p + 1)}
            className="h-8 px-4 rounded-none text-xs uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-zinc-900 border border-transparent transition-colors disabled:opacity-30"
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  );
}
