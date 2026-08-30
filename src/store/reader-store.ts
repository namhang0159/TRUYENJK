import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeType = "light" | "dark" | "sepia";
export type FontFamily = "sans" | "serif" | "outfit";
export type LineHeight = "tight" | "normal" | "relaxed";

interface ReaderState {
  theme: ThemeType;
  fontSize: number;
  fontFamily: FontFamily;
  lineHeight: LineHeight;
  setTheme: (theme: ThemeType) => void;
  setFontSize: (size: number) => void;
  setFontFamily: (font: FontFamily) => void;
  setLineHeight: (height: LineHeight) => void;
}

export const useReaderStore = create<ReaderState>()(
  persist(
    (set) => ({
      theme: "dark",
      fontSize: 20,
      fontFamily: "sans",
      lineHeight: "relaxed",
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setLineHeight: (lineHeight) => set({ lineHeight }),
    }),
    {
      name: "reader-settings",
    }
  )
);
