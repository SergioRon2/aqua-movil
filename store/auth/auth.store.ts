import { AuthService } from 'services/auth/auth.service';
import { create } from 'zustand';

interface AuthState {
    isAuthenticated: boolean;
    user: { id: string; name: string } | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    user: null,
    token: null,


    login: async (email, password) => {
        try {
            const data  = await AuthService.login(email, password);
            console.log(data)
            const { authorisation, user, status } = data;

            set({
                token: authorisation?.token,
                user: user,
                isAuthenticated: status === 'success',
            });
        } catch (error) {
            console.error("Login failed store:", error);
            throw error;
        }
    },


    logout: () => set({ isAuthenticated: false, user: null, token: null }),
}));

export default useAuthStore;