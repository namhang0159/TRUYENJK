"use client";

import { useEffect, useRef, useState } from "react";
import { useAudioStore } from "@/store/audio-store";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, X, Rewind, FastForward, Headphones, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AudioSettingsModal } from "./audio-settings-modal";
import { useUpsertHistory } from "@/hooks/use-stories";
import axiosInstance from "@/lib/axios";

// Hàm format thời gian mm:ss
const formatTime = (time: number) => {
  if (isNaN(time)) return "00:00";
  const m = Math.floor(time / 60).toString().padStart(2, '0');
  const s = Math.floor(time % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export function AudioPlayer({ storyId, chapterId, chapterTitle, initialProgress = 0 }: { storyId: string | number, chapterId: string | number; chapterTitle: string, initialProgress?: number }) {
  const { 
    isOpen, toggleOpen, setIsOpen,
    isPlaying, setIsPlaying,
    currentTime, setCurrentTime,
    duration, setDuration,
    speed, setSpeed,
    voice, setVoice,
    volume,
    bgMusic, bgVolume,
    sleepTimer
  } = useAudioStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const { isAuthenticated } = useAuth(); // Kiểm tra user đăng nhập
  
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioStatus, setAudioStatus] = useState<"IDLE" | "LOADING" | "PROCESSING" | "READY" | "ERROR" | "NOT_FOUND">("IDLE");

  // Sleep timer ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch audio url when player opens
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isOpen && audioStatus !== "READY" && audioStatus !== "ERROR" && audioStatus !== "NOT_FOUND") {
      const fetchAudio = async () => {
        if (audioStatus === "IDLE") setAudioStatus("LOADING");
        try {
          const { data } = await axiosInstance.post(`/audio/chapters/${chapterId}/audio`, { voice_id: 1 });
          if (data.data?.status === "READY") {
            setAudioUrl(data.data.url);
            setAudioStatus("READY");
          } else {
            setAudioStatus("PROCESSING");
          }
        } catch (error: any) {
          console.error("Audio fetch error:", error);
          if (error.response?.status === 404) {
            setAudioStatus("NOT_FOUND");
          } else {
            setAudioStatus("ERROR");
          }
        }
      };

      fetchAudio();

      if (audioStatus === "PROCESSING" || audioStatus === "LOADING") {
        interval = setInterval(fetchAudio, 3000);
      }
    }
    
    return () => clearInterval(interval);
  }, [isOpen, chapterId, audioStatus]);

  // Khởi tạo Audio khi Mở Player
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
        // Logic auto-next chương tại đây (Dispatch sự kiện)
        const event = new CustomEvent('audioEnded', { detail: { chapterId } });
        window.dispatchEvent(event);
      });

      audioRef.current = audio;
    }

    // Khởi tạo Background Music Audio
    if (isOpen && !bgAudioRef.current) {
      bgAudioRef.current = new Audio();
      bgAudioRef.current.loop = true;
    }

    return () => {
      // Cleanup nếu Component unmount hoàn toàn
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
  }, [isOpen, audioUrl, audioStatus]);

  // Handle Chapter change
  useEffect(() => {
    setAudioUrl(null);
    setAudioStatus("IDLE");
    setIsReady(false);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, [chapterId]);

  // Handle Background Music source
  useEffect(() => {
    if (!bgAudioRef.current) return;
    
    if (bgMusic === "none") {
      bgAudioRef.current.pause();
      bgAudioRef.current.src = "";
    } else {
      // Mock URLs for background music
      const urls: Record<string, string> = {
        rain: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3", // Rain
        lofi: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3", // Lofi
        zen: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_6b7a6023cb.mp3"  // Zen
      };
      
      const wasPlaying = !bgAudioRef.current.paused;
      bgAudioRef.current.src = urls[bgMusic] || "";
      if (isPlaying) {
        bgAudioRef.current.play().catch(e => console.warn("Bg music play failed", e));
      }
    }
  }, [bgMusic]);

  // Handle Volumes
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (bgAudioRef.current) bgAudioRef.current.volume = bgVolume;
  }, [bgVolume]);

  // Điều khiển Play/Pause
  useEffect(() => {
    if (isReady) {
      if (isPlaying) {
        audioRef.current?.play();
        if (bgMusic !== "none") bgAudioRef.current?.play();
      } else {
        audioRef.current?.pause();
        bgAudioRef.current?.pause();
      }
    }
  }, [isPlaying, isReady, bgMusic]);

  // Điều khiển Speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  // Hẹn giờ tắt (Sleep Timer)
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    
    if (sleepTimer && isPlaying) {
      // sleepTimer tính bằng phút -> đổi ra ms
      timerRef.current = setTimeout(() => {
        setIsPlaying(false); // Dừng cả 2 khi hết giờ
        console.log(`[Sleep Timer] Đã tắt sau ${sleepTimer} phút`);
      }, sleepTimer * 60 * 1000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [sleepTimer, isPlaying]);

  // ĐỒNG BỘ 10s MỘT LẦN KHI PLAYING (CHỈ GUEST ĐÃ ĐĂNG NHẬP)
  const { mutate: upsertHistory } = useUpsertHistory();

  useEffect(() => {
    let syncInterval: NodeJS.Timeout;
    
    if (isPlaying && isAuthenticated) {
      syncInterval = setInterval(() => {
        console.log(`[Sync API] Đang đồng bộ tiến độ: ${Math.floor(currentTime)}s cho chương ${chapterId}`);
        upsertHistory({
          story_id: storyId,
          chapter_id: chapterId,
          progress_seconds: Math.floor(currentTime)
        });
      }, 10000); // 10 giây
    }

    return () => clearInterval(syncInterval);
  }, [isPlaying, isAuthenticated, currentTime, chapterId, storyId, upsertHistory]);

  // Nút Nổi góc màn hình nếu Player đang ĐÓNG
  if (!isOpen) {
    return (
      <Button 
        onClick={() => {
          if (!isAuthenticated) {
            window.location.href = "/login";
            return;
          }
          toggleOpen();
        }}
        size="icon" 
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl z-50 animate-bounce hover:animate-none bg-primary text-primary-foreground"
      >
        <Headphones className="w-6 h-6" />
      </Button>
    );
  }

  // Giao diện Trình phát Audio khi MỞ
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 p-4 transform transition-transform duration-300">
      <div className="container max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-4 md:gap-8">
        
        {/* Info */}
        <div className="flex-1 w-full flex items-center justify-between md:justify-start">
          <div className="truncate">
            <p className="text-xs text-primary font-semibold tracking-wider uppercase mb-1">
              {audioStatus === "LOADING" ? "Đang tải Audio..." : 
               audioStatus === "PROCESSING" ? "Đang tạo Audio..." : 
               audioStatus === "ERROR" ? "Lỗi tải Audio" : 
               audioStatus === "NOT_FOUND" ? "Chưa có Audio" :
               "Đang phát Audio"}
            </p>
            <h4 className="font-bold text-sm md:text-base truncate">{chapterTitle}</h4>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Controls */}
        <div className="flex-2 w-full flex flex-col items-center gap-2">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => {
              if (audioRef.current) {
                try {
                  const curr = Number(audioRef.current.currentTime);
                  if (Number.isFinite(curr)) {
                    audioRef.current.currentTime = Math.max(0, curr - 10);
                  }
                } catch (e) { console.error(e); }
              }
            }}>
              <Rewind className="w-5 h-5" />
            </Button>
            <Button 
              size="icon" 
              className="w-12 h-12 rounded-full shadow-md"
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={!isReady || audioStatus !== "READY"}
            >
              {!isReady || audioStatus !== "READY" ? (audioStatus === "NOT_FOUND" ? <Play className="w-5 h-5 ml-1 opacity-50" /> : <Loader2 className="w-5 h-5 animate-spin" />) :
               isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => {
              if (audioRef.current) {
                try {
                  const curr = Number(audioRef.current.currentTime);
                  const dur = Number(audioRef.current.duration);
                  if (Number.isFinite(curr)) {
                    const maxTime = Number.isFinite(dur) ? dur : Number.MAX_VALUE;
                    audioRef.current.currentTime = Math.min(maxTime, curr + 10);
                  }
                } catch (e) { console.error(e); }
              }
            }}>
              <FastForward className="w-5 h-5" />
            </Button>
          </div>
          <div className="w-full flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-10 text-right">{formatTime(currentTime)}</span>
            <Slider 
              value={[Number.isFinite(currentTime) ? currentTime : 0]} 
              max={Number.isFinite(duration) && duration > 0 ? duration : 100} 
              step={1} 
              onValueChange={(val) => {
                const newTime = Number(val[0]);
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
            <span className="text-xs text-muted-foreground w-10">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Options */}
        <div className="flex-1 w-full flex justify-center md:justify-end items-center gap-2">
          <AudioSettingsModal />
          <Button variant="ghost" size="icon" className="hidden md:flex text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

      </div>
    </div>
  );
}
