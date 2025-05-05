import React from 'react';
import { View, Dimensions, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import useStylesStore from 'store/styles/styles.store';

interface Props {
    title?: string;
}

const screenWidth = Dimensions.get('window').width;

const AreaChartComponent = ({ title }: Props) => {
    const {globalColor} = useStylesStore()
    const data = {
        labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
        datasets: [
            {
                data: [50, 70, 40, 95, 85, 60],
                color: (opacity = 1) => globalColor, // Color de la línea
                strokeWidth: 2,
            },
        ],
    };

    const chartConfig = {
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Color del texto y ejes
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        fillShadowGradient: globalColor, // Color del relleno debajo de la línea
        fillShadowGradientOpacity: 0.3, // Opacidad del relleno
        strokeWidth: 4,
        propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: globalColor,
        },
    };

    return (
        <View className='border border-gray-300 rounded-lg animate-fade-in'>
            <Text className='text-xl font-bold'>{title}</Text>
            <LineChart
                data={data}
                width={screenWidth * 0.9}
                height={250}
                chartConfig={chartConfig}
                bezier
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

export default AreaChartComponent;
