import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import useStylesStore from 'store/styles/styles.store';

type SemiDonutChartProps = {
    percentage?: number;
    max?: number;
    radius?: number;
    strokeWidth?: number;
    height?: number;
    width?: number;
    color?: string;
    fontSize?: number;
    marginTop?: number;
};

const SemiDonutChart: React.FC<SemiDonutChartProps> = ({
    percentage = 20,
    max = 100,
    radius = 80,
    strokeWidth = 20,
    height = 150,
    // width = 150,
    fontSize = 24,
    color,
    marginTop = 10
}) => {
    const { globalColor } = useStylesStore();
    const clampedPercentage = Math.min(percentage, max);
    const remainder = max - clampedPercentage;

    const data = [
        {
            value: clampedPercentage,
            color: color || globalColor,
        },
        {
            value: remainder,
            color: '#f0f0f0',
        },
    ];

    return (
        <View style={[styles.container, { height, width: radius * 2 }]}>
            <PieChart
                donut
                semiCircle
                showText={false}
                data={data}
                radius={radius}
                innerRadius={radius - strokeWidth}
                centerLabelComponent={() => (
                    <Text style={[styles.percentageText, { fontSize: fontSize, marginTop }]}>
                        {`${clampedPercentage.toFixed()}%`}
                    </Text>
                )
                }
            />
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    percentageText: {
        fontWeight: '600',
        color: '#4a4a4a',
    },
});

export default SemiDonutChart;
