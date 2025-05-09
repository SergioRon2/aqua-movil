import { CustomButtonPrimary } from 'components/buttons/mainButton.component';
import React, { useState } from 'react';
import { View, ScrollView, Dimensions, Text, Modal } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import useStylesStore from 'store/styles/styles.store';

const screenWidth = Dimensions.get('window').width;

interface Props {
    horizontalScroll?: boolean;
    title?: string;
    data: {
        labels: string[];
        datasets: {
            data: number[];
        }[];
    };
}

const BarChartComponent = ({ data, title, horizontalScroll }: Props) => {
    const { globalColor } = useStylesStore();

    const hasRealData = data.datasets[0].data.some(value => value > 0);

    const convertedData = hasRealData
        ? data.labels.map((label, index) => ({
            value: data.datasets[0].data[index],
            label,
            frontColor: globalColor,
        }))
        : [
            {
                label: 'Sin datos',
                value: 1,
                frontColor: '#e0e0e0',
            },
        ];

    // Evitar división por 0
    const averageLabelLength =
        data.labels.length > 0
            ? data.labels.reduce((acc, label) => acc + label.length, 0) / data.labels.length
            : 5;

    const barWidth = Math.min(Math.max(averageLabelLength * 5, 30), 80);

    const longestLabel = Math.max(...data.labels.map(label => label.length), 8);
    const chartWidth = Math.max(screenWidth, convertedData.length * 80 + longestLabel * 5);

    // Si no hay datos reales, usar 4 como máximo para stepValue
    const stepValue = Math.ceil((hasRealData ? Math.max(...data.datasets[0].data) : 4) / 4);

    return (
        <View className="animate-fade-in w-full">
            {title && (
                <Text className="text-center font-bold text-xl">{title}</Text>
            )}
            <ScrollView horizontal={horizontalScroll} showsHorizontalScrollIndicator={false}>
                <BarChart
                    data={convertedData}
                    barWidth={barWidth}
                    spacing={30}
                    barBorderTopLeftRadius={18}
                    barBorderTopRightRadius={18}
                    barBorderRadius={2}
                    yAxisThickness={1}
                    xAxisThickness={1}
                    xAxisColor="#ccc"
                    yAxisColor="#ccc"
                    yAxisTextStyle={{ color: '#333' }}
                    xAxisLabelTextStyle={{
                        color: '#333',
                        fontSize: 12,
                        fontWeight: 'bold',
                        width: barWidth + 30,
                        textAlign: 'center',
                        numberOfLines: 2,
                    }}
                    stepValue={stepValue}
                    showValuesAsTopLabel
                    isAnimated
                    width={chartWidth}
                    height={250}
                />
            </ScrollView>
        </View>
    );

};

export default BarChartComponent;
