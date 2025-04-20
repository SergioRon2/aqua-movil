import { aquaApi } from "config/api/aqua-api"


export class SectoralService {
    static PREFIX = 'listGeneric/type/list_sector'

    static getAllSectorals = async () => {
        try {
            const res = await aquaApi.get(`/${this.PREFIX}/enable`)
            return res;
        } catch (error) {
            console.error({error})
        }
    }
}