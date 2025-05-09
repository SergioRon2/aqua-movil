export interface IEstado {
    id: number;
    code: string;
    name: string;
    indicatorInitiative: boolean;
    indicatorProject: boolean;
    indicatorActivities: boolean;
    indicatorChangeTypology: boolean;
    indicatorEnabled: boolean;
    indicatorFinish: boolean;
    created_at: string | null;
    updated_at: string;
    deleted_at: string | null;
    indicatorAlerta: boolean;
    color: string; 
}
