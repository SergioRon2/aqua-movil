import { create } from "zustand";

interface StylesState {
    globalColor: string;
    setGlobalColor: (globalColor: string) => void;
}

const useStylesStore = create<StylesState>((set) => ({
    globalColor: "#db2777",
    setGlobalColor: (globalColor: string) => set({ globalColor: globalColor }),
}));

export default useStylesStore;
