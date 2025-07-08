import React, { useState } from 'react';
import { Pressable, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useStylesStore from 'store/styles/styles.store';


const IAButton = () => {
    const {globalColor} = useStylesStore()
    const navigation = useNavigation();

    const onPress = () => {
        navigation.navigate('ChatbotScreen');
    };

    return (
        <>
            <Pressable style={{backgroundColor: globalColor}} className="p-4 rounded-full absolute bottom-20 right-4 z-50 flex items-center justify-center" onPress={onPress}>
                <Ionicons name="chatbubble-ellipses-outline" size={24} color="white" />
            </Pressable>
        </>
    );
};

export default IAButton;