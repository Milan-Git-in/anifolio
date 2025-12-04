import { create } from "zustand";

type isRevealedState = {
  isRevealed: boolean;
  setIsRevealed: (arg: boolean) => void;
};
export const useRevealed = create<isRevealedState>((set) => ({
  isRevealed: false,
  setIsRevealed: (value: boolean) => set({ isRevealed: value }),
}));
