import { IDevelopmentPlan } from 'interfaces/development-plan.interface';
import { IEstado } from 'interfaces/estado.interface';
import { IMunicipio } from 'interfaces/municipio.interface';
import { ISectorial } from 'interfaces/sectorial.interface';
import { create } from 'zustand';

interface ActiveState {
    searchActive: boolean;
    municipiosActivos: IMunicipio[];
    sectorialActivo: ISectorial | undefined;
    estadoActivo: IEstado | undefined;
    municipioActivoDashboard: IMunicipio | undefined;
    sectorialActivoDashboard: ISectorial | undefined;
    setSearchActive: (searchActive: boolean) => void;
    setMunicipiosActivos: (municipios: IMunicipio[] | undefined) => void; 
    setSectorialActivo: (sectorialActivo: ISectorial | undefined) => void;
    setEstadoActivo: (estadoActivo: IEstado | undefined) => void;
    setMunicipioActivoDashboard: (municipio: IMunicipio | undefined) => void; 
    setSectorialActivoDashboard: (sectorialActivo: ISectorial | undefined) => void;
    planDesarrolloActivo: IDevelopmentPlan | undefined;
    setPlanDesarrolloActivo: (planDesarrollo: IDevelopmentPlan | undefined) => void;
    fechaInicio: string | undefined;
    setFechaInicio: (fechaInicio: string | undefined) => void;
    fechaFin: string | undefined;
    setFechaFin: (fechaFin: string | undefined) => void;
}


const useActiveStore = create<ActiveState>((set) => ({
    searchActive: false,
    setSearchActive: (searchActive: boolean) => set({ searchActive }),

    municipiosActivos: [] as IMunicipio[],
    setMunicipiosActivos: (municipios: IMunicipio[] | undefined) => set({ municipiosActivos: municipios ?? [] }),

    sectorialActivo: undefined,
    setSectorialActivo: (sectorialActivo: ISectorial | undefined) => set({ sectorialActivo }),

    estadoActivo: undefined,
    setEstadoActivo: (estadoActivo: IEstado | undefined) => set({ estadoActivo }),

    municipioActivoDashboard: undefined,
    setMunicipioActivoDashboard: (municipio: IMunicipio | undefined) => set({ municipioActivoDashboard: municipio }),

    sectorialActivoDashboard: undefined,
    setSectorialActivoDashboard: (sectorialActivoDashboard: ISectorial | undefined) => set({ sectorialActivoDashboard }),

    planDesarrolloActivo: undefined,
    setPlanDesarrolloActivo: (planDesarrollo: IDevelopmentPlan | undefined) => set({ planDesarrolloActivo: planDesarrollo }),

    fechaInicio: undefined,
    setFechaInicio: (fechaInicio: string | undefined) => set({ fechaInicio }),

    fechaFin: undefined,
    setFechaFin: (fechaFin: string | undefined) => set({ fechaFin }),
}));

export default useActiveStore;