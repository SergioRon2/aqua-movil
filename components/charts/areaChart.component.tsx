import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Svg from 'react-native-svg';
import useStylesStore from 'store/styles/styles.store';
import { formatNumberWithSuffix } from 'utils/formatNumberWithSuffix';

interface Props {
    title?: string;
    data: { value: number, label: string }[];
}

export default function AreaChartComponent({ title, data }: Props) {
    const { globalColor } = useStylesStore();
    const screenWidth = Dimensions.get('window').width;

    const chartData = {
        labels: data.map(item => item.label),
        datasets: [
            {
                data: data.map(item => item.value),
                color: () => globalColor,
                strokeWidth: 2,
            },
        ],
    };

    return (
        <View className="p-2 px-8 items-center justify-center">
            {title &&
                <View className="mb-5 justify-center items-center">
                    <Text className="text-xl font-bold">
                        {title}
                    </Text>
                </View>
            }
            {data.length === 0 ? (
                <View className="justify-center items-center w-full h-40">
                    <Text className="text-gray-400">No hay datos para mostrar 🔍</Text>
                </View>
            ) : (
                <View className="justify-center items-center w-full">
                    <LineChart
                        data={chartData}
                        width={screenWidth * 0.85}
                        height={230}
                        withShadow
                        withDots
                        bezier
                        fromZero
                        withInnerLines={true}
                        yAxisLabel=""
                        chartConfig={{
                            backgroundGradientFrom: '#ffffff',
                            backgroundGradientTo: '#ffffff',
                            decimalPlaces: 0,
                            color: () => globalColor,
                            labelColor: () => '#555',
                            style: {
                                borderRadius: 12,
                                paddingTop: 40,
                                paddingBottom: 40,
                            },
                            propsForHorizontalLabels: {
                                fontSize: '8',
                                fontWeight: 'bold',
                            },
                            propsForDots: {
                                r: '4',
                                strokeWidth: '2',
                                stroke: globalColor,
                            },
                        }}
                        style={{
                            borderRadius: 16,
                        }}
                    />
                </View>
            )}
        </View>
    );
}
