import { create } from "zustand"

export const useStore = create((set) => ({
  waterLevel: 0.9,
  waveSpeed: 1.2,
  waveAmplitude: 0.1,
  foamDepth: 0.05,
  audioEnabled: false,

  setAudioEnabled: (enabled) => set(() => ({ audioEnabled: enabled }))
}))
