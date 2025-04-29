import { aquaApi } from "config/api/aqua-api"

export class StateService {
    static getStates = async () => {
        try {
            const res = await aquaApi.get('/states')
            return res.data
        } catch (error) {
            console.error({error})
        }
    }

    static getStatesData = async () => {
        try {
            const res = await aquaApi.post('/projects/dashboard')
            return res.data
        } catch (error) {
            console.error({error})
        }
    }
}