import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeType = "light" | "dark" | "sepia";
export type FontFamily = "sans" | "serif" | "outfit";
export type LineHeight = "tight" | "normal" | "relaxed";
export type ContainerWidth = "sm" | "md" | "lg" | "xl";

interface ReaderState {
  theme: ThemeType;
  fontSize: number;
  fontFamily: FontFamily;
  lineHeight: LineHeight;
  maxWidth: ContainerWidth;
  setTheme: (theme: ThemeType) => void;
  setFontSize: (size: number) => void;
  setFontFamily: (font: FontFamily) => void;
  setLineHeight: (height: LineHeight) => void;
  setMaxWidth: (width: ContainerWidth) => void;
}

export const useReaderStore = create<ReaderState>()(
  persist(
    (set) => ({
      theme: "dark",
      fontSize: 20,
      fontFamily: "sans",
      lineHeight: "relaxed",
      maxWidth: "md",
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setLineHeight: (lineHeight) => set({ lineHeight }),
      setMaxWidth: (maxWidth) => set({ maxWidth }),
    }),
    {
      name: "reader-settings",
    }
  )
);
