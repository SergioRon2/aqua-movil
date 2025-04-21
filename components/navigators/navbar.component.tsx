import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useActiveStore from 'store/actives/actives.store';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { SelectedDevelopmentPlan } from 'components/buttons/selectedDevelopmentPlan';

export const Navbar = () => {
    const [selected, setSelected] = useState<number>(2)
    const { searchActive, setSearchActive } = useActiveStore();
    const height = useSharedValue(80);
    const navigation = useNavigation();
    
    useEffect(() => {
        height.value = withTiming(searchActive ? 140 : 80, {
            duration: 100,
        });
    }, [searchActive]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            height: height.value,
        };
    });

    const handleSearchScreen = () => {
        navigation.navigate('SearchScreen')
    }


    return (
        <Animated.View
            className="bg-pink-600 w-full h-auto rounded-b-3xl justify-center items-center"
            style={animatedStyle}
        >

            {searchActive &&
                <Pressable onPress={handleSearchScreen} className='border-2 border-white rounded-full p-2 w-2/3 px-4 active:opacity-50'>
                    <Text className='text-white font-bold text-xl'>Filtro de busqueda</Text>
                </Pressable>
            }

            <View className='flex-row w-4/5 gap-4 items-center justify-center'>
                <SelectedDevelopmentPlan />

                <TouchableOpacity
                    onPress={() => setSearchActive(!searchActive)}
                    className="ml-auto w-1/5 py-2 border-2 border-white justify-center items-center rounded-full"
                >
                    <Ionicons name="search" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};  
