import React, { useState } from 'react';
import { Pressable, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const options = [
    { id: 1, label: 'Option 1' },
    { id: 2, label: 'Option 2' },
    { id: 3, label: 'Option 3' },
    { id: 4, label: 'Option 4' },
    { id: 5, label: 'Option 5' },
]

const IAButton = () => {
    const [active, setActive] = useState<boolean>(false)
    const navigation = useNavigation();

    const onPress = () => {
        setActive(!active);
    };

    const onOptionPress = (option: string) => {
        console.log(`Selected option: ${option}`);
        navigation.navigate('ChatbotScreen', { option });
    };

    return (
        <>
            <Pressable className="bg-pink-600 p-4 rounded-full absolute bottom-20 right-4 z-50 flex items-center justify-center" onPress={onPress}>
                <Ionicons name="chatbubble-ellipses-outline" size={24} color="white" />
            </Pressable>

            {active && (
                <View className={`bg-white p-4 rounded-lg absolute bottom-32 right-8 z-40 w-72 h-80 border border-gray-300 shadow-md`}>
                    <Text className="text-black">Hola, como puedo asistirte hoy?</Text>
                    <View className="mt-4 gap-2">
                        {options.map((option) => (
                            <Pressable key={option.id} className="border-b border-gray-200 p-2 rounded-lg" onPress={() => onOptionPress(option.label)}>
                                <Text className="text-black">{option.label}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>
            )}
        </>
    );
};

export default IAButton;