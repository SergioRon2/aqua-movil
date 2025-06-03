import React, { useEffect, useRef } from 'react';
import { View, Pressable, Animated } from 'react-native';
import useStylesStore from 'store/styles/styles.store';

export const CardLoading = () => {
    const { globalColor } = useStylesStore();
    const opacityAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const blink = Animated.loop(
            Animated.sequence([
                Animated.timing(opacityAnim, {
                    toValue: 0.3,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ])
        );
        blink.start();

        return () => blink.stop();
    }, []);

    return (
        <Pressable className="flex-row h-40 w-11/12 rounded-2xl justify-center items-center mx-auto mt-5 shadow-lg">
            <View
                style={{ backgroundColor: globalColor }}
                className="w-1/2 h-full rounded-l-2xl justify-center gap-2 items-center"
            >
                <Animated.View
                    style={{ opacity: opacityAnim }}
                    className="w-4/5 h-5 rounded-full mb-2 bg-white"
                />
            </View>
            <View
                style={{ borderColor: globalColor }}
                className="w-1/2 bg-white border rounded-r-2xl p-5 h-full justify-center gap-4 items-center"
            >
                <Animated.View
                    style={{ backgroundColor: globalColor, opacity: opacityAnim }}
                    className="w-3/5 h-4 rounded mb-2"
                />
                <Animated.View
                    style={{ backgroundColor: globalColor, opacity: opacityAnim }}
                    className="w-2/5 h-4 rounded"
                />
            </View>
        </Pressable>
    );
};
