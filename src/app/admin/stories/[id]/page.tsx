"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShieldAlert, CheckCircle, XCircle, ChevronLeft, Eye, EyeOff, FileText, Lock, Unlock, Users, DollarSign, Edit } from 'lucide-react';
import { useAdminStoryDetail, useAdminToggleChapterLock, useAdminUpdateStory } from '@/hooks/use-admin';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { getImageUrl } from '@/lib/utils';

export default function AdminStoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const storyId = Number(params.id);

  const { data, isLoading } = useAdminStoryDetail(storyId);
  const { mutate: toggleLock, isPending: isToggling } = useAdminToggleChapterLock();
  const { mutate: updateStory, isPending: isUpdating } = useAdminUpdateStory();

  const [editTitle, setEditTitle] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [editCoverImage, setEditCoverImage] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleOpenEdit = () => {
    if (data?.story) {
      setEditTitle(data.story.title || '');
      setEditSummary(data.story.summary || '');
      setEditCoverImage(data.story.cover_image || '');
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveEdit = () => {
    updateStory({
      id: storyId,
      payload: {
        title: editTitle,
        summary: editSummary,
        cover_image: editCoverImage,
      }
    }, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
      }
    });
  };

  const handleToggleLock = (chapterId: number) => {
    if (confirm('Bạn có chắc muốn Khóa / Mở khóa chương này?')) {
      toggleLock({ storyId, chapterId });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32 bg-zinc-900 rounded-none mb-6" />
        <Skeleton className="h-40 w-full bg-zinc-900 rounded-none" />
        <Skeleton className="h-64 w-full bg-zinc-900 rounded-none mt-8" />
      </div>
    );
  }

  if (!data?.story) {
    return (
      <div className="py-24 flex flex-col items-center justify-center bg-black border border-zinc-900">
        <ShieldAlert className="h-8 w-8 text-zinc-800 mb-4" strokeWidth={1} />
        <p className="text-zinc-500 font-mono uppercase tracking-widest text-sm">Không tìm thấy truyện.</p>
        <Button onClick={() => router.push('/admin/stories')} variant="outline" className="mt-6 rounded-none border-zinc-800 text-white">
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const { story, revenue } = data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-8 bg-black border border-zinc-900 p-6">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={() => router.push('/admin/stories')} className="text-zinc-500 hover:text-white rounded-none border border-transparent hover:border-zinc-800">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-light tracking-tight text-white mb-2">{story.title}</h1>
              <div className="flex items-center gap-4 text-zinc-500 font-mono text-sm uppercase tracking-widest">
                <span>ID: {story.id}</span>
                <span>|</span>
                <span>Tác giả: {story.author?.pen_name || "Không rõ"}</span>
              </div>
            </div>
            <div className="ml-auto">
              <Button onClick={handleOpenEdit} variant="outline" className="rounded-none border-zinc-800 bg-transparent text-white hover:bg-zinc-900 h-10">
                <Edit className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </Button>
            </div>
          </div>
          <div className="text-zinc-400 mt-4 leading-relaxed whitespace-pre-wrap line-clamp-4">
            {story.summary ? story.summary : <span className="italic text-zinc-600">Chưa có mô tả truyện...</span>}
          </div>
        </div>
        {story.cover_image && (
          <div className="w-48 h-64 shrink-0 overflow-hidden border border-zinc-800">
            <img src={getImageUrl(story.cover_image)} alt={story.title} className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-black border border-zinc-800 text-zinc-100 sm:max-w-[600px] rounded-none p-0 overflow-hidden">
          <div className="p-6 border-b border-zinc-800">
            <DialogTitle className="text-xl font-light tracking-tight text-white">Chỉnh Sửa Thông Tin Truyện</DialogTitle>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-zinc-400 font-mono text-[10px] uppercase tracking-widest">Tên Truyện</Label>
              <Input
                id="title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="rounded-none border-zinc-800 bg-zinc-950 text-white focus-visible:ring-1 focus-visible:ring-zinc-700 h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cover" className="text-zinc-400 font-mono text-[10px] uppercase tracking-widest">Ảnh Bìa (URL)</Label>
              <Input
                id="cover"
                value={editCoverImage}
                onChange={(e) => setEditCoverImage(e.target.value)}
                className="rounded-none border-zinc-800 bg-zinc-950 text-white focus-visible:ring-1 focus-visible:ring-zinc-700 h-12"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc" className="text-zinc-400 font-mono text-[10px] uppercase tracking-widest">Mô Tả</Label>
              <Textarea
                id="desc"
                value={editSummary}
                onChange={(e) => setEditSummary(e.target.value)}
                rows={6}
                className="rounded-none border-zinc-800 bg-zinc-950 text-white focus-visible:ring-1 focus-visible:ring-zinc-700 resize-none"
              />
            </div>
          </div>
          <div className="p-4 border-t border-zinc-800 flex justify-end gap-2 bg-zinc-950/50">
            <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)} className="rounded-none text-zinc-400 hover:text-white hover:bg-zinc-900">
              Hủy
            </Button>
            <Button onClick={handleSaveEdit} disabled={isUpdating} className="rounded-none bg-white text-black hover:bg-zinc-200">
              {isUpdating ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-black border border-zinc-900 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Tổng lượt đọc</span>
            <Eye className="text-blue-500 h-4 w-4" />
          </div>
          <div className="text-2xl font-light text-white font-mono">{story.view_count.toLocaleString()}</div>
        </div>
        
        <div className="bg-black border border-zinc-900 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Số chương</span>
            <FileText className="text-zinc-400 h-4 w-4" />
          </div>
          <div className="text-2xl font-light text-white font-mono">{story.chapters?.length || 0}</div>
        </div>

        <div className="bg-black border border-zinc-900 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Doanh thu ước tính</span>
            <DollarSign className="text-green-500 h-4 w-4" />
          </div>
          <div className="text-2xl font-light text-green-400 font-mono">{revenue.toLocaleString()} <span className="text-xs opacity-50">VNĐ</span></div>
        </div>

        <div className="bg-black border border-zinc-900 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Đánh giá</span>
            <Users className="text-purple-500 h-4 w-4" />
          </div>
          <div className="text-2xl font-light text-white font-mono">{Number(story.rating || 0).toFixed(1)} <span className="text-xs text-zinc-500">/ 5.0</span></div>
        </div>
      </div>

      {/* Chapters List */}
      <div>
        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          Danh Sách Chương
        </h3>
        <div className="bg-black border border-zinc-900">
          {story.chapters && story.chapters.length > 0 ? (
            <div className="divide-y divide-zinc-900">
              {story.chapters.map((chapter: any) => (
                <div key={chapter.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between group hover:bg-zinc-950 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-1">
                      <span>CH. {chapter.chapter_number}</span>
                      <span>|</span>
                      <span>{chapter.type === 'VIP' ? 'VIP' : 'FREE'}</span>
                      {chapter.type === 'VIP' && (
                        <>
                          <span>|</span>
                          <span className="text-yellow-500">{chapter.coin_price} XU</span>
                        </>
                      )}
                    </div>
                    <h4 className="text-zinc-100 font-medium group-hover:text-white transition-colors">{chapter.title}</h4>
                    <div className="text-xs text-zinc-600 font-mono mt-1">
                      Cập nhật: {format(new Date(chapter.created_at), 'dd/MM/yyyy HH:mm', { locale: vi })}
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex items-center gap-3">
                    <span className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 border ${
                      chapter.status === 'PUBLISHED' ? 'border-green-500/30 text-green-500' :
                      chapter.status === 'PENDING' ? 'border-yellow-500/30 text-yellow-500' :
                      'border-red-500/30 text-red-500'
                    }`}>
                      {chapter.status}
                    </span>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleToggleLock(chapter.id)}
                      disabled={isToggling}
                      className={`h-8 rounded-none font-mono text-xs uppercase ${
                        chapter.status === 'PUBLISHED' 
                          ? 'border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white' 
                          : 'border-green-500/30 text-green-500 hover:bg-green-500 hover:text-white'
                      }`}
                    >
                      {chapter.status === 'PUBLISHED' ? <><Lock className="w-3 h-3 mr-2" /> Khóa</> : <><Unlock className="w-3 h-3 mr-2" /> Mở Khóa</>}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-zinc-500 font-mono text-sm uppercase">Truyện chưa có chương nào</div>
          )}
        </div>
      </div>
    </div>
  );
}
