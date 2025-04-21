import { aquaApi } from "config/api/aqua-api";

export class AuthService {

    static async login(email: string, password: string) {
        const payload = {
            email: email,
            password: password
        }
        try {
            const response = await aquaApi.post('/login', payload);
            return response.data;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    }
}
