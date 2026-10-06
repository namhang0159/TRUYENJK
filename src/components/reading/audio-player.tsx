"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAudioStore } from "@/store/audio-store";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  X,
  Rewind,
  FastForward,
  Headphones,
  Loader2,
  VolumeX,
  RefreshCw,
  Clock,
  Music,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AudioSettingsModal } from "./audio-settings-modal";
import { useUpsertHistory } from "@/hooks/use-stories";
import { useBgmTracks } from "@/hooks/use-bgm";
import axiosInstance from "@/lib/axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";

// Danh sách URL fallback nếu chưa tải xong DB
const FALLBACK_BGM_URLS: Record<string, string> = {
  landinhtu: "/audio/bgm/lan-dinh-tu.mp3",
  ancient: "https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3",
  rain: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3",
  lofi: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
  campfire: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3",
  zen: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_6b7a6023cb.mp3",
  ocean: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c350014399.mp3",
};

// Hàm format thời gian mm:ss
const formatTime = (time: number) => {
  if (isNaN(time) || !Number.isFinite(time)) return "00:00";
  const m = Math.floor(time / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
};

// Format đếm ngược hẹn giờ
const formatCountdown = (totalSeconds: number) => {
  if (totalSeconds <= 0) return "00:00";
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
};

export function AudioPlayer({
  storyId,
  chapterId,
  chapterTitle,
  initialProgress = 0,
}: {
  storyId: string | number;
  chapterId: string | number;
  chapterTitle: string;
  initialProgress?: number;
}) {
  const {
    isOpen,
    setIsOpen,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    speed,
    volume,
    bgMusic,
    bgVolume,
    sleepTimerMode,
    remainingSeconds,
    tickSleepTimer,
    clearSleepTimer,
  } = useAudioStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const { isAuthenticated } = useAuth();

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioStatus, setAudioStatus] = useState<
    "IDLE" | "READY" | "NOT_FOUND" | "LIMIT_REACHED" | "ERROR"
  >("IDLE");
  const [isCheckingAudio, setIsCheckingAudio] = useState(false);
  const [showNoAudioDialog, setShowNoAudioDialog] = useState(false);
  const [noAudioMessage, setNoAudioMessage] = useState("");

  // Đổi chương -> reset trạng thái
  useEffect(() => {
    setAudioUrl(null);
    setAudioStatus("IDLE");
    setIsReady(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsOpen(false);
    setShowNoAudioDialog(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, [chapterId, setIsOpen, setIsPlaying, setCurrentTime, setDuration]);

  // Xử lý kiểm tra và phát Audio
  const handleCheckAndPlayAudio = useCallback(async () => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    if (audioStatus === "READY" && audioUrl) {
      setIsOpen(true);
      setIsPlaying(true);
      return;
    }

    if (
      audioStatus === "NOT_FOUND" ||
      audioStatus === "LIMIT_REACHED" ||
      audioStatus === "ERROR"
    ) {
      setShowNoAudioDialog(true);
      return;
    }

    setIsCheckingAudio(true);
    try {
      const { data } = await axiosInstance.post(
        `/audio/chapters/${chapterId}/audio`,
        { voice_id: 1 }
      );

      if (data.data?.status === "READY" && data.data?.url) {
        setAudioUrl(data.data.url);
        setAudioStatus("READY");
        setIsOpen(true);
        setIsPlaying(true);
      } else {
        setIsOpen(false);
        setAudioStatus("NOT_FOUND");
        setNoAudioMessage(
          `Bản thu Audio cho chương "${chapterTitle}" hiện chưa sẵn sàng. Bạn vui lòng quay lại sau hoặc thưởng thức bản chữ nhé!`
        );
        setShowNoAudioDialog(true);
      }
    } catch (error: any) {
      console.error("Audio check error:", error);
      setIsOpen(false);

      if (error.response?.status === 404) {
        setAudioStatus("NOT_FOUND");
        const serverMsg = error.response?.data?.message?.replace(
          /^not found:?\s*/i,
          ""
        );
        setNoAudioMessage(
          serverMsg ||
          `Chương "${chapterTitle}" hiện chưa có bản thu Audio. Ban biên tập đang cập nhật, bạn vui lòng quay lại sau hoặc đọc truyện bằng bản chữ nhé!`
        );
        setShowNoAudioDialog(true);
      } else if (error.response?.status === 403) {
        setAudioStatus("LIMIT_REACHED");
        const limitMsg =
          error.response?.data?.message ||
          "Bạn đã hết lượt nghe miễn phí hôm nay. Hãy nâng cấp gói VIP để nghe không giới hạn!";
        setNoAudioMessage(limitMsg);
        setShowNoAudioDialog(true);
      } else {
        setAudioStatus("ERROR");
        setNoAudioMessage(
          `Không thể tải bản thu Audio cho chương "${chapterTitle}". Vui lòng thử lại sau!`
        );
        setShowNoAudioDialog(true);
      }
    } finally {
      setIsCheckingAudio(false);
    }
  }, [
    isAuthenticated,
    audioStatus,
    audioUrl,
    chapterId,
    chapterTitle,
    setIsOpen,
    setIsPlaying,
  ]);

  // Khởi tạo Audio chính
  useEffect(() => {
    if (isOpen && audioUrl && audioStatus === "READY" && !audioRef.current) {
      const audio = new Audio(audioUrl);

      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration);
        if (initialProgress > 0) {
          audio.currentTime = initialProgress;
          setCurrentTime(initialProgress);
        }
        setIsReady(true);
      });

      audio.addEventListener("timeupdate", () => {
        setCurrentTime(audio.currentTime);
      });

      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        // Xử lý chế độ hẹn giờ "Dừng khi hết chương"
        if (useAudioStore.getState().sleepTimerMode === "END_OF_CHAPTER") {
          useAudioStore.getState().clearSleepTimer();
        }
        const event = new CustomEvent("audioEnded", { detail: { chapterId } });
        window.dispatchEvent(event);
      });

      audioRef.current = audio;
    }

    // Khởi tạo Background Music Audio
    if (isOpen && !bgAudioRef.current) {
      const bg = new Audio();
      bg.loop = true;
      bgAudioRef.current = bg;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
        bgAudioRef.current = null;
      }
      setIsPlaying(false);
      setIsReady(false);
    };
  }, [
    isOpen,
    audioUrl,
    audioStatus,
    initialProgress,
    chapterId,
    setCurrentTime,
    setDuration,
    setIsPlaying,
  ]);

  const { data: dbTracks = [] } = useBgmTracks();

  // Nạp nguồn Nhạc Nền (BGM)
  useEffect(() => {
    if (!bgAudioRef.current) return;

    if (bgMusic === "none") {
      bgAudioRef.current.pause();
      bgAudioRef.current.src = "";
    } else {
      const foundTrack = dbTracks.find(
        (t) => t.key === bgMusic || String(t.id) === bgMusic
      );
      let targetUrl = foundTrack?.audio_url || FALLBACK_BGM_URLS[bgMusic] || "";

      // Nếu url là đường dẫn upload local /uploads/ -> gắn host backend
      if (targetUrl.startsWith("/uploads/")) {
        const backendBase = (
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
        ).replace(/\/api\/v1\/?$/, "");
        targetUrl = `${backendBase}${targetUrl}`;
      }

      if (bgAudioRef.current.src !== targetUrl && targetUrl) {
        bgAudioRef.current.src = targetUrl;
        bgAudioRef.current.load();
      }
      if (isPlaying && targetUrl) {
        bgAudioRef.current
          .play()
          .catch((e) => console.warn("Bg music play failed", e));
      }
    }
  }, [bgMusic, isPlaying, dbTracks]);

  // Điều khiển âm lượng và Fade-out trong 5 giây cuối trước khi hết giờ
  useEffect(() => {
    let effectiveVoiceVolume = volume;
    let effectiveBgVolume = bgVolume;

    if (
      sleepTimerMode === "MINUTES" &&
      remainingSeconds > 0 &&
      remainingSeconds <= 5
    ) {
      // Fade-out nhẹ nhàng trong 5s cuối
      const fadeFactor = remainingSeconds / 5;
      effectiveVoiceVolume = volume * fadeFactor;
      effectiveBgVolume = bgVolume * fadeFactor;
    }

    if (audioRef.current) audioRef.current.volume = Math.max(0, Math.min(1, effectiveVoiceVolume));
    if (bgAudioRef.current) bgAudioRef.current.volume = Math.max(0, Math.min(1, effectiveBgVolume));
  }, [volume, bgVolume, remainingSeconds, sleepTimerMode]);

  // Điều khiển Play / Pause
  useEffect(() => {
    if (isReady && audioRef.current) {
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((e) => console.warn("Audio play err:", e));
        if (bgMusic !== "none" && bgAudioRef.current) {
          bgAudioRef.current
            .play()
            .catch((e) => console.warn("Bg play err:", e));
        }
      } else {
        audioRef.current.pause();
        if (bgAudioRef.current) {
          bgAudioRef.current.pause();
        }
      }
    }
  }, [isPlaying, isReady, bgMusic]);

  // Điều khiển Speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  // Live Countdown Timer (mỗi 1 giây gọi tickSleepTimer)
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && sleepTimerMode === "MINUTES") {
      interval = setInterval(() => {
        const isExpired = tickSleepTimer();
        if (isExpired) {
          if (audioRef.current) audioRef.current.pause();
          if (bgAudioRef.current) bgAudioRef.current.pause();
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, sleepTimerMode, tickSleepTimer]);

  // Đồng bộ lịch sử nghe định kỳ mỗi 10 giây
  const { mutate: upsertHistory } = useUpsertHistory();
  useEffect(() => {
    let syncInterval: NodeJS.Timeout;

    if (isPlaying && isAuthenticated) {
      syncInterval = setInterval(() => {
        upsertHistory({
          story_id: storyId,
          chapter_id: chapterId,
          progress_seconds: Math.floor(currentTime),
        });
      }, 10000);
    }

    return () => clearInterval(syncInterval);
  }, [
    isPlaying,
    isAuthenticated,
    currentTime,
    chapterId,
    storyId,
    upsertHistory,
  ]);

  return (
    <>
      {/* Nút Nổi góc màn hình nếu Player đang ĐÓNG */}
      {!isOpen && (
        <Button
          onClick={handleCheckAndPlayAudio}
          disabled={isCheckingAudio}
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl z-50 animate-bounce hover:animate-none bg-primary text-primary-foreground flex items-center justify-center cursor-pointer transition-all duration-200"
          title="Nghe Audio chương này"
        >
          {isCheckingAudio ? (
            <Loader2 className="w-6 h-6 animate-spin text-primary-foreground" />
          ) : (
            <Headphones className="w-6 h-6" />
          )}
        </Button>
      )}

      {/* Giao diện Trình phát Audio khi MỞ */}
      {isOpen && audioStatus === "READY" && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 text-foreground backdrop-blur-xl border-t border-border shadow-[0_-10px_30px_rgba(0,0,0,0.12)] z-50 p-3 md:p-4 transform transition-transform duration-300">
          <div className="container max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-3 md:gap-8">
            {/* Info */}
            <div className="flex-1 w-full flex items-center justify-between md:justify-start gap-2">
              <div className="truncate">
                <div className="text-[11px] text-primary font-semibold tracking-wider uppercase mb-0.5 flex items-center gap-2">
                  <span>Đang phát Audio</span>
                  {sleepTimerMode === "MINUTES" && remainingSeconds > 0 && (
                    <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono animate-pulse">
                      <Clock className="w-3 h-3" /> {formatCountdown(remainingSeconds)}
                    </span>
                  )}
                  {sleepTimerMode === "END_OF_CHAPTER" && (
                    <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-[10px]">
                      <Clock className="w-3 h-3" /> Hết chương tắt
                    </span>
                  )}
                  {bgMusic !== "none" && (
                    <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px]">
                      <Music className="w-3 h-3" />{" "}
                      {dbTracks.find((t) => t.key === bgMusic || String(t.id) === bgMusic)?.title || "Nhạc nền"}
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-xs md:text-sm truncate text-foreground">
                  {chapterTitle}
                </h4>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setIsPlaying(false);
                  setIsOpen(false);
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Controls & Progress */}
            <div className="flex-2 w-full flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    if (audioRef.current) {
                      try {
                        const curr = Number(audioRef.current.currentTime);
                        if (Number.isFinite(curr)) {
                          audioRef.current.currentTime = Math.max(0, curr - 10);
                        }
                      } catch (e) {
                        console.error(e);
                      }
                    }
                  }}
                  title="Lùi 10 giây"
                >
                  <Rewind className="w-5 h-5" />
                </Button>
                <Button
                  size="icon"
                  className="w-11 h-11 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => setIsPlaying(!isPlaying)}
                  disabled={!isReady}
                >
                  {!isReady ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    if (audioRef.current) {
                      try {
                        const curr = Number(audioRef.current.currentTime);
                        const dur = Number(audioRef.current.duration);
                        if (Number.isFinite(curr)) {
                          const maxTime = Number.isFinite(dur)
                            ? dur
                            : Number.MAX_VALUE;
                          audioRef.current.currentTime = Math.min(
                            maxTime,
                            curr + 10
                          );
                        }
                      } catch (e) {
                        console.error(e);
                      }
                    }
                  }}
                  title="Tua 10 giây"
                >
                  <FastForward className="w-5 h-5" />
                </Button>
              </div>

              <div className="w-full flex items-center gap-3">
                <span className="text-[11px] font-mono text-muted-foreground w-10 text-right">
                  {formatTime(currentTime)}
                </span>
                <Slider
                  value={[Number.isFinite(currentTime) ? currentTime : 0]}
                  max={
                    Number.isFinite(duration) && duration > 0
                      ? duration
                      : 100
                  }
                  step={1}
                  onValueChange={(val) => {
                    const newTime = Number(
                      Array.isArray(val) ? val[0] : val
                    );
                    if (Number.isFinite(newTime)) {
                      if (audioRef.current) {
                        try {
                          audioRef.current.currentTime = newTime;
                        } catch (e) {
                          console.error("Seek err:", e);
                        }
                      }
                      setCurrentTime(newTime);
                    }
                  }}
                  className="flex-1"
                />
                <span className="text-[11px] font-mono text-muted-foreground w-10">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Options */}
            <div className="flex-1 w-full flex justify-center md:justify-end items-center gap-2">
              <AudioSettingsModal />
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setIsPlaying(false);
                  setIsOpen(false);
                }}
                title="Đóng trình phát"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog Thông Báo Khi Không Có Audio Hoặc Hết Lượt */}
      <Dialog open={showNoAudioDialog} onOpenChange={setShowNoAudioDialog}>
        <DialogContent className="sm:max-w-md bg-background border border-border text-foreground rounded-xl p-6 shadow-2xl">
          <DialogHeader className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto sm:mx-0">
              <VolumeX className="w-6 h-6" />
            </div>
            <DialogTitle className="text-xl font-semibold text-foreground">
              {audioStatus === "LIMIT_REACHED"
                ? "Hết Lượt Nghe Miễn Phí"
                : "Chưa Có Bản Thu Audio"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
              {noAudioMessage ||
                `Chương "${chapterTitle}" hiện chưa có bản thu Audio sẵn sàng. Bạn vui lòng quay lại sau hoặc thưởng thức truyện bằng bản chữ nhé!`}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 mt-2 border-t border-border flex flex-col sm:flex-row gap-2 sm:justify-end">
            {audioStatus === "LIMIT_REACHED" && (
              <Link href="/profile/wallet">
                <Button className="w-full sm:w-auto bg-amber-500 text-black hover:bg-amber-400 font-medium text-sm px-4">
                  Nâng Cấp VIP
                </Button>
              </Link>
            )}
            {(audioStatus === "ERROR" || audioStatus === "NOT_FOUND") && (
              <Button
                variant="ghost"
                onClick={() => {
                  setShowNoAudioDialog(false);
                  setAudioStatus("IDLE");
                  setTimeout(() => {
                    handleCheckAndPlayAudio();
                  }, 150);
                }}
                className="w-full sm:w-auto text-muted-foreground hover:text-foreground text-sm flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" /> Thử lại
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setShowNoAudioDialog(false)}
              className="w-full sm:w-auto border-border text-foreground hover:bg-muted font-medium text-sm px-6"
            >
              Đã hiểu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
