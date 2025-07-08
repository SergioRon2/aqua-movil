import { aquaApi } from "config/api/aqua-api";


export class KiraAssistantService {
    static PREFIX = 'artificial_intelligence';
    
    static readonly questionPostKira = async(question: string) => {
        try {
            const res = await aquaApi.post(`${this.PREFIX}/query`, {
                question: question
            })
            return res.data;
        } catch (error) {
            console.error({ error });
        }
    }
}