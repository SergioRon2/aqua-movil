import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useActiveStore from 'store/actives/actives.store';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { SelectedDevelopmentPlan } from 'components/buttons/selectedDevelopmentPlan';
import useStylesStore from 'store/styles/styles.store';

export const Navbar = () => {
    const { globalColor } = useStylesStore()
    const { searchActive, setSearchActive } = useActiveStore();
    const height = useSharedValue(80);
    const rotation = useSharedValue(0);
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

    const animatedRotationStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    rotate: `${rotation.value}deg`,
                },
            ],
        };
    });

    return (
        <Animated.View
            className="w-full h-auto rounded-b-3xl justify-center items-center py-4"
            style={[animatedStyle, { backgroundColor: globalColor }]}
        >

            {searchActive &&
                <Pressable onPress={handleSearchScreen} className='border border-white rounded-full p-2 w-2/3 px-4 active:opacity-50'>
                    <Text className='text-white text-lg'>Búsqueda de proyectos ✨</Text>
                </Pressable>
            }

            <View className='flex-row w-full px-5 gap-4 items-center justify-center mt-3'>
                <Pressable
                    onPress={() => {
                        rotation.value = withTiming(rotation.value + 360, {
                            duration: 500,
                        });
                    }}
                >
                    <Animated.View
                        style={[
                            {
                                backgroundColor: globalColor,
                            },
                            animatedRotationStyle,
                        ]}
                        className="w-16 h-16 justify-center items-center rounded-full"
                    >
                        <Image
                            className="w-16 h-16"
                            source={require('../../assets/img/logo-bg-remove-white.png')}
                        />
                    </Animated.View>
                </Pressable>

                <SelectedDevelopmentPlan />

                <TouchableOpacity
                    onPress={() => setSearchActive(!searchActive)}
                    className="ml-auto w-1/5 py-2 border border-white justify-center items-center rounded-full"
                >
                    <Ionicons name="search" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};  
