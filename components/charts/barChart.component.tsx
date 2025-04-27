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
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    fillShadowGradient: "#db2777",
    fillShadowGradientOpacity: 1,
    color: (opacity = 1) => `#db2777`,
    labelColor: (opacity = 0.8) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 1.4,
    propsForBackgroundLines: {
        stroke: "#e3e3e3",
        fontSize: 12,
        strokeWidth: 2
    },
    propsForLabels: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333"
    },
    propsForYAxis: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#333"
    }
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
                    marginVertical: 20,
                    paddingVertical: 40,
                    shadowColor: '#000',          
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.2,
                    shadowRadius: 5,
                    borderRadius: 10,              
                    backgroundColor: 'white',
                }}
            />
        </View>
    );
};


export default BarChartComponent;
