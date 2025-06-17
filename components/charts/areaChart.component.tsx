import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import useStylesStore from 'store/styles/styles.store';

interface Props {
    title?: string;
    data: { value: number, label: string }[];
}

export default function AreaChartComponent({ title, data }: Props) {
    const { globalColor } = useStylesStore();
    const dynamicSpacing = data.length < 4 ? 120 : 40;
    return (
        <View className="p-2 px-8 items-center justify-center">
            {title &&
                <View className="mb-5 justify-center items-center">
                    <Text className="text-xl font-bold">
                        {title}
                    </Text>
                </View>
            }
            <View className='justify-center items-center w-full'>
                <LineChart
                    data={data}
                    curved
                    width={250}
                    thickness={2}
                    color={globalColor}
                    hideDataPoints={false}
                    dataPointsColor={globalColor}
                    yAxisColor="#ccc"
                    xAxisColor="#ccc"
                    areaChart
                    startFillColor={globalColor}
                    endFillColor={globalColor}
                    startOpacity={0.8}
                    endOpacity={0.1}
                    noOfSections={4}
                    spacing={dynamicSpacing}
                    rulesColor="#eee"
                />
            </View>
        </View>
    );
}
