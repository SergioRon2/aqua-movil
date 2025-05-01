import { aquaApi } from "config/api/aqua-api";

interface Props {
    municipio_ids?: number[];
    sectorial_id?: number;
}

export class ProjectsService {
    static PREFIX = 'projects';

    static readonly getAll = async ({municipio_ids, sectorial_id}: Props = {}) => {
        try {
            const response = await aquaApi.post(`/${this.PREFIX}/showAll?limit=10000&page=1`, {
                municipio_ids,
                sector_id: sectorial_id,
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error fetching projects: ${error}`);
        }
    }
}