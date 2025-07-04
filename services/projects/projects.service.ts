import { aquaApi } from "config/api/aqua-api";

interface Props {
    municipio_ids?: number[] | null;
    sectorial_id?: number;
    type?: string;
    estado_id?: number;
    fechaInicio?: string;
    fechaFin?: string;
    development_plan_id?: number;
}

export class ProjectsService {
    static PREFIX = 'projects';

    static readonly getAll = async ({ municipio_ids, sectorial_id, type, estado_id, fechaInicio, fechaFin, development_plan_id }: Props = {}) => {
        try {
            const response = await aquaApi.post(`/${this.PREFIX}/showAll?limit=10000&page=1`, {
                municipio_ids,
                sector_id: sectorial_id,
                departamento_id: 9,
                type: type,
                state_id: estado_id,
                start_date: fechaInicio,
                end_date: fechaFin,
                development_plan_id: development_plan_id
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error fetching projects: ${error}`);
        }
    }

    static readonly getProjectInfoById = async (idProject: number) => {
        try {
            const response = await aquaApi.get(`/projects/${idProject}`)
            return response.data;
        } catch (error) {
            throw new Error(`Error fetching project info: ${error}`);
        }
    }

    static readonly getSubProjects = async (contractId: number) => {
        try {
            const response = await aquaApi.get(`/projects/getByContractId/${contractId}`)
            return response.data;
        } catch (error) {
            throw new Error(`Error fetching subprojects: ${error}`);
        }
    }
}