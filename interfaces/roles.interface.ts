export interface IRole {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    pivot: {
        model_id: number;
        role_id: number;
        model_type: string;
    };
    permissions: IPermission[];
}

export interface IPermission {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    pivot: {
        role_id: number;
        permission_id: number;
    };
}