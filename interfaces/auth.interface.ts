import { IUser } from "./user.interface";

export interface IAuth {
    authorisation: {
        token: string;
        type: string;
    };
    user: IUser;
    status: string;
}