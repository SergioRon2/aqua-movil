import React from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const data = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
        {
            data: [50, 70, 40, 95, 85, 60],
            color: (opacity = 1) => `rgba(0, 128, 255, ${opacity})`, // Color de la línea
            strokeWidth: 2,
        },
    ],
};

const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Color del texto y ejes
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    fillShadowGradient: "#007bff", // Color del relleno debajo de la línea
    fillShadowGradientOpacity: 0.3, // Opacidad del relleno
    strokeWidth: 2,
    propsForDots: {
        r: "4",
        strokeWidth: "2",
        stroke: "#007bff",
    },
};

const AreaChartComponent = () => {
    return (
        <View>
            <LineChart
                data={data}
                width={screenWidth * 0.9}
                height={250}
                chartConfig={chartConfig}
                bezier
                style={{
                    marginVertical: 16,
                    borderRadius: 16,
                    marginHorizontal: 16,
                }}
            />
        </View>
    );
};

export default AreaChartComponent;
