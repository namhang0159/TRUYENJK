"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Upload, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCreateStory } from '@/hooks/use-author';
import { MultiSelect } from "@/components/ui/multi-select";
import { useCategories } from "@/hooks/use-stories";

const storySchema = z.object({
  title: z.string().min(3, "Tên truyện phải từ 3 ký tự trở lên"),
  description: z.string().min(10, "Mô tả truyện quá ngắn"),
  categories: z.array(z.string()).min(1, "Vui lòng chọn ít nhất 1 thể loại"),
  status: z.enum(["ONGOING", "COMPLETED", "PAUSED"]).default("ONGOING"),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).default("PRIVATE"),
});

type StoryFormValues = z.infer<typeof storySchema>;

export default function NewStoryPage() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();
  const { mutateAsync: createStory } = useCreateStory();
  const { data: categoriesData } = useCategories();
  const categoryOptions = categoriesData?.map((cat: any) => ({ label: cat.name, value: cat.id.toString() })) || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StoryFormValues>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      status: "ONGOING",
      visibility: "PRIVATE",
      categories: [],
    },
  });

  const onSubmit = async (data: StoryFormValues) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      
      // Tạo slug đơn giản (trong thực tế nên dùng thư viện tạo slug chuẩn)
      const slug = data.title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
      formData.append('slug', slug);
      formData.append('summary', data.description);
      formData.append('categories', JSON.stringify(data.categories));
      
      if (selectedFile) {
        formData.append('cover_image', selectedFile);
      }
      
      await createStory(formData);
      alert("Tạo truyện thành công!");
      router.push('/studio/stories');
    } catch (error: any) {
      console.error(error);
      alert("Lỗi: " + (error.message || "Không thể tạo truyện"));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
        <h1 className="text-3xl font-light tracking-tight text-white">Tạo truyện mới</h1>
        <Link href="/studio/stories">
          <Button variant="outline" className="rounded-none border-zinc-800 bg-transparent font-mono text-[10px] uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-900">
            Hủy
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
              <Card className="rounded-none bg-black border-zinc-900">
              <CardHeader>
                <CardTitle className="font-light">Thông tin cơ bản</CardTitle>
                <CardDescription className="font-mono text-[10px] uppercase tracking-widest">Nhập các thông tin chính cho bộ truyện của bạn.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Tên truyện</Label>
                  <Input 
                    id="title" 
                    placeholder="VD: Hệ thống tu tiên vô địch" 
                    className="rounded-none border-zinc-800 bg-zinc-950 focus-visible:ring-0 focus-visible:border-zinc-500 font-mono"
                    {...register("title")} 
                  />
                  {errors.title && <p className="text-[10px] font-mono text-red-500 uppercase">{errors.title.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Mô tả truyện (Tóm tắt)</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Viết một đoạn giới thiệu hấp dẫn..." 
                    className="h-32 rounded-none border-zinc-800 bg-zinc-950 focus-visible:ring-0 focus-visible:border-zinc-500 font-mono"
                    {...register("description")} 
                  />
                  {errors.description && <p className="text-[10px] font-mono text-red-500 uppercase">{errors.description.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categories" className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Thể loại</Label>
                  <div className="[&>div]:rounded-none [&>div]:border-zinc-800 [&>div]:bg-zinc-950">
                    <MultiSelect
                      options={categoryOptions}
                      selected={watch("categories") || []}
                      onChange={(val) => setValue("categories", val, { shouldValidate: true })}
                      placeholder="Chọn thể loại..."
                    />
                  </div>
                  {errors.categories && <p className="text-[10px] font-mono text-red-500 uppercase">{errors.categories.message}</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-none bg-black border-zinc-900">
              <CardHeader>
                <CardTitle className="font-light">Ảnh bìa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center justify-center border border-zinc-800 bg-zinc-950 p-4 text-center relative h-64 overflow-hidden group hover:border-zinc-500 transition-colors cursor-pointer">
                  {previewImage ? (
                    <img src={previewImage} alt="Cover Preview" className="object-cover w-full h-full absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-500" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <ImageIcon className="h-10 w-10 text-zinc-700 mb-2" strokeWidth={1} />
                      <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Kéo thả ảnh hoặc click để tải lên</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    onChange={handleImageChange}
                  />
                </div>
                {previewImage && (
                  <Button type="button" variant="outline" className="w-full rounded-none border-zinc-800 bg-transparent text-red-500 hover:bg-red-500 hover:text-white font-mono text-[10px] uppercase tracking-widest transition-colors" onClick={() => setPreviewImage(null)}>
                    Xóa ảnh
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-none bg-black border-zinc-900">
              <CardHeader>
                <CardTitle className="font-light">Trạng thái xuất bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Trạng thái</Label>
                  <Select 
                    defaultValue="ONGOING" 
                    onValueChange={(val) => setValue("status", val as any)}
                  >
                    <SelectTrigger className="rounded-none border-zinc-800 bg-zinc-950 font-mono">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-zinc-800 bg-black">
                      <SelectItem value="ONGOING" className="font-mono text-xs">Đang ra</SelectItem>
                      <SelectItem value="COMPLETED" className="font-mono text-xs">Hoàn thành</SelectItem>
                      <SelectItem value="PAUSED" className="font-mono text-xs">Tạm ngưng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Hiển thị</Label>
                  <Select 
                    defaultValue="PRIVATE" 
                    onValueChange={(val) => setValue("visibility", val as any)}
                  >
                    <SelectTrigger className="rounded-none border-zinc-800 bg-zinc-950 font-mono">
                      <SelectValue placeholder="Chọn quyền hiển thị" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-zinc-800 bg-black">
                      <SelectItem value="PUBLIC" className="font-mono text-xs">Công khai</SelectItem>
                      <SelectItem value="PRIVATE" className="font-mono text-xs">Riêng tư</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" variant="outline" className="w-full mt-4 rounded-none border-zinc-800 bg-transparent hover:bg-white hover:text-black font-mono text-xs uppercase tracking-widest transition-colors h-12" disabled={isSubmitting}>
                  <Upload className="mr-2 h-4 w-4" />
                  Lưu Truyện Mới
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
