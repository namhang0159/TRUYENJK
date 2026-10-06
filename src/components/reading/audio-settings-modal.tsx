"use client";

import React, { useState } from "react";
import { useAudioStore } from "@/store/audio-store";
import { useBgmTracks, BgmTrack } from "@/hooks/use-bgm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings2,
  Volume2,
  Music2,
  Clock3,
  SlidersHorizontal,
  Flame,
  CloudRain,
  Waves,
  Coffee,
  Sparkles,
  Check,
  Disc3,
  User,
  Gauge,
  TimerReset,
  Plus,
  Ban,
  Headphones,
} from "lucide-react";

const ICONS_MAP: Record<string, any> = {
  Music2,
  Sparkles,
  CloudRain,
  Coffee,
  Flame,
  Disc3,
  Waves,
  Headphones,
  Ban,
};

const COLOR_MAP: Record<string, string> = {
  purple: "text-purple-500 border-purple-500/30 bg-purple-500/10",
  amber: "text-amber-500 border-amber-500/30 bg-amber-500/10",
  blue: "text-blue-500 border-blue-500/30 bg-blue-500/10",
  rose: "text-rose-500 border-rose-500/30 bg-rose-500/10",
  orange: "text-orange-500 border-orange-500/30 bg-orange-500/10",
  emerald: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10",
  cyan: "text-cyan-500 border-cyan-500/30 bg-cyan-500/10",
};

export function AudioSettingsModal() {
  const {
    speed,
    setSpeed,
    voice,
    setVoice,
    volume,
    setVolume,
    bgMusic,
    setBgMusic,
    bgVolume,
    setBgVolume,
    sleepTimerMode,
    remainingSeconds,
    startSleepTimer,
    setStopAtChapterEnd,
    clearSleepTimer,
  } = useAudioStore();

  const { data: dbTracks = [] } = useBgmTracks();
  const [activeTab, setActiveTab] = useState("bgm");

  // Format đếm ngược mm:ss hoặc hh:mm:ss
  const formatCountdown = (totalSeconds: number) => {
    if (totalSeconds <= 0) return "00:00";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Danh mục BGM hoàn chỉnh (thêm mục Không dùng nhạc nền ở đầu)
  const allTracks = [
    {
      id: 0,
      key: "none",
      title: "Không dùng nhạc nền",
      description: "Chỉ nghe giọng đọc thuần túy",
      genre: "Tắt",
      icon_name: "Ban",
      color: "text-muted-foreground border-border bg-muted/30",
    },
    ...dbTracks,
  ];

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground relative group"
            title="Cài đặt Audio & Nhạc nền"
          />
        }
      >
        <Settings2 className="w-5 h-5 transition-transform group-hover:rotate-45" />
        {sleepTimerMode && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[540px] bg-background text-foreground border-border shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border bg-muted/40">
          <div className="flex items-center justify-between pr-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-foreground tracking-tight">
                  Studio Âm Thanh Audio
                </DialogTitle>
                <p className="text-xs text-muted-foreground">
                  Tùy chỉnh giọng đọc, nhạc nền thể loại & hẹn giờ tắt
                </p>
              </div>
            </div>
            {sleepTimerMode === "MINUTES" && remainingSeconds > 0 && (
              <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono text-xs flex items-center gap-1.5 animate-pulse">
                <Clock3 className="w-3.5 h-3.5" />
                <span>{formatCountdown(remainingSeconds)}</span>
              </div>
            )}
            {sleepTimerMode === "END_OF_CHAPTER" && (
              <div className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 font-mono text-xs flex items-center gap-1.5">
                <Clock3 className="w-3.5 h-3.5" />
                <span>Hết chương</span>
              </div>
            )}
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 pt-3 bg-muted/20 border-b border-border">
            <TabsList className="grid grid-cols-4 bg-muted border border-border p-1 rounded-lg">
              <TabsTrigger
                value="bgm"
                className="text-xs data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex items-center gap-1.5 py-1.5"
              >
                <Music2 className="w-3.5 h-3.5" /> Nhạc nền
              </TabsTrigger>
              <TabsTrigger
                value="timer"
                className="text-xs data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex items-center gap-1.5 py-1.5"
              >
                <Clock3 className="w-3.5 h-3.5" /> Hẹn giờ
              </TabsTrigger>
              <TabsTrigger
                value="voice"
                className="text-xs data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex items-center gap-1.5 py-1.5"
              >
                <User className="w-3.5 h-3.5" /> Giọng đọc
              </TabsTrigger>
              <TabsTrigger
                value="mixer"
                className="text-xs data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex items-center gap-1.5 py-1.5"
              >
                <Volume2 className="w-3.5 h-3.5" /> Bộ trộn
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6 max-h-[420px] overflow-y-auto space-y-6 custom-scrollbar">
            {/* TAB 1: NHẠC NỀN THỂ LOẠI */}
            <TabsContent value="bgm" className="m-0 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Music2 className="w-4 h-4 text-primary" /> Không Gian Nhạc Nền
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Chọn âm thanh môi trường hòa quyện cùng cốt truyện
                  </p>
                </div>
                {bgMusic !== "none" && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-primary/30 bg-primary/10 text-primary">
                    Đang kích hoạt
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {allTracks.map((track) => {
                  const Icon = ICONS_MAP[track.icon_name] || Music2;
                  const isSelected = bgMusic === track.key;
                  const colorClass =
                    track.key === "none"
                      ? "text-muted-foreground border-border bg-muted/30"
                      : COLOR_MAP[track.color] || COLOR_MAP.amber;

                  return (
                    <button
                      key={track.key}
                      onClick={() => setBgMusic(track.key as any)}
                      className={`text-left p-3 rounded-xl border transition-all flex items-start gap-3 relative cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(var(--primary-rgb),0.12)] ring-1 ring-primary"
                          : "border-border bg-card hover:bg-muted/60"
                      }`}
                    >
                      <div className={`p-2 rounded-lg border ${colorClass}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-semibold text-foreground truncate">
                            {track.title}
                          </h5>
                        </div>
                        <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                          {track.description}
                        </p>
                        <span className="inline-block mt-1.5 text-[9px] font-medium text-muted-foreground/80 uppercase tracking-wider">
                          {track.genre}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-3 right-3 text-primary">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Slider Âm lượng Nhạc nền nếu đang chọn bài */}
              {bgMusic !== "none" && (
                <div className="p-3.5 rounded-xl border border-border bg-muted/40 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground flex items-center gap-2">
                      <Volume2 className="w-3.5 h-3.5 text-primary" /> Âm lượng nhạc nền
                    </span>
                    <span className="font-mono text-primary font-semibold">
                      {Math.round(bgVolume * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[bgVolume]}
                    min={0.05}
                    max={1}
                    step={0.05}
                    onValueChange={(val) => {
                      const v = Array.isArray(val) ? val[0] : val;
                      setBgVolume(v ?? 0.35);
                    }}
                  />
                  <p className="text-[10px] text-muted-foreground italic">
                    * Khuyên dùng mức 25% - 40% để âm thanh nền nhẹ nhàng, không lấn át giọng đọc.
                  </p>
                </div>
              )}
            </TabsContent>

            {/* TAB 2: HẸN GIỜ TẮT & LIVE COUNTDOWN */}
            <TabsContent value="timer" className="m-0 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Clock3 className="w-4 h-4 text-emerald-500" /> Hẹn Giờ Tắt Thông Minh
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Tự động giảm dần âm lượng (Fade-out) trước khi tắt để bạn ngủ ngon
                  </p>
                </div>
              </div>

              {/* Box hiển thị đồng hồ đếm ngược nếu đang kích hoạt */}
              {sleepTimerMode ? (
                <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-center space-y-3 animate-in zoom-in-95">
                  <div className="text-[11px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
                    {sleepTimerMode === "END_OF_CHAPTER"
                      ? "Tự động tắt khi phát hết chương này"
                      : "Thời gian còn lại trước khi tắt"}
                  </div>
                  {sleepTimerMode === "MINUTES" && (
                    <div className="text-4xl font-mono font-bold text-foreground tracking-wider flex items-center justify-center gap-2">
                      <Clock3 className="w-7 h-7 text-emerald-500 animate-pulse" />
                      {formatCountdown(remainingSeconds)}
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-2 pt-1">
                    {sleepTimerMode === "MINUTES" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const currentMin = Math.ceil(remainingSeconds / 60);
                          startSleepTimer(currentMin + 15);
                        }}
                        className="h-8 text-xs border-emerald-500/40 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/20"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> +15 Phút
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={clearSleepTimer}
                      className="h-8 text-xs bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 hover:bg-red-500/25"
                    >
                      <TimerReset className="w-3.5 h-3.5 mr-1" /> Tắt hẹn giờ
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-border bg-muted/30 text-center text-xs text-muted-foreground">
                  Chưa cài đặt hẹn giờ tắt. Hãy chọn thời gian bạn muốn dừng phát:
                </div>
              )}

              {/* Các mốc hẹn giờ nhanh */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-semibold text-foreground">
                  Chọn thời gian hẹn giờ:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[15, 30, 45, 60, 90, 120].map((mins) => (
                    <Button
                      key={mins}
                      variant="outline"
                      onClick={() => startSleepTimer(mins)}
                      className="border-border bg-card hover:bg-muted text-xs py-4 font-mono hover:text-emerald-500 hover:border-emerald-500/40 transition-colors"
                    >
                      {mins} phút
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={setStopAtChapterEnd}
                  className="w-full mt-2 border-border bg-card hover:bg-muted text-xs py-4 text-blue-600 dark:text-blue-400 hover:border-blue-500/40 hover:text-blue-500 transition-colors"
                >
                  📖 Dừng khi phát hết chương này
                </Button>
              </div>
            </TabsContent>

            {/* TAB 3: GIỌNG ĐỌC & TỐC ĐỘ */}
            <TabsContent value="voice" className="m-0 space-y-5">
              <div className="space-y-3">
                <label className="text-xs font-semibold text-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> Chọn Giọng Đọc
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setVoice("nam")}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                      voice === "nam"
                        ? "border-primary bg-primary/10 ring-1 ring-primary"
                        : "border-border bg-card hover:bg-muted/60"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-xs">
                      ♂
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-foreground">Nam Truyền Cảm</h5>
                      <p className="text-[10px] text-muted-foreground">Trầm ấm, nội lực, phong thái</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setVoice("nu")}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                      voice === "nu"
                        ? "border-primary bg-primary/10 ring-1 ring-primary"
                        : "border-border bg-card hover:bg-muted/60"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-500 flex items-center justify-center font-bold text-xs">
                      ♀
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-foreground">Nữ Dịu Dàng</h5>
                      <p className="text-[10px] text-muted-foreground">Truyền cảm, êm ái, rõ lời</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Tốc độ đọc */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-amber-500" /> Tốc Độ Đọc
                  </label>
                  <span className="text-xs font-mono font-bold text-amber-500">
                    {speed}x {speed === 1 ? "(Chuẩn)" : ""}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                    <Button
                      key={rate}
                      size="sm"
                      variant={speed === rate ? "default" : "outline"}
                      onClick={() => setSpeed(rate)}
                      className={`text-xs font-mono ${
                        speed === rate ? "bg-amber-500 hover:bg-amber-600 text-black font-bold" : "border-border bg-card"
                      }`}
                    >
                      {rate}x
                    </Button>
                  ))}
                </div>
                <Slider
                  value={[speed]}
                  min={0.75}
                  max={2.0}
                  step={0.05}
                  onValueChange={(val) => {
                    const v = Array.isArray(val) ? val[0] : val;
                    setSpeed(v ?? 1);
                  }}
                  className="mt-2"
                />
              </div>
            </TabsContent>

            {/* TAB 4: BỘ TRỘN ÂM MIXER KÉP */}
            <TabsContent value="mixer" className="m-0 space-y-5">
              <div>
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-primary" /> Bộ Trộn Âm Kép (Dual Mixer)
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Cân bằng âm lượng giữa Giọng đọc và Nhạc nền để có trải nghiệm đọc tuyệt hảo
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-primary" /> Âm lượng Giọng Đọc
                    </span>
                    <span className="font-mono text-primary font-bold">
                      {Math.round(volume * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[volume]}
                    min={0}
                    max={1}
                    step={0.05}
                    onValueChange={(val) => {
                      const v = Array.isArray(val) ? val[0] : val;
                      setVolume(v ?? 1);
                    }}
                  />
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground flex items-center gap-2">
                      <Music2 className="w-4 h-4 text-amber-500" /> Âm lượng Nhạc Nền (BGM)
                    </span>
                    <span className="font-mono text-amber-500 font-bold">
                      {Math.round(bgVolume * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[bgVolume]}
                    min={0}
                    max={1}
                    step={0.05}
                    onValueChange={(val) => {
                      const v = Array.isArray(val) ? val[0] : val;
                      setBgVolume(v ?? 0.35);
                    }}
                  />
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
