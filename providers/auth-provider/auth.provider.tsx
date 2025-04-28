import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuthStore from 'store/auth/auth.store';
import { useNavigation } from '@react-navigation/native';
import { ReactNode, useEffect, useState } from 'react';
import { Loading } from 'components/loading/loading.component';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { setUser, setToken, setIsAuthenticated, token, isAuthenticated } = useAuthStore();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAuthData = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('@token');
                const storedUser = await AsyncStorage.getItem('@user');
                const storedAuth = await AsyncStorage.getItem('@isAuthenticated');

                if (storedToken && storedUser && storedAuth === 'true') {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Error loading auth data', error);
            } finally {
                setLoading(false); // Solo aquí, cuando termine todo
            }
        };

        loadAuthData();
    }, []);

    useEffect(() => {
        if (!loading) { // Solo navega si ya terminó de cargar
            if (token && isAuthenticated) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                });
            } else {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                });
            }
        }
    }, [token, isAuthenticated, loading]);

    console.log({ token, isAuthenticated });

    if (loading) {
        return <Loading />;
    }

    return <>{children}</>;
};
