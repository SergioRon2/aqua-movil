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
    municipioActivo_SectorialesScreen: IMunicipio | null;
    sectorialActivo_MunicipiosScreen: ISectorial | null;
    setSectorialActivo_MunicipiosScreen: (sectorialActivo_MunicipiosScreen: ISectorial | undefined) => void;
    setMunicipioActivo_SectorialesScreen: (municipioActivo_SectorialesScreen: IMunicipio | undefined) => void;
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
    selectedYearIndex: number,
    setSelectedYearIndex: (index: number) => void;
    isAllYears: boolean,
    setIsAllYears: (value: boolean) => void;
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


    municipioActivo_SectorialesScreen: null,
    setMunicipioActivo_SectorialesScreen: (municipioActivo_SectorialesScreen: IMunicipio | undefined) => set({ municipioActivo_SectorialesScreen: municipioActivo_SectorialesScreen }),

    sectorialActivo_MunicipiosScreen: null,
    setSectorialActivo_MunicipiosScreen: (sectorialActivo_MunicipiosScreen: ISectorial | undefined) => set({ sectorialActivo_MunicipiosScreen }),

    planDesarrolloActivo: undefined,
    setPlanDesarrolloActivo: (planDesarrollo: IDevelopmentPlan | undefined) => set({ planDesarrolloActivo: planDesarrollo }),

    fechaInicio: undefined,
    setFechaInicio: (fechaInicio: string | undefined) => set({ fechaInicio }),

    fechaFin: undefined,
    setFechaFin: (fechaFin: string | undefined) => set({ fechaFin }),

    selectedYearIndex: 1,
    setSelectedYearIndex: (index: number) => set({ selectedYearIndex: index }),

    isAllYears: false,
    setIsAllYears: (value: boolean) => set({ isAllYears: value }),
}));

export default useActiveStore;