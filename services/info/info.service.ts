import { aquaApi } from "config/api/aqua-api";

interface Props {
    development_plan_id?: number;
    municipio_id?: number;
    sectorial_id?: number;
    project_id?: number;
    fechaInicio?: string;
    fechaFin?: string;
}

export class InfoService {
    static readonly getInfoByAllData = async ({ development_plan_id, municipio_id, sectorial_id, project_id, fechaInicio, fechaFin }: Props = {}) => {
        const payload = {
            project_id: project_id,
            development_plan_id: development_plan_id,
            sector_id: sectorial_id,
            municipio_id: municipio_id,
            date_begin: `${fechaInicio}`,
            date_end: `${fechaFin}`
        }
        try {
            const response = await aquaApi.post(`/projects/getInfoProgress`, payload);
            return response.data;
        } catch (error) {
            throw new Error(`Error fetching info: ${error}`);
        }
    };

    static readonly getInfoByProject = async (project_id: number) => {
        try {
            const response = await aquaApi.get(`/projects/get-info/${project_id}`);
            return response.data;
        } catch (error) {
            throw new Error(`Error fetching info by project: ${error}`);
        }
    }

    static readonly getProgressInfo = async (project_id: number, contract_id: number) => {
        try {
            const response = await aquaApi.post(`/projects/getProgress`, {
                limit: 5,
                page: 1,
                search: "",
                project_id: project_id,
                contract_id: contract_id
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error fetching progress info: ${error}`);
        }
    }
}