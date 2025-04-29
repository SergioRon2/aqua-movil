import React from 'react';
import { View, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const data = [
    {
        name: "Comida",
        population: 45,
        color: "#f44336",
        legendFontColor: "#7F7F7F",
        legendFontSize: 14
    },
    {
        name: "Transporte",
        population: 25,
        color: "#2196f3",
        legendFontColor: "#7F7F7F",
        legendFontSize: 14
    },
    {
        name: "Casa",
        population: 15,
        color: "#4caf50",
        legendFontColor: "#7F7F7F",
        legendFontSize: 14
    },
    {
        name: "Otros",
        population: 15,
        color: "#ff9800",
        legendFontColor: "#7F7F7F",
        legendFontSize: 14
    }
];

const PieChartComponent = () => {
    return (
        <View className='animate-fade-in'>
            <PieChart
                data={data}
                width={screenWidth * 0.9}
                height={250}
                chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor={"population"} // valor numérico que se representa en el gráfico
                backgroundColor={"transparent"}
                paddingLeft={"16"}
                center={[10, 10]}
                absolute // muestra números absolutos en lugar de porcentajes
                style={{
                    marginVertical: 16,
                    borderRadius: 16,
                    marginHorizontal: 16,
                }}
            />
        </View>
    );
};

export default PieChartComponent;
