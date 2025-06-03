import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuthStore from 'store/auth/auth.store';
import { useNavigation } from '@react-navigation/native';
import { ReactNode, useEffect, useState } from 'react';
import { Loading } from 'components/loading/loading.component';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { setUser, setToken, setIsAuthenticated, token, isAuthenticated, logout } = useAuthStore();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAuthData = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('@token');
                const storedUser = await AsyncStorage.getItem('@user');
                const storedAuth = await AsyncStorage.getItem('@isAuthenticated');
                const expiresAt = await AsyncStorage.getItem('@expiresAt');
                const now = new Date().getTime();

                if (
                    storedToken &&
                    storedUser &&
                    storedAuth === 'true' &&
                    expiresAt &&
                    now < parseInt(expiresAt)
                ) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                    setIsAuthenticated(true);
                } else {
                    await AsyncStorage.multiRemove(['@token', '@user', '@isAuthenticated', '@expiresAt']);
                    setToken(null);
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Error loading auth data', error);
            } finally {
                setLoading(false);
            }
        };

        loadAuthData();
    }, []);

    useEffect(() => {
        const autoLogout = async () => {
            const expiresAt = await AsyncStorage.getItem('@expiresAt');
            if (expiresAt) {
                const now = new Date().getTime();
                const timeLeft = parseInt(expiresAt) - now;

                if (timeLeft > 0) {
                    setTimeout(async () => {
                        logout();
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    }, timeLeft);
                }
            }
        };

        if (token && isAuthenticated) {
            autoLogout();
        }
    }, [token, isAuthenticated]);

    useEffect(() => {
        if (!loading) {
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

    if (loading) {
        return <Loading />;
    }

    return <>{children}</>;
};
