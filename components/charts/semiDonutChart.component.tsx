import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const SemiDonutChart = ({
    percentage = 100,
    radius = 80,
    strokeWidth = 20,
    max = 100,
}) => {
    const diameter = radius * 2;
    const adjustedHeight = radius + strokeWidth; // más alto para que no se corte
    const circleCircumference = Math.PI * radius;
    const percentageValue = (percentage > max ? max : percentage) * circleCircumference / max;
    const strokeDashoffset = circleCircumference - percentageValue;

    return (
        <View className='animate-fade-in' style={styles.container}>
            <Svg width={diameter + strokeWidth * 2} height={adjustedHeight}>
                <Defs>
                    <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                        <Stop offset="0%" stopColor="#db2777" />
                        <Stop offset="100%" stopColor="#b90555" />
                    </LinearGradient>
                </Defs>

                {/* Fondo */}
                <Circle
                    cx={diameter / 2 + strokeWidth}
                    cy={radius + strokeWidth}
                    r={radius}
                    stroke="#f0f0f0"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${circleCircumference}, ${circleCircumference}`}
                    strokeDashoffset={0}
                    fill="transparent"
                    rotation="-180"
                    origin={`${diameter / 2 + strokeWidth}, ${radius + strokeWidth}`}
                    strokeLinecap="round"
                />

                {/* Progreso */}
                <Circle
                    cx={diameter / 2 + strokeWidth}
                    cy={radius + strokeWidth}
                    r={radius}
                    stroke="url(#grad)"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${circleCircumference}, ${circleCircumference}`}
                    strokeDashoffset={strokeDashoffset}
                    fill="transparent"
                    rotation="-180"
                    origin={`${diameter / 2 + strokeWidth}, ${radius + strokeWidth}`}
                    strokeLinecap="round"
                />
                <View style={[styles.textContainer, { top: radius / 2 + strokeWidth }]}>
                    <Text style={styles.percentageText}>{percentage}%</Text>
                </View>
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    textContainer: {
        position: 'relative',
        alignItems: 'center',
    },
    percentageText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#4a4a4a',
    },
});

export default SemiDonutChart;
