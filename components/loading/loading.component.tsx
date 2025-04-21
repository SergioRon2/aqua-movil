import { useEffect, useRef } from "react";
import { View, Image, Animated } from "react-native"


export const Loading = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );

        loop.start();

        return () => loop.stop();
    }, [fadeAnim]);

    return (
        <View className="flex-1 justify-center items-center">
            <Animated.Image source={require('../../assets/img/logo.png')} style={{ opacity: fadeAnim }} />
        </View>
    )
}