import { CustomButtonPrimary } from 'components/buttons/mainButton.component';
import { View, Text, Pressable } from 'react-native';
import useAuthStore from 'store/auth/auth.store';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ModalMulticolor } from 'components/modals/modalMulticolor.component';

const SettingsScreen = () => {
    const { logout, user } = useAuthStore();
    const [isColorModalVisible, setColorModalVisible] = useState(false);

    return (
        <View className="flex-1 justify-between py-8 items-center bg-white animate-fade-in">
            <View className='flex-row items-center mb-5 w-full px-5'>
                <View className='rounded-full border-2 border-gray-600 p-2 mr-5'>
                    <Ionicons name="person-outline" size={40} color="black" />
                </View>
                <View>
                    <Text className="text-xl font-bold mb-2">{user?.name}</Text>
                    <Text className="text-md text-gray-600 font-semibold mb-2">{user?.email}</Text>
                </View>
            </View>


            <View className='w-full px-5 mb-5'>
                <Pressable className='flex-row items-center justify-between bg-gray-100 p-3 rounded-md mb-2 active:opacity-50' onPress={() => setColorModalVisible(true)}>
                    <Text className='text-md font-semibold'>Multicolor</Text>
                    <Ionicons name="chevron-forward-outline" size={24} color="black" />
                </Pressable>
            </View>


            <CustomButtonPrimary rounded title='Cerrar sesion' onPress={logout} />


            <View>
                <ModalMulticolor visible={isColorModalVisible} setVisible={setColorModalVisible} />
            </View>
        </View>
    );
};

export default SettingsScreen;
