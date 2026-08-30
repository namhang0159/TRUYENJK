import { create } from "zustand";

interface AudioState {
  isOpen: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  speed: number;
  voice: "nam" | "nu";
  volume: number; // Voice volume
  bgMusic: "none" | "rain" | "lofi" | "zen";
  bgVolume: number;
  sleepTimer: number | null; // in minutes
  chapterId: string | null;
  
  toggleOpen: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setSpeed: (speed: number) => void;
  setVoice: (voice: "nam" | "nu") => void;
  setVolume: (volume: number) => void;
  setBgMusic: (music: "none" | "rain" | "lofi" | "zen") => void;
  setBgVolume: (volume: number) => void;
  setSleepTimer: (timer: number | null) => void;
  setChapterId: (chapterId: string) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  isOpen: false,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  speed: 1,
  voice: "nam",
  volume: 1, // 100%
  bgMusic: "none",
  bgVolume: 0.5, // 50%
  sleepTimer: null,
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
  setSleepTimer: (sleepTimer) => set({ sleepTimer }),
  setChapterId: (chapterId) => set({ chapterId }),
}));
