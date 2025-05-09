import { aquaApi } from "config/api/aqua-api";

interface Props {
    municipio_ids?: number[];
    sectorial_id?: number;
    type?: string;
    estado_id?: number;
    fechaInicio?: string;
    fechaFin?: string;
}

export class ProjectsService {
    static PREFIX = 'projects';

    static readonly getAll = async ({ municipio_ids, sectorial_id, type, estado_id, fechaInicio, fechaFin }: Props = {}) => {
        try {
            const response = await aquaApi.post(`/${this.PREFIX}/showAll?limit=10000&page=1`, {
                municipio_ids,
                sector_id: sectorial_id,
                departmento_id: 9,
                type: type,
                state_id: estado_id,
                date_begin: fechaInicio,
                date_end: fechaFin
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error fetching projects: ${error}`);
        }
    }
}