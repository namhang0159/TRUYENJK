import { create } from "zustand";

export type BgMusicType = "none" | "ancient" | "rain" | "lofi" | "campfire" | "zen" | "ocean";
export type SleepTimerMode = "MINUTES" | "END_OF_CHAPTER" | null;

interface AudioState {
  isOpen: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  speed: number;
  voice: "nam" | "nu";
  volume: number; // Voice volume (0 - 1)
  bgMusic: BgMusicType;
  bgVolume: number; // BGM volume (0 - 1)
  sleepTimer: number | null; // in minutes (15, 30, 45, 60, 90...)
  sleepTimerMode: SleepTimerMode;
  sleepTimerEndTime: number | null; // Timestamp (ms)
  remainingSeconds: number; // Seconds left for countdown display
  chapterId: string | null;

  toggleOpen: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setSpeed: (speed: number) => void;
  setVoice: (voice: "nam" | "nu") => void;
  setVolume: (volume: number) => void;
  setBgMusic: (music: BgMusicType) => void;
  setBgVolume: (volume: number) => void;
  setSleepTimer: (timer: number | null) => void;
  startSleepTimer: (minutes: number) => void;
  setStopAtChapterEnd: () => void;
  clearSleepTimer: () => void;
  setRemainingSeconds: (seconds: number) => void;
  tickSleepTimer: () => boolean; // Returns true if timer just expired
  setChapterId: (chapterId: string) => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  isOpen: false,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  speed: 1,
  voice: "nam",
  volume: 1, // 100%
  bgMusic: "none",
  bgVolume: 0.35, // 35% mặc định vừa tai
  sleepTimer: null,
  sleepTimerMode: null,
  sleepTimerEndTime: null,
  remainingSeconds: 0,
  chapterId: null,

  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  setIsOpen: (isOpen) => set({ isOpen }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setSpeed: (speed) => set({ speed }),
  setVoice: (voice) => set({ voice }),
  setVolume: (volume) => set({ volume }),
  setBgMusic: (bgMusic) => set({ bgMusic }),
  setBgVolume: (bgVolume) => set({ bgVolume }),

  setSleepTimer: (sleepTimer) => {
    if (!sleepTimer) {
      set({ sleepTimer: null, sleepTimerMode: null, sleepTimerEndTime: null, remainingSeconds: 0 });
    } else {
      const endTime = Date.now() + sleepTimer * 60 * 1000;
      set({
        sleepTimer,
        sleepTimerMode: "MINUTES",
        sleepTimerEndTime: endTime,
        remainingSeconds: sleepTimer * 60
      });
    }
  },

  startSleepTimer: (minutes: number) => {
    const endTime = Date.now() + minutes * 60 * 1000;
    set({
      sleepTimer: minutes,
      sleepTimerMode: "MINUTES",
      sleepTimerEndTime: endTime,
      remainingSeconds: minutes * 60,
    });
  },

  setStopAtChapterEnd: () => {
    set({
      sleepTimer: null,
      sleepTimerMode: "END_OF_CHAPTER",
      sleepTimerEndTime: null,
      remainingSeconds: 0,
    });
  },

  clearSleepTimer: () => {
    set({
      sleepTimer: null,
      sleepTimerMode: null,
      sleepTimerEndTime: null,
      remainingSeconds: 0,
    });
  },

  setRemainingSeconds: (remainingSeconds) => set({ remainingSeconds }),

  tickSleepTimer: () => {
    const { sleepTimerEndTime, sleepTimerMode } = get();
    if (sleepTimerMode !== "MINUTES" || !sleepTimerEndTime) return false;

    const diff = Math.max(0, Math.round((sleepTimerEndTime - Date.now()) / 1000));
    set({ remainingSeconds: diff });

    if (diff <= 0) {
      set({
        isPlaying: false,
        sleepTimer: null,
        sleepTimerMode: null,
        sleepTimerEndTime: null,
        remainingSeconds: 0,
      });
      return true; // Expired
    }
    return false;
  },

  setChapterId: (chapterId) => set({ chapterId }),
}));
