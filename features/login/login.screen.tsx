import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Pressable, ImageBackground } from 'react-native';
import useAuthStore from 'store/auth/auth.store';

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [section, setSection] = useState<number>(1);
    const {login} = useAuthStore()
    const [error, setError] = useState<boolean>(false)

    const handleLogin = () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        // Add your login logic here
        if (username === 'admin' && password === 'admin') {
            login({id: '1', name: 'admin'})
        } else {
            setError(true)
            setTimeout(() => {
                setError(false)
            }, 4000)
        }
    };

    const handleNextSection = () => {
        if (username === 'admin') {
            setSection(section + 1);
        } else {
            setError(true)
            setTimeout(() => {
                setError(false)
            }, 4000)
        }
    }

    const handleBackSection = () => {
        setSection(section - 1);
    }


    return (
        <View className="justify-center mt-6">
            <View className='h-3/5 justify-center animate-fade-in'>
                <ImageBackground
                    className='flex-1 justify-center'
                    source={require('../../assets/img/backgroundLogin.png')}
                    resizeMode='cover'
                >
                    <View className="absolute inset-0 bg-pink-600/40 justify-center">
                        <Text className="text-8xl font-bold text-white text-center mt-10 font-serif animate-fade-in">AQUA</Text>
                        <Text className="text-4xl font-bold text-white text-center mt-2 animate-fade-in">Bienvenido</Text>
                        <Text className="text-lg font-bold text-white text-center mt-2 animate-fade-in">Inicia sesión para continuar</Text>
                    </View>
                </ImageBackground>
            </View>
            <View className='bg-white gap-4 px-6 py-2 h-2/5 justify-evenly'>
                <Text className={`text-2xl font-bold mb-6 text-center ${error ? 'text-red-600' : 'text-pink-600'} animate-fade-in`}>
                    {error 
                    ? section === 1 
                    ? 'Usuario no encontrado' 
                    : 'Contraseña incorrecta' 
                    : section === 1 
                    ? 'Ingresa tu usuario' 
                    : 'Contraseña'}
                </Text>
                <View className='gap-4'>
                    {section === 1 && (
                        <TextInput
                            className="h-14 border border-gray-300 mb-4 px-6 rounded-full animate-fade-in"
                            placeholder="Username"
                            value={username}
                            onChangeText={setUsername}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    )}
                    {section === 2 && (
                        <TextInput
                            className="h-14 border border-gray-300 mb-4 px-6 rounded-full animate-fade-in"
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            
                        />
                    )}
                    <View className='flex-row justify-center items-center w-full gap-2 animate-fade-in'>
                        {section === 2 && (
                            <Pressable onPress={handleBackSection} className={`bg-pink-600 h-12 ${section === 2 ? 'w-1/2' : 'w-[90%]'} rounded-xl justify-center items-center mb-4 animate-fade-in`}>
                                <Text className='text-white font-bold'>Regresar</Text>
                            </Pressable>
                        )}
                        <Pressable onPress={section === 1 ? handleNextSection : handleLogin} className={`${section === 2 ? 'bg-white border border-pink-600' : 'bg-pink-600'} h-12 ${section === 2 ? 'w-1/2' : 'w-[90%]'} rounded-xl justify-center items-center mb-4 animate-fade-in`}>
                            <Text className={`${section === 2 ? 'text-pink-600' : 'text-white'} font-bold`}>{section === 1 ? 'Siguiente' : 'Iniciar sesion'}</Text>
                        </Pressable>
                    </View>
                </View>
                <View>
                    <Text className="text-center text-sm text-gray-700 animate-fade-in">Terminos y condiciones de la app <Text className="text-pink-600 font-bold">aquí</Text></Text>
                </View>
            </View>
        </View>
    );
};

export default LoginScreen;
