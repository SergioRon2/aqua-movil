import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuthStore from 'store/auth/auth.store';
import { useNavigation } from '@react-navigation/native';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { AppState, Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { Loading } from 'components/loading/loading.component';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { setUser, setToken, setIsAuthenticated, token, isAuthenticated, logout } = useAuthStore();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const appState = useRef(AppState.currentState);
    const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

    const INACTIVITY_LIMIT = 25 * 60 * 1000; // 25 minutos

    const resetInactivityTimer = () => {
        if (inactivityTimer.current) clearTimeout(inactivityTimer.current);

        inactivityTimer.current = setTimeout(() => {
            console.log('Sesión cerrada por inactividad');
            logout();
            AsyncStorage.multiRemove(['@token', '@user', '@isAuthenticated']);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        }, INACTIVITY_LIMIT);
    };

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
                } else {
                    await AsyncStorage.multiRemove(['@token', '@user', '@isAuthenticated']);
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
        if (token && isAuthenticated) {
            resetInactivityTimer();

            const appStateSubscription = AppState.addEventListener('change', nextAppState => {
                if (
                    appState.current.match(/inactive|background/) &&
                    nextAppState === 'active'
                ) {
                    resetInactivityTimer();
                }
                appState.current = nextAppState;
            });

            const keyboardSub = Keyboard.addListener('keyboardDidShow', resetInactivityTimer);

            return () => {
                appStateSubscription.remove();
                keyboardSub.remove();
                if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
            };
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

    if (loading) return <Loading />;

    return (
        <TouchableWithoutFeedback onPress={resetInactivityTimer}>
            <View style={{ flex: 1 }}>{children}</View>
        </TouchableWithoutFeedback>
    );
};
