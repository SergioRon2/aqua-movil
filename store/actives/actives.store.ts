import { create } from 'zustand';

interface ActiveState {
    searchActive: boolean;
    municipioActivo: string | undefined;
    sectorialActivo: string | undefined;
    setSearchActive: (searchActive: boolean) => void;
    setMunicipioActivo: (municipioActivo: string | undefined) => void;
    setSectorialActivo: (sectorialActivo: string | undefined) => void;
}

const useActiveStore = create<ActiveState>((set) => ({
    searchActive: false,
    setSearchActive: (searchActive: boolean) => set({searchActive}),

    // estos solo son para el dashboard 
    municipioActivo: undefined,
    setMunicipioActivo: (municipioActivo: string | undefined) => set({municipioActivo}),
    
    sectorialActivo: undefined,
    setSectorialActivo: (sectorialActivo: string | undefined) => set({sectorialActivo}),
}));

export default useActiveStore;