import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Pressable, ImageBackground, Modal, Image } from 'react-native';
import { AuthService } from 'services/auth/auth.service';
import useAuthStore from 'store/auth/auth.store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomButtonPrimary } from 'components/buttons/mainButton.component';
import { Loading } from 'components/loading/loading.component';
import useStylesStore from 'store/styles/styles.store';
import { IUser } from 'interfaces/user.interface';

const LoginScreen = () => {
    const { globalColor } = useStylesStore()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser, setToken, setIsAuthenticated } = useAuthStore()
    const [error, setError] = useState<boolean>(false)
    const [emptyFields, setEmptyFields] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [sessionsModalVisible, setSessionsModalVisible] = useState(false);
    const [recentSessions, setRecentSessions] = useState<{ email: string; date: string, token: string, user: IUser, isAuthenticated: boolean }[]>([]);

    const handleShowSessions = async () => {
        const storedSessions = await AsyncStorage.getItem('@recentSessions');
        if (storedSessions) {
            setRecentSessions(JSON.parse(storedSessions));
        } else {
            setRecentSessions([]);
        }
        setSessionsModalVisible(true);
    };

    const handleLogin = async () => {
        if (!email || !password) {
            setEmptyFields(true)
            return;
        }
        try {
            setLoading(true)
            const data = await AuthService.login(email, password);
            const { authorisation, user, status } = data;

            const token = authorisation?.token;
            const isAuthenticated = status === 'success';

            setToken(token);
            setUser(user);
            setIsAuthenticated(isAuthenticated);
            // Guardar el tiempo para la expiración del token
            const oneHourFromNow = new Date().getTime() + 60 * 60 * 1000;

            // almacenar en storage
            await AsyncStorage.multiSet([
                ['@token', token],
                ['@user', JSON.stringify(user)],
                ['@isAuthenticated', JSON.stringify(isAuthenticated)],
                ['@expiresAt', oneHourFromNow.toString()]
            ]);

            // Guardar sesión reciente
            const storedSessions = await AsyncStorage.getItem('@recentSessions');
            let sessions = storedSessions ? JSON.parse(storedSessions) : [];
            sessions = sessions.filter((session: any) => session.email !== email);
            // Agregar la sesión actual al inicio
            sessions.unshift({
                email,
                date: new Date().toISOString(),
                token,
                user,
                isAuthenticated
            });
            // Limitar a las últimas 5 sesiones
            sessions = sessions.slice(0, 5);
            await AsyncStorage.setItem('@recentSessions', JSON.stringify(sessions));
        } catch {
            setError(true)
            setTimeout(() => {
                setError(false)
            }, 4000)
        } finally {
            setLoading(false)
        }
    };

    const handleLoginSessionRecent = async (token: string, user: IUser, isAuthenticated: boolean) => {
        try {
            setLoading(true)
            const oneHourFromNow = new Date().getTime() + 60 * 60 * 1000;

            // almacenar en storage
            await AsyncStorage.multiSet([
                ['@token', token],
                ['@user', JSON.stringify(user)],
                ['@isAuthenticated', JSON.stringify(isAuthenticated)],
                ['@expiresAt', oneHourFromNow.toString()]
            ]);

            setToken(token);
            setUser(user);
            setIsAuthenticated(isAuthenticated);
            setSessionsModalVisible(false);
        } catch (error) {
            console.error('Error al iniciar sesión con la sesión reciente:', error);
        } finally {
            setLoading(false);
        }
    }

    if (emptyFields) {
        return <Modal
            visible={true}
            onRequestClose={() => setError(false)}
            transparent={true}
            animationType="fade"
            style={{ width: '100%', height: '100%' }}
        >
            <View className="flex-1 items-center w-full h-full justify-center bg-black/50">
                <View className="bg-white m-auto items-center justify-center rounded-lg p-6 w-4/5">
                    <Text className="text-center text-xl font-bold text-black-600">Campos vacios</Text>
                    <Text className="text-center text-gray-600 mt-2 mb-5">
                        Rellena todos los campos
                    </Text>
                    <CustomButtonPrimary rounded onPress={() => setEmptyFields(false)} title='Cerrar' />
                </View>
            </View>
        </Modal>
    }

    if (error) {
        return <Modal
            visible={true}
            onRequestClose={() => setError(false)}
            transparent={true}
            animationType="fade"
            style={{ width: '100%', height: '100%' }}
        >
            <View className="flex-1 items-center w-full h-full justify-center bg-black/50">
                <View className="bg-white m-auto items-center rounded-lg p-6 w-4/5">
                    <Text className="text-center text-xl font-bold text-black-600">Error</Text>
                    <Text className="text-center text-gray-600 mt-2 mb-5">
                        Verifica correo o contraseña
                    </Text>
                    <CustomButtonPrimary onPress={() => setError(false)} title='Cerrar' />
                </View>
            </View>
        </Modal>
    }

    if (loading) {
        return <Loading />
    }

    return (
        <View className="flex-1 bg-white justify-center p-8 animate-fade-in">
            <View className='gap-4 px-6 py-2 justify-center'>
                <View className='flex-row justify-center items-center w-full'>
                    <Image className='w-24 h-24' source={require('../../assets/img/logo.png')} />
                </View>
                <Image style={{ height: 150 }} className='mx-auto w-full' source={require('../../assets/img/logo gobcesar HORIZONTAL.png')} />
                <View className='justify-center items-center mb-5'>
                    <TextInput
                        className="h-12 w-full border border-gray-300 mb-4 px-6 rounded-full animate-fade-in"
                        placeholder="Correo electronico"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        className="h-12 w-full border border-gray-300 mb-4 px-6 rounded-full animate-fade-in"
                        placeholder="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry

                    />

                    <CustomButtonPrimary rounded onPress={handleLogin} title='Login' />
                </View>
                <View className='flex-row justify-center items-center'>
                    <Text className="text-center text-sm text-gray-700 animate-fade-in">Ver ultimas sesiones {''}</Text>
                    <Pressable onPress={handleShowSessions}>
                        <Text style={{ color: globalColor }} className="text-sm font-bold">aquí</Text>
                    </Pressable>
                </View>
            </View>

            <View>
                <Modal
                    visible={sessionsModalVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setSessionsModalVisible(false)}
                >
                    <View className="flex-1 items-center justify-center bg-black/50">
                        <View className="bg-white rounded-lg gap-2 p-6 w-4/5">
                            <Text className="text-xl font-bold text-center mb-4">Últimas sesiones</Text>
                            {recentSessions.length === 0 ? (
                                <Text className="text-center text-gray-600">No hay sesiones recientes.</Text>
                            ) : (
                                recentSessions.map((session, idx) => (
                                    <Pressable onPress={() => handleLoginSessionRecent(session?.token, session?.user, session?.isAuthenticated)} key={idx} style={{ borderColor: globalColor }} className="mb-2 border-2 rounded-xl p-3 active:opacity-50">
                                        <Text className="text-base">{session.email}</Text>
                                        <Text className="text-sm text-gray-600">
                                            {new Date(session.date).toLocaleString('es-CO', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false
                                            })}</Text>
                                    </Pressable>
                                ))
                            )}
                            <CustomButtonPrimary
                                rounded
                                onPress={() => setSessionsModalVisible(false)}
                                title="Cerrar"
                            />
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
};

export default LoginScreen;
