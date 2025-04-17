import { SearchInput } from 'components/inputs/searchInput.component';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useActiveStore from 'store/actives/actives.store';

export const Navbar = () => {
    const [selected, setSelected] = useState<number>(2)
    const { searchActive, setSearchActive } = useActiveStore();
    const heightAnim = useRef(new Animated.Value(80)).current;

    useEffect(() => {
        if (searchActive) {
            Animated.parallel([
                Animated.timing(heightAnim, {
                    toValue: 160,
                    duration: 150,
                    useNativeDriver: false,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(heightAnim, {
                    toValue: 80,
                    duration: 150,
                    useNativeDriver: false,
                }),
            ]).start();
        }
    }, [searchActive]);


    return (
        <Animated.View 
            className="bg-pink-600 w-full rounded-b-3xl justify-center items-center"
            style={{ height: heightAnim }}
        >

            {searchActive &&
                <SearchInput />
            }

            <View className='flex-row w-4/5 gap-4'>
                <View className={`flex-row w-4/5 justify-center border-2 border-white items-center animate-fade-in`}>
                    <Pressable onPress={() => setSelected(1)} className={`${selected === 1 ? 'bg-white' : 'bg-transparent'} border-white px-6 py-2 w-1/2`}>
                        <Text className={`${selected === 1 ? 'text-pink-600' : 'text-white'} text-xl font-bold text-center`}>1</Text>
                    </Pressable>
                    <Pressable onPress={() => setSelected(2)} className={`${selected === 2 ? 'bg-white' : 'bg-transparent'} border-white px-6 py-2 w-1/2`}>
                        <Text className={`${selected === 2 ? 'text-pink-600' : 'text-white'} text-xl font-bold text-center`}>2</Text>
                    </Pressable>
                </View>

                <TouchableOpacity
                    onPress={() => setSearchActive(!searchActive)}
                    className="h-auto ml-auto w-1/5 border-2 border-white justify-center items-center rounded-full"
                >
                    <Ionicons name="search" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};  
