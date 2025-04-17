import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Pressable, ImageBackground, Modal, Image } from 'react-native';
import { AuthService } from 'services/auth/auth.service';
import useAuthStore from 'store/auth/auth.store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser, setToken, setIsAuthenticated } = useAuthStore()
    const [error, setError] = useState<boolean>(false)

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        try {
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
        }
    };


    if (error) {
        return <Modal
            visible={true}
            onRequestClose={() => setError(false)}
            transparent={true}
            animationType="fade"
            style={{ width: '100%', height: '100%' }}
        >
            <View className="flex-1 items-center w-full h-full justify-center bg-black/50">
                <View className="bg-white m-auto rounded-lg p-6 w-4/5">
                    <Text className="text-center text-xl font-bold text-black-600">Error</Text>
                    <Text className="text-center text-gray-600 mt-2">
                        Verifica correo o contraseña
                    </Text>
                    <Pressable
                        onPress={() => setError(false)}
                        className="bg-pink-600 h-12 w-full rounded-xl justify-center items-center mt-4"
                    >
                        <Text className="text-white font-bold">Cerrar</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    }



    return (
        <View className="flex-1 bg-white justify-center p-8 animate-fade-in">
            <View className='gap-4 px-6 py-2 justify-evenly'>
                <Image style={{ width: '90%', height: 150 }} className='mx-auto w-full' source={require('../../assets/img/logo gobcesar HORIZONTAL.png')} />
                <View>
                    <TextInput
                        className="h-12 border border-gray-300 mb-4 px-6 rounded-full animate-fade-in"
                        placeholder="Correo electronico"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        className="h-12 border border-gray-300 mb-4 px-6 rounded-full animate-fade-in"
                        placeholder="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry

                    />

                    <Pressable onPress={handleLogin} className='bg-pink-600 active:bg-pink-900 w-1/3 py-1 rounded-full mx-auto'>
                        <Text className='font-bold text-xl text-white text-center'>Login</Text>
                    </Pressable>
                </View>
                <View>
                    <Text className="text-center text-sm text-gray-700 animate-fade-in">Terminos y condiciones de la app <Text className="text-pink-600 font-bold">aquí</Text></Text>
                </View>
            </View>
        </View>
    );
};

export default LoginScreen;
