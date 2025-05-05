import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import useStylesStore from 'store/styles/styles.store';

type SemiDonutChartProps = {
    percentage?: number;
    max?: number;
    radius?: number;
    strokeWidth?: number;
};

const SemiDonutChart: React.FC<SemiDonutChartProps> = ({
    percentage = 20,
    max = 100,
    radius = 80,
    strokeWidth = 20,
}) => {
    const { globalColor } = useStylesStore();
    const clampedPercentage = Math.min(percentage, max);
    const remainder = max - clampedPercentage;

    const data = [
        {
            value: clampedPercentage,
            color: globalColor,
        },
        {
            value: remainder,
            color: '#f0f0f0',
        },
    ];

    return (
        <View style={styles.container}>
            <PieChart
                donut
                semiCircle
                showText={false}
                data={data}
                radius={radius}
                innerRadius={radius - strokeWidth}
                centerLabelComponent={() => (
                    <Text style={styles.percentageText}>{`${clampedPercentage}%`}</Text>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    percentageText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#4a4a4a',
        marginTop: 10, // ajusta esto si quieres mover el texto más al centro
    },
});

export default SemiDonutChart;
