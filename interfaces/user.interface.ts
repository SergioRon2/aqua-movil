import { IRole } from "./roles.interface";

export interface IUser {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    is_notification_enabled: boolean | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    roles: IRole[];
}