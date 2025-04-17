import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUser } from 'interfaces/user.interface';
import { create } from 'zustand';

interface AuthState {
    isAuthenticated: boolean;
    user: IUser | null;
    token: string | null;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    setUser: (user: IUser) => void;
    setToken: (token: string | null) => void;
    logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    user: null,
    token: null,
    setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
    setUser: (user: IUser | null) => set({ user }),
    setToken: (token: string | null) => set({ token }),
    logout: async () => {
        set({
            isAuthenticated: false, 
            user: null, 
            token: null 
        }) 
        
        await AsyncStorage.multiRemove([
            '@token',
            '@user',
            '@isAuthenticated',
        ]);
    },
}));

export default useAuthStore;