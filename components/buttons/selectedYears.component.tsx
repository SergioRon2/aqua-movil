import { useState } from "react";
import { Pressable, View, Text } from "react-native"

export const SelectedYears = () => {
    const [selected, setSelected] = useState<number>(1);

    return (
        <View className={`flex-row w-full px-3 bg-gray-200 mx-auto my-4 justify-center items-center animate-fade-in`}>
            <Pressable onPress={() => setSelected(1)} className={`${selected === 1 ? 'border-b-2 border-pink-600' : 'bg-transparent'} px-6 w-1/3 rounded-sm`}>
                <Text className={`${selected === 1 ? 'text-pink-600' : 'text-black'} text-xl font-bold text-center`}>2023</Text>
            </Pressable>
            <Pressable onPress={() => setSelected(2)} className={`${selected === 2 ? 'border-b-2 border-pink-600' : 'bg-transparent'} px-6 w-1/3 rounded-sm`}>
                <Text className={`${selected === 2 ? 'text-pink-600' : 'text-black'} text-xl font-bold text-center`}>2024</Text>
            </Pressable>
            <Pressable onPress={() => setSelected(3)} className={`${selected === 3 ? 'border-b-2 border-pink-600' : 'bg-transparent'} px-6 w-1/3 rounded-sm`}>
                <Text className={`${selected === 3 ? 'text-pink-600' : 'text-black'} text-xl font-bold text-center`}>2025</Text>
            </Pressable>
        </View>
    )
}