import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuthStore from 'store/auth/auth.store';
import { useNavigation } from '@react-navigation/native';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { AppState, Keyboard, Modal, TouchableWithoutFeedback, View, Text } from 'react-native';
import { Loading } from 'components/loading/loading.component';
import useActiveStore from 'store/actives/actives.store';
import { CustomButtonPrimary } from 'components/buttons/mainButton.component';

const INACTIVITY_LIMIT = 25 * 60 * 1000; // 25 minutos
const COUNTDOWN_LIMIT = 10;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { setUser, setToken, setIsAuthenticated, token, isAuthenticated, logout } = useAuthStore();
    const { setFechaInicio, setFechaFin } = useActiveStore();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const appState = useRef(AppState.currentState);
    const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
    const countdownTimer = useRef<NodeJS.Timeout | null>(null);
    const [showTimeoutModal, setShowTimeoutModal] = useState(false);
    const [countdown, setCountdown] = useState(COUNTDOWN_LIMIT);

    const resetInactivityTimer = () => {
        if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
        if (countdownTimer.current) clearInterval(countdownTimer.current);

        setShowTimeoutModal(false); // Oculta el modal si estaba visible
        setCountdown(COUNTDOWN_LIMIT); // Reinicia el contador

        inactivityTimer.current = setTimeout(() => {
            setShowTimeoutModal(true);
            startCountdownToLogout();
        }, INACTIVITY_LIMIT);
    };

    const startCountdownToLogout = () => {
        let seconds = COUNTDOWN_LIMIT;

        countdownTimer.current = setInterval(() => {
            seconds -= 1;
            setCountdown(seconds);

            if (seconds <= 0) {
                clearInterval(countdownTimer.current!);
                setShowTimeoutModal(false);
                logout();
            }
        }, 1000);
    };

    const handleCancelLogout = () => {
        clearInterval(countdownTimer.current!);
        setShowTimeoutModal(false);
        setCountdown(COUNTDOWN_LIMIT);
        resetInactivityTimer(); // Volver a contar desde cero
    };

    const handleLogout = () => {
        clearInterval(countdownTimer.current!);
        clearTimeout(inactivityTimer.current!);
        setShowTimeoutModal(false);
        setCountdown(COUNTDOWN_LIMIT);

        console.log('Sesión cerrada por inactividad');
        logout();
        AsyncStorage.multiRemove(['@token', '@user', '@isAuthenticated']);
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    useEffect(() => {
        const loadAuthData = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('@token');
                const storedUser = await AsyncStorage.getItem('@user');
                const storedAuth = await AsyncStorage.getItem('@isAuthenticated');
                const fechaInicio = await AsyncStorage.getItem("@fechaInicio");
                const fechaFin = await AsyncStorage.getItem("@fechaFin");

                if (storedToken && storedUser && storedAuth === 'true') {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                    setIsAuthenticated(true);
                    setFechaInicio(JSON.stringify(fechaInicio));
                    setFechaFin(JSON.stringify(fechaFin));

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
        <View
            style={{ flex: 1 }}
            onStartShouldSetResponder={() => {
                resetInactivityTimer();
                return false;
            }}>
            {children}

            <View>
                {showTimeoutModal && (
                    <Modal visible={true} transparent animationType="fade">
                        <View className="flex-1 justify-center items-center bg-black/50">
                            <View className="bg-white p-6 rounded-xl w-4/5 py-12 justify-center items-center">
                                <Text className="text-lg font-semibold text-center mb-4">
                                    ¡Tu sesión se cerrará en {countdown} segundos por inactividad!
                                </Text>
                                <View className="flex-col gap-3 justify-center items-center w-full">
                                    <CustomButtonPrimary rounded backgroundWhite title="Cancelar" onPress={handleCancelLogout} />
                                    <CustomButtonPrimary rounded title="Cerrar sesión" onPress={handleLogout} />
                                </View>
                            </View>
                        </View>
                    </Modal>
                )}
            </View>
        </View>
    );
};
