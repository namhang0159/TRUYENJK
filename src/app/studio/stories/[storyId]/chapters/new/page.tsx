"use client";

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { TiptapEditor } from '@/components/studio/editor';
import { CalendarIcon, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCreateChapter } from '@/hooks/use-author';

const chapterSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tên chương"),
  content: z.string().min(20, "Nội dung chương quá ngắn"),
  status: z.enum(["DRAFT", "PUBLISHED", "PENDING"]),
  type: z.enum(["FREE", "VIP"]),
  coinPrice: z.number().min(0).optional(),
  publishAt: z.date().optional(),
}).superRefine((data, ctx) => {
  if (data.type === "VIP" && (!data.coinPrice || data.coinPrice <= 0)) {
    ctx.addIssue({
      path: ["coinPrice"],
      message: "Chương VIP phải có giá Coin lớn hơn 0",
      code: z.ZodIssueCode.custom,
    });
  }
});

type ChapterFormValues = z.infer<typeof chapterSchema>;

export default function NewChapterPage() {
  const params = useParams();
  const storyId = params.storyId as string;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ChapterFormValues>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      status: "DRAFT",
      type: "FREE",
      content: "",
      coinPrice: 0,
    },
  });

  const watchType = watch("type");
  const router = useRouter();
  const { mutateAsync: createChapter } = useCreateChapter();

  const onSubmit = async (data: ChapterFormValues) => {
    try {
      const slug = data.title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
      const payload = {
        story_id: Number(storyId),
        chapter_number: 1, // Tạm thời hardcode 1, thực tế cần query max chapter_number
        title: data.title,
        slug: slug,
        text_content: data.content,
        type: data.type,
        coin_price: data.coinPrice || 0,
        status: data.status,
      };
      
      await createChapter(payload);
      alert("Tạo chương thành công!");
      router.push(`/studio/stories`);
    } catch (error: any) {
      console.error(error);
      alert("Lỗi: " + (error.message || "Không thể tạo chương"));
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4 border-b border-zinc-900 pb-4">
        <Link href={`/studio/stories/${storyId}/chapters`}>
          <Button variant="ghost" size="icon" className="rounded-none hover:bg-zinc-900 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-light tracking-tight text-white">Thêm chương mới</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" {...register("status")} />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card className="rounded-none bg-black border-zinc-900">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Tên chương (VD: Chương 1: Khởi đầu)</Label>
                  <Input 
                    id="title" 
                    placeholder="Nhập tên chương..." 
                    className="rounded-none border-zinc-800 bg-zinc-950 focus-visible:ring-0 focus-visible:border-zinc-500 font-mono text-lg py-6"
                    {...register("title")} 
                  />
                  {errors.title && <p className="text-[10px] font-mono text-red-500 uppercase">{errors.title.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Nội dung chương</Label>
                  <div className="border border-zinc-800 bg-zinc-950/50">
                    <Controller
                      name="content"
                      control={control}
                      render={({ field }) => (
                        <TiptapEditor 
                          content={field.value} 
                          onChange={field.onChange} 
                        />
                      )}
                    />
                  </div>
                  {errors.content && <p className="text-[10px] font-mono text-red-500 uppercase">{errors.content.message}</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-none bg-black border-zinc-900">
              <CardHeader>
                <CardTitle className="font-light">Cài đặt Chương</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Loại chương</Label>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        className="flex flex-col space-y-3 mt-2"
                      >
                        <div className="flex items-center space-x-2 border border-zinc-800 p-3 bg-zinc-950/50 hover:border-zinc-600 transition-colors cursor-pointer">
                          <RadioGroupItem value="FREE" id="free" className="border-zinc-600 text-zinc-300" />
                          <Label htmlFor="free" className="font-mono text-xs uppercase tracking-widest text-zinc-300 cursor-pointer">Miễn phí (FREE)</Label>
                        </div>
                        <div className="flex items-center space-x-2 border border-amber-500/20 p-3 bg-amber-500/5 hover:border-amber-500/50 transition-colors cursor-pointer">
                          <RadioGroupItem value="VIP" id="vip" className="border-amber-500 text-amber-500" />
                          <Label htmlFor="vip" className="font-mono text-xs uppercase tracking-widest text-amber-500 cursor-pointer flex items-center gap-1">
                            Trình đọc VIP
                          </Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                </div>

                {watchType === "VIP" && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Label htmlFor="coinPrice" className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Giá Coin</Label>
                    <Input 
                      id="coinPrice" 
                      type="number" 
                      placeholder="VD: 100" 
                      className="rounded-none border-zinc-800 bg-zinc-950 focus-visible:ring-0 focus-visible:border-amber-500 font-mono text-amber-500"
                      {...register("coinPrice", { valueAsNumber: true })} 
                    />
                    {errors.coinPrice && <p className="text-[10px] font-mono text-red-500 uppercase">{errors.coinPrice.message}</p>}
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Hẹn giờ xuất bản (Tùy chọn)</Label>
                  <Controller
                    name="publishAt"
                    control={control}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger render={
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-mono text-xs rounded-none border-zinc-800 bg-zinc-950 hover:bg-zinc-900 hover:text-white ${!field.value && "text-zinc-500"}`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP", { locale: vi }) : <span className="uppercase tracking-widest">Chọn ngày xuất bản</span>}
                          </Button>
                        } />
                        <PopoverContent className="w-auto p-0 rounded-none border-zinc-800 bg-black" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            className="bg-black text-white"
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-3 pt-4 border-t border-zinc-900">
                  <Button 
                    type="submit" 
                    variant="outline"
                    className="w-full rounded-none border-emerald-500/50 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black font-mono text-xs uppercase tracking-widest transition-colors h-12" 
                    disabled={isSubmitting}
                    onClick={() => setValue("status", "PUBLISHED")}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Xuất bản ngay
                  </Button>
                  <Button 
                    type="submit" 
                    variant="outline" 
                    className="w-full rounded-none border-zinc-800 text-zinc-400 bg-transparent hover:bg-zinc-900 hover:text-white font-mono text-[10px] uppercase tracking-widest transition-colors" 
                    disabled={isSubmitting}
                    onClick={() => setValue("status", "DRAFT")}
                  >
                    Lưu bản nháp
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
