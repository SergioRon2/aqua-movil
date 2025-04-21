import React from 'react';
import { View, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

interface Props {
    data: {
        labels: string[],
        datasets: {
            data: number[]
        }[]
    }
}

const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    fillShadowGradient: "#db2777",
    fillShadowGradientOpacity: 1,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 0.6,
    propsForBackgroundLines: {
        stroke: "#e3e3e3"
    },
};

const BarChartComponent = ({ data }: Props) => {
    return (
        <View>
            <BarChart
                data={data}
                width={screenWidth * 0.9}
                height={250}
                fromZero
                showValuesOnTopOfBars
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={chartConfig}
                style={{
                    marginVertical: 16,
                    borderRadius: 16,
                }}
            />
        </View>
    );
};

export default BarChartComponent;
