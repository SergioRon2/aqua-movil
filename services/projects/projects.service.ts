import { aquaApi } from "config/api/aqua-api";

export class ProjectsService {
    static PREFIX = 'projects';

    static readonly getAll = async () => {
        try {
            const response = await aquaApi.post(`/${this.PREFIX}/showAll?limit=10&page=1`);
            return response.data;
        } catch (error) {
            throw new Error(`Error fetching projects: ${error}`);
        }
    }
}