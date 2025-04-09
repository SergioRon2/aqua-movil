import React from 'react';
import { View, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const data = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
        {
            data: [20, 45, 28, 80, 99, 43]
        }
    ]
};

const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    fillShadowGradient: "#34a853", // color de las barras
    fillShadowGradientOpacity: 1,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // color del texto
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 0.6,
    propsForBackgroundLines: {
        stroke: "#e3e3e3"
    },
};

const BarChartComponent = () => {
    return (
        <View>
            <BarChart
            data={data}
            width={screenWidth * 0.9} // Adjusted for responsiveness
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
