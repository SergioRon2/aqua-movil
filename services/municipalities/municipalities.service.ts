import { aquaApi } from "config/api/aqua-api";

export class MunicipalitiesService {
    static PREFIX = 'municipios';

    static getMunicipalitiesValledupar = async () => {
        try {
            const response = await aquaApi.get(`/${this.PREFIX}/municipioAll?departamento_id=9`)
            return response.data;
        } catch (error) {
            console.error({ error })
        }
    }
}