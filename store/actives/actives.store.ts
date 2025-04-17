import { create } from 'zustand';

interface ActiveState {
    searchActive: boolean;
    setSearchActive: (searchActive: boolean) => void;
}

const useActiveStore = create<ActiveState>((set) => ({
    searchActive: false,
    setSearchActive: (searchActive: boolean) => set({searchActive}),
}));

export default useActiveStore;