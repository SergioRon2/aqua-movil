import { aquaApi } from "config/api/aqua-api"

export class DevelopmentPlanService {
    static getDevelopmentPlans = async () => {
        try {
            const res = await aquaApi.get('/development-plan')
            return res;
        } catch (error) {
            console.error({error})
        }
    }
}