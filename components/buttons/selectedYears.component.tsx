import { useState } from "react";
import { Pressable, View, Text } from "react-native"
import useStylesStore from "store/styles/styles.store";

export const SelectedYears = () => {
    const {globalColor} = useStylesStore()
    const [selected, setSelected] = useState<number>(1);

    return (
        <View className={`flex-row w-full px-3 bg-gray-200 mx-auto my-4 justify-center items-center animate-fade-in`}>
            <Pressable style={selected === 1 && {borderColor: globalColor}} onPress={() => setSelected(1)} className={`${selected === 1 ? 'border-b-2' : 'bg-transparent'} px-6 w-1/3 rounded-sm`}>
                <Text className={`text-black text-xl font-bold text-center`}>2023</Text>
            </Pressable>
            <Pressable style={selected === 2 && {borderColor: globalColor}} onPress={() => setSelected(2)} className={`${selected === 2 ? 'border-b-2' : 'bg-transparent'} px-6 w-1/3 rounded-sm`}>
                <Text className={`text-black text-xl font-bold text-center`}>2024</Text>
            </Pressable>
            <Pressable style={selected === 3 && {borderColor: globalColor}} onPress={() => setSelected(3)} className={`${selected === 3 ? 'border-b-2' : 'bg-transparent'} px-6 w-1/3 rounded-sm`}>
                <Text className={`text-black text-xl font-bold text-center`}>2025</Text>
            </Pressable>
        </View>
    )
}