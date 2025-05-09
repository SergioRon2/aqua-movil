import { aquaApi } from "config/api/aqua-api";

interface Props {
    municipio_id?: number;
    sectorial_id?: number;
    project_id?: number;
    fechaInicio?: string;
    fechaFin?: string;
}

export class InfoService {
    static readonly getInfoByAllData = async ({ municipio_id, sectorial_id, project_id, fechaInicio, fechaFin }: Props = {}) => {
        const payload = {
            project_id: project_id,
            development_plan_id: 39,
            sector_id: sectorial_id,
            municipio_id: municipio_id,
            date_begin: fechaInicio,
            date_end: fechaFin
        }
        try {
            const response = await aquaApi.post(`/projects/getInfoProgress`, payload);
            return response.data;
        } catch (error) {
            throw new Error(`Error fetching info: ${error}`);
        }
    };
}