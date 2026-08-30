"use client";

import { useAudioStore } from "@/store/audio-store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Volume2, Music, Clock } from "lucide-react";

export function AudioSettingsModal() {
  const {
    speed, setSpeed,
    voice, setVoice,
    volume, setVolume,
    bgMusic, setBgMusic,
    bgVolume, setBgVolume,
    sleepTimer, setSleepTimer
  } = useAudioStore();

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" />}>
        <Settings className="w-5 h-5" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cài Đặt Audio</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          
          {/* Tốc độ & Giọng đọc */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Tốc độ đọc</label>
              <Select value={speed.toString()} onValueChange={(v) => setSpeed(parseFloat(v || "1"))}>
                <SelectTrigger>
                  <SelectValue placeholder="Speed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.85">0.85x (Chậm)</SelectItem>
                  <SelectItem value="1">1.0x (Bình thường)</SelectItem>
                  <SelectItem value="1.25">1.25x (Nhanh)</SelectItem>
                  <SelectItem value="1.5">1.5x (Rất nhanh)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Giọng đọc</label>
              <Select value={voice} onValueChange={(v: "nam"|"nu"|null) => v && setVoice(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Voice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nam">Nam Truyền Cảm</SelectItem>
                  <SelectItem value="nu">Nữ Trầm Ấm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Nhạc nền & Hẹn giờ */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none flex items-center gap-2">
                <Music className="w-4 h-4" /> Nhạc nền
              </label>
              <Select value={bgMusic} onValueChange={(v: any) => setBgMusic(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Background Music" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không có</SelectItem>
                  <SelectItem value="rain">Tiếng mưa rơi</SelectItem>
                  <SelectItem value="lofi">Nhạc Lo-Fi</SelectItem>
                  <SelectItem value="zen">Nhạc Thiền (Zen)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none flex items-center gap-2">
                <Clock className="w-4 h-4" /> Hẹn giờ tắt
              </label>
              <Select 
                value={sleepTimer ? sleepTimer.toString() : "none"} 
                onValueChange={(v) => setSleepTimer(v === "none" || !v ? null : parseInt(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sleep timer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tắt</SelectItem>
                  <SelectItem value="15">15 phút</SelectItem>
                  <SelectItem value="30">30 phút</SelectItem>
                  <SelectItem value="45">45 phút</SelectItem>
                  <SelectItem value="60">60 phút</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Âm lượng Giọng Đọc */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-primary" /> Âm lượng giọng đọc
              </label>
              <span className="text-xs text-muted-foreground">{Math.round(volume * 100)}%</span>
            </div>
            <Slider 
              value={[volume]} 
              min={0} 
              max={1} 
              step={0.05} 
              onValueChange={(val) => {
                const newVal = Array.isArray(val) ? val[0] : val;
                setVolume(newVal ?? 1);
              }}
            />
          </div>

          {/* Âm lượng Nhạc Nền */}
          {bgMusic !== "none" && (
            <div className="space-y-3 pt-2 border-t mt-4">
              <div className="flex items-center justify-between mt-4">
                <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <Music className="w-4 h-4" /> Âm lượng nhạc nền
                </label>
                <span className="text-xs text-muted-foreground">{Math.round(bgVolume * 100)}%</span>
              </div>
              <Slider 
                value={[bgVolume]} 
                min={0} 
                max={1} 
                step={0.05} 
                onValueChange={(val) => {
                  const newVal = Array.isArray(val) ? val[0] : val;
                  setBgVolume(newVal ?? 0.5);
                }}
              />
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}
