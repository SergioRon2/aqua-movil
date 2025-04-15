import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Pressable, ImageBackground, Modal, Image } from 'react-native';
import useAuthStore from 'store/auth/auth.store';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [section, setSection] = useState<number>(1);
    const { login } = useAuthStore()
    const [error, setError] = useState<boolean>(false)

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        // Add your login logic here
        try {
            login(email, password)
        } catch {
            setError(true)
            setTimeout(() => {
                setError(false)
            }, 4000)
        }
    };

    const handleNextSection = () => {
        setSection(section + 1);
    }

    const handleBackSection = () => {
        setSection(section - 1);
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
                <View className="bg-white m-auto rounded-lg p-6 w-4/5">
                    <Text className="text-center text-xl font-bold text-black-600">Error</Text>
                    <Text className="text-center text-gray-600 mt-2">
                        {section === 1
                            ? 'Usuario no encontrado'
                            : 'Contraseña incorrecta'
                        }
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
        <View className="justify-center mt-6">
            <View className='h-3/5 justify-center animate-fade-in'>
                <ImageBackground
                    className='flex-1'
                    source={require('../../assets/img/backgroundLogin.png')}
                    resizeMode='cover'
                >
                    <View className="h-full w-full inset-0 bg-pink-600/40 justify-start">
                        <View className='flex-row justify-between items-start w-full h-1/4 z-40 opacity-65'>
                            <Image source={require('../../assets/img/logo gobcesar HORIZONTAL.png')} style={{ width: '35%', height: '50%', marginTop: 10 }} resizeMode='contain' />
                            <Image source={require('../../assets/img/logo.png')} style={{ width: '20%', height: '50%', marginTop: 10 }} resizeMode='contain' />
                        </View>
                        <Text className="text-8xl font-bold text-white text-center mt-10 font-serif animate-fade-in">AQUA</Text>
                        <Text className="text-4xl font-bold text-white text-center mt-2 animate-fade-in">Bienvenido</Text>
                        <Text className="text-lg font-bold text-white text-center mt-2 animate-fade-in">Inicia sesión para continuar</Text>
                    </View>
                </ImageBackground>
            </View>
            <View className='bg-white gap-4 px-6 py-2 h-2/5 justify-evenly'>
                {section === 1 && (
                    <Text className={`text-2xl font-bold mb-6 text-center text-pink-600 animate-fade-in`}>
                        Ingresa tu usuario
                    </Text>
                )}
                {section === 2 && (
                    <Text className={`text-2xl font-bold mb-6 text-center text-pink-600 animate-fade-in`}>
                        Contraseña
                    </Text>
                )}
                <View className='gap-4'>
                    {section === 1 && (
                        <TextInput
                            className="h-14 border border-gray-300 mb-4 px-6 rounded-full animate-fade-in"
                            placeholder="Correo electronico"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    )}
                    {section === 2 && (
                        <TextInput
                            className="h-14 border border-gray-300 mb-4 px-6 rounded-full animate-fade-in"
                            placeholder="Contraseña"
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
                            <Text className={`${section === 2 ? 'text-pink-600' : 'text-white'} font-bold`}>{section === 1 ? 'Continuar' : 'Iniciar sesion'}</Text>
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
