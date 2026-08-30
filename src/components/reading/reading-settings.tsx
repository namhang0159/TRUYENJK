"use client";

import { useState, useEffect } from "react";

import { useReaderStore } from "@/store/reader-store";
import { Button, buttonVariants } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Settings2, Type, Baseline, PaintBucket } from "lucide-react";

export function ReadingSettings() {
  const { 
    theme, setTheme, 
    fontSize, setFontSize, 
    fontFamily, setFontFamily, 
    lineHeight, setLineHeight 
  } = useReaderStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
        <Settings2 className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger className={buttonVariants({ variant: "ghost", size: "icon" }) + " rounded-full hover:bg-muted"}>
        <Settings2 className="w-5 h-5" />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-4 space-y-6">
        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <PaintBucket className="w-4 h-4" /> Màu Nền
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              className={`bg-white text-black hover:bg-gray-100 ${theme === 'light' ? 'border-primary border-2' : ''}`}
              onClick={() => setTheme('light')}
            >
              Sáng
            </Button>
            <Button 
              variant="outline" 
              className={`bg-[#f4ecd8] text-[#5b4636] hover:bg-[#eaddc5] ${theme === 'sepia' ? 'border-primary border-2' : 'border-[#d3c6a6]'}`}
              onClick={() => setTheme('sepia')}
            >
              Giấy ố
            </Button>
            <Button 
              variant="outline" 
              className={`bg-gray-900 text-white hover:bg-gray-800 ${theme === 'dark' ? 'border-primary border-2' : ''}`}
              onClick={() => setTheme('dark')}
            >
              Tối
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Type className="w-4 h-4" /> Phông Chữ
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant={fontFamily === 'sans' ? 'default' : 'outline'}
              onClick={() => setFontFamily('sans')}
              className="font-sans"
            >
              Sans
            </Button>
            <Button 
              variant={fontFamily === 'serif' ? 'default' : 'outline'}
              onClick={() => setFontFamily('serif')}
              className="font-serif"
            >
              Serif
            </Button>
            <Button 
              variant={fontFamily === 'outfit' ? 'default' : 'outline'}
              onClick={() => setFontFamily('outfit')}
              className="font-[family-name:var(--font-outfit)]"
            >
              Outfit
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Type className="w-4 h-4" /> Cỡ Chữ
            </h4>
            <span className="text-xs text-muted-foreground">{fontSize}px</span>
          </div>
          <Slider 
            value={[fontSize || 20]} 
            min={14} 
            max={32} 
            step={1} 
            onValueChange={(val) => {
              const newSize = Array.isArray(val) ? val[0] : val;
              setFontSize(newSize || 20);
            }} 
          />
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Baseline className="w-4 h-4" /> Giãn Dòng
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant={lineHeight === 'tight' ? 'default' : 'outline'}
              onClick={() => setLineHeight('tight')}
            >
              Hẹp
            </Button>
            <Button 
              variant={lineHeight === 'normal' ? 'default' : 'outline'}
              onClick={() => setLineHeight('normal')}
            >
              Vừa
            </Button>
            <Button 
              variant={lineHeight === 'relaxed' ? 'default' : 'outline'}
              onClick={() => setLineHeight('relaxed')}
            >
              Rộng
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
