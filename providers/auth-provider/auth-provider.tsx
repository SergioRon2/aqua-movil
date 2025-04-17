import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuthStore from 'store/auth/auth.store';
import { useNavigation } from '@react-navigation/native';
import { ReactNode, useEffect } from 'react';
import { Loading } from 'components/loading/loading.component';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { setUser, setToken, setIsAuthenticated, token, isAuthenticated } = useAuthStore();
    const navigation = useNavigation();

    useEffect(() => {
        const loadAuthData = async () => {
            const storedToken = await AsyncStorage.getItem('@token');
            const storedUser = await AsyncStorage.getItem('@user');
            const storedAuth = await AsyncStorage.getItem('@isAuthenticated');

            if (storedToken && storedUser && storedAuth === 'true') {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
            }
        };

        loadAuthData();
    }, []);

    useEffect(() => {
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
    }, [token, isAuthenticated]);

    if (token == null) {
        return <Loading />
    }

    return <>{children}</>
};
