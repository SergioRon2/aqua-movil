import { IMunicipio } from 'interfaces/municipio.interface';
import { ISectorial } from 'interfaces/sectorial.interface';
import { create } from 'zustand';

interface ActiveState {
    searchActive: boolean;
    municipiosActivos: IMunicipio[];
    sectorialActivo: ISectorial | undefined;
    municipiosActivosDashboard: IMunicipio[];
    sectorialActivoDashboard: ISectorial | undefined;
    setSearchActive: (searchActive: boolean) => void;
    setMunicipiosActivos: (municipios: IMunicipio[] | undefined) => void; 
    setSectorialActivo: (sectorialActivo: ISectorial | undefined) => void;
    setMunicipiosActivosDashboard: (municipios: IMunicipio[] | undefined) => void; 
    setSectorialActivoDashboard: (sectorialActivo: ISectorial | undefined) => void;
}


const useActiveStore = create<ActiveState>((set) => ({
    searchActive: false,
    setSearchActive: (searchActive: boolean) => set({ searchActive }),

    municipiosActivos: [] as IMunicipio[],
    setMunicipiosActivos: (municipios: IMunicipio[] | undefined) => set({ municipiosActivos: municipios ?? [] }),

    sectorialActivo: undefined,
    setSectorialActivo: (sectorialActivo: ISectorial | undefined) => set({ sectorialActivo }),


    municipiosActivosDashboard: [] as IMunicipio[],
    setMunicipiosActivosDashboard: (municipios: IMunicipio[] | undefined) => set({ municipiosActivosDashboard: municipios ?? [] }),

    sectorialActivoDashboard: undefined,
    setSectorialActivoDashboard: (sectorialActivoDashboard: ISectorial | undefined) => set({ sectorialActivoDashboard }),
}));

export default useActiveStore;