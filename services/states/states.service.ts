import { aquaApi } from "config/api/aqua-api"

interface Props {
    municipio_id?: number;
    sectorial_id?: number;
    project_id?: number;
    development_plan_id?: number;
    fechaInicio?: string;
    fechaFin?: string;
}

export class StateService {
    static getStatesData = async ({ municipio_id, sectorial_id, project_id, development_plan_id, fechaInicio, fechaFin }: Props = {}) => {
        try {
            const res = await aquaApi.post('/projects/dashboard', {
                project_id: project_id,
                development_plan_id: development_plan_id,
                sector_id: sectorial_id,
                municipio_id: municipio_id,
                date_begin: fechaInicio,
                date_end: fechaFin
            })
            return res.data
        } catch (error) {
            console.error({ error })
        }
    }

    // tipos de estados para proyectos
    static getTypeStates = async () => {
        try {
            const res = await aquaApi.get('/states')
            return res.data
        } catch (error) {
            console.error({ error })
        }
    }
}