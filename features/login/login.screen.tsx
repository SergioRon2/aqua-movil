import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Pressable, ImageBackground, Modal, Image } from 'react-native';
import { AuthService } from 'services/auth/auth.service';
import useAuthStore from 'store/auth/auth.store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomButtonPrimary } from 'components/buttons/mainButton.component';
import { Loading } from 'components/loading/loading.component';
import useStylesStore from 'store/styles/styles.store';

const LoginScreen = () => {
    const {globalColor} = useStylesStore()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser, setToken, setIsAuthenticated } = useAuthStore()
    const [error, setError] = useState<boolean>(false)
    const [emptyFields, setEmptyFields] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

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

            // almacenar en storage
            await AsyncStorage.multiSet([
                ['@token', token],
                ['@user', JSON.stringify(user)],
                ['@isAuthenticated', JSON.stringify(isAuthenticated)]
            ]);
        } catch {
            setError(true)
            setTimeout(() => {
                setError(false)
            }, 4000)
        } finally {
            setLoading(false)
        }
    };

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
                <View>
                    <Text className="text-center text-sm text-gray-700 animate-fade-in">Terminos y condiciones de la app <Text style={{color: globalColor}} className="font-bold">aquí</Text></Text>
                </View>
            </View>
        </View>
    );
};

export default LoginScreen;
