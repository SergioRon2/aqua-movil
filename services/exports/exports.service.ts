import { aquaApi } from "config/api/aqua-api"


export class ExportsService {

    static downloadFile = async(id: number) => {
        try {
            const res = await aquaApi.get(`/download_file/${id}`)
        } catch (error) {
            console.error({error})
        }
    }
}