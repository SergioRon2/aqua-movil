import { SearchInput } from 'components/inputs/searchInput.component';
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';

export const Navbar = () => {
    const [selected, setSelected] = useState<number>(2)
    useEffect(() => console.log({selected}), [selected])
    return (
        <View className='bg-pink-600 h-40 py-4 rounded-b-3xl justify-around items-center'>
            <SearchInput />
            <View className={`flex-row w-3/4 justify-center border-2 border-white items-center animate-fade-in`}>
                <Pressable onPress={() => setSelected(1)} className={`${selected === 1 ? 'bg-white' : 'bg-transparent'} border-r-2 border-white px-6 py-2 w-1/2`}>
                    <Text className={`${selected === 1 ? 'text-pink-600' : 'text-white'} text-xl font-bold text-center`}>Gobernador 1</Text>
                </Pressable>
                <Pressable onPress={() => setSelected(2)} className={`${selected === 2 ? 'bg-white' : 'bg-transparent'} border-l-2 border-white px-6 py-2 w-1/2`}>
                    <Text className={`${selected === 2 ? 'text-pink-600' : 'text-white'} text-xl font-bold text-center`}>Gobernador 2</Text>
                </Pressable>
            </View>
        </View>
    );
};  
