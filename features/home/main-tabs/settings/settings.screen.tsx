import { CustomButtonPrimary } from 'components/buttons/mainButton.component';
import React from 'react';
import { View, Text, Button, Pressable } from 'react-native';
import useAuthStore from 'store/auth/auth.store';

const SettingsScreen = () => {
    const {logout} = useAuthStore();

    return (
        <View className="flex-1 justify-center items-center bg-white animate-fade-in">
            <Text className="text-2xl font-bold mb-5">Configuración</Text>
            <CustomButtonPrimary title='Cerrar sesion' onPress={logout} />
        </View>
    );
};

export default SettingsScreen;
