import {create} from 'zustand';

interface InternetState {
    online: boolean | null;
    setOnline: (online: boolean | null) => void;
}

const useInternetStore = create<InternetState>((set) => ({
    online: true,
    setOnline: (online: boolean | null) => set({ online: online }),
}));

export default useInternetStore;