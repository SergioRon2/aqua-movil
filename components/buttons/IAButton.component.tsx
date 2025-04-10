import React, { useState } from 'react';
import { Pressable, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const IAButton = () => {
    const [active, setActive] = useState<boolean>(false)

    const onPress = () => {
        setActive(!active);
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
                        <Pressable className="border-b border-gray-200 p-2 rounded-lg" onPress={() => console.log('Option 1 selected')}>
                            <Text className="text-gray-700">Option 1</Text>
                        </Pressable>
                        <Pressable className="border-b border-gray-200 p-2 rounded-lg" onPress={() => console.log('Option 2 selected')}>
                            <Text className="text-gray-700">Option 2</Text>
                        </Pressable>
                        <Pressable className="border-b border-gray-200 p-2 rounded-lg" onPress={() => console.log('Option 3 selected')}>
                            <Text className="text-gray-700">Option 3</Text>
                        </Pressable>
                        <Pressable className="border-b border-gray-200 p-2 rounded-lg" onPress={() => console.log('Option 4 selected')}>
                            <Text className="text-gray-700">Option 4</Text>
                        </Pressable>
                        <Pressable className="border-b border-gray-200 p-2 rounded-lg" onPress={() => console.log('Option 5 selected')}>
                            <Text className="text-gray-700">Option 5</Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </>
    );
};

export default IAButton;