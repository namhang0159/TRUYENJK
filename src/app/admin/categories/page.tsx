"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Hash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAdminCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/use-admin';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminCategoriesPage() {
  const { data: categories, isLoading } = useAdminCategories();
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '' });

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '' });
  };

  const handleSelectEdit = (category: any) => {
    setEditingId(category.id);
    setFormData({ name: category.name || '', slug: category.slug || '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateCategory({ id: editingId, ...formData }, { onSuccess: handleOpenNew });
    } else {
      createCategory(formData, { onSuccess: handleOpenNew });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("THỰC THI LỆNH XÓA? Dữ liệu thể loại này sẽ bị xóa vĩnh viễn.")) {
      deleteCategory(id);
      if (editingId === id) handleOpenNew();
    }
  };

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-zinc-900">
        <div>
          <h1 className="text-4xl md:text-6xl font-outfit font-medium tracking-tight text-white mb-2 uppercase">
            Thể Loại Truyện
          </h1>
          <p className="text-zinc-500 font-mono text-sm tracking-wide uppercase">
            Cấu Trúc Phân Loại // Phân Loại Nội Dung
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Left Column: Data Table */}
        <div className="lg:col-span-2 relative z-10 bg-zinc-900 border border-zinc-900 self-start">
          <div className="grid grid-cols-12 gap-[1px] bg-zinc-900 border-b border-zinc-900">
              <div className="col-span-1 bg-black p-4 text-[10px] font-mono text-zinc-600 tracking-widest uppercase">ID</div>
              <div className="col-span-5 bg-black p-4 text-[10px] font-mono text-zinc-600 tracking-widest uppercase">Tên Thể Loại</div>
              <div className="col-span-4 bg-black p-4 text-[10px] font-mono text-zinc-600 tracking-widest uppercase">Đường Dẫn Tĩnh (Slug)</div>
              <div className="col-span-2 bg-black p-4 text-[10px] font-mono text-zinc-600 tracking-widest uppercase text-right">Thao Tác</div>
          </div>

          {isLoading ? (
            <div className="space-y-[1px] bg-zinc-900">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-none bg-black" />
              ))}
            </div>
          ) : (
            <div className="space-y-[1px] bg-zinc-900">
              <AnimatePresence>
                {categories?.map((category: any) => (
                  <div 
                    key={category.id}
                    className={`grid grid-cols-12 gap-[1px] bg-zinc-900 group cursor-pointer transition-colors ${editingId === category.id ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                    onClick={() => handleSelectEdit(category)}
                  >
                    <div className={`col-span-1 p-4 flex items-center transition-colors ${editingId === category.id ? 'bg-zinc-950' : 'bg-black group-hover:bg-zinc-950'}`}>
                      <span className="text-xs font-mono text-zinc-500">{category.id.toString().padStart(3, '0')}</span>
                    </div>
                    <div className={`col-span-5 p-4 flex flex-col justify-center transition-colors ${editingId === category.id ? 'bg-zinc-950' : 'bg-black group-hover:bg-zinc-950'}`}>
                       <span className="text-sm font-medium text-white transition-colors">{category.name}</span>
                    </div>
                    <div className={`col-span-4 p-4 flex items-center transition-colors ${editingId === category.id ? 'bg-zinc-950' : 'bg-black group-hover:bg-zinc-950'}`}>
                        <div className="flex items-center text-[10px] font-mono text-zinc-500 tracking-widest uppercase">
                        <Hash className="w-3 h-3 mr-2 text-zinc-700" /> {category.slug}
                        </div>
                    </div>
                    <div className={`col-span-2 p-4 flex items-center justify-end transition-colors ${editingId === category.id ? 'bg-zinc-950' : 'bg-black group-hover:bg-zinc-950'}`}>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => { e.stopPropagation(); handleDelete(category.id); }}
                        disabled={isDeleting}
                        className="h-8 w-8 rounded-none bg-transparent text-zinc-600 hover:text-white hover:bg-zinc-900 transition-all border border-transparent"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </AnimatePresence>
              {!isLoading && (!categories || categories.length === 0) && (
                <div className="col-span-12 py-24 flex flex-col items-center justify-center bg-black">
                  <Hash className="h-6 w-6 text-zinc-800 mb-4" />
                  <p className="text-zinc-600 font-mono text-[10px] tracking-widest uppercase">Không tìm thấy thể loại nào.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Editor Form */}
        <div className="lg:col-span-1 sticky top-8 self-start">
          <div className="bg-zinc-900 border border-zinc-900 flex flex-col">
            <div className="bg-black p-6 border-b border-zinc-900 flex justify-between items-center">
              <h3 className="text-lg font-outfit text-white tracking-tight uppercase">
                {editingId ? "Chỉnh Sửa Thể Loại" : "Thêm Thể Loại Mới"}
              </h3>
              {editingId && (
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleOpenNew}
                    className="h-8 rounded-none text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all font-mono text-[10px] tracking-widest uppercase"
                >
                    <Plus className="h-3 w-3 mr-2" /> THÊM MỚI
                </Button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 bg-black space-y-6">
              <div className="space-y-4">
                <Label htmlFor="name" className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">Tên Thể Loại</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="bg-zinc-950 border-zinc-900 h-12 rounded-none text-white placeholder:text-zinc-700 font-mono text-xs focus-visible:ring-0 focus-visible:border-white transition-colors"
                  placeholder="VD: KHOA HỌC VIỄN TƯỞNG"
                />
              </div>
              
              <div className="space-y-4">
                <Label htmlFor="slug" className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">Đường Dẫn Tĩnh (Slug)</Label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-700" />
                  <Input 
                    id="slug" 
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    required
                    className="bg-zinc-950 border-zinc-900 h-12 rounded-none text-white pl-10 placeholder:text-zinc-700 font-mono text-xs focus-visible:ring-0 focus-visible:border-white transition-colors"
                    placeholder="vd: khoa-hoc-vien-tuong"
                  />
                </div>
              </div>
              
              <div className="pt-8">
                <Button 
                    type="submit" 
                    disabled={isCreating || isUpdating} 
                    className="w-full h-12 rounded-none bg-white hover:bg-zinc-200 text-black font-mono text-[10px] tracking-widest uppercase"
                >
                  {editingId ? "LƯU THAY ĐỔI" : "TẠO MỚI"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
