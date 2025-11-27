import { AudioLinks } from "@/util";
import { create } from "zustand";

type AudioState = {
  isAudioPlaying: boolean;
  setIsAudioPlaying: (value: boolean) => void;
  audio: string;
  resetAudio: () => void;
};

export const useAudio = create<AudioState>((set) => ({
  isAudioPlaying: false,
  setIsAudioPlaying: (value: boolean) => set({ isAudioPlaying: value }),
  audio: AudioLinks[Math.floor(Math.random() * 4)],
  resetAudio: () => set({ audio: AudioLinks[Math.floor(Math.random() * 4)] }),
}));
