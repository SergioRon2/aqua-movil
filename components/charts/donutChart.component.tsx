import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const DonutChart = ({
    data = [
        { value: 5, color: '#3498db' },
        { value: 10, color: '#2ecc71' },
        { value: 5, color: '#5d23ac' },
        { value: 10, color: '#9987ac' },
        { value: 20, color: '#23778a' },
        { value: 10, color: '#ddd124' },
        { value: 5, color: '#1220cd' },
        { value: 10, color: '#eeddcc' },
        { value: 25, color: '#e74c3c' }
    ], // [{ value: number, color: string }]
    radius = 60,
    strokeWidth = 15,
}) => {
    const circumference = 2 * Math.PI * radius;
    const center = radius + strokeWidth; 

    const totalValue = data.reduce((sum, item) => sum + item.value, 0);

    if (totalValue !== 100) {
        data = data.map(item => ({
            ...item,
            value: (item.value / totalValue) * 100, 
        }));
    }

    let offset = 0;

    return (
        <View style={styles.container}>
            <Svg width={center * 2} height={center * 2}>
                {/* Fondo gris */}
                <Circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="#eee"
                    strokeWidth={strokeWidth}
                    fill="none"
                />

                {/* Ciclo sobre los datos para crear cada sección */}
                {data.map((item, index) => {
                    const strokeDasharray = (item.value / 100) * circumference; 
                    const strokeDashoffset = circumference - (offset + strokeDasharray); 

                    offset += strokeDasharray;

                    return (
                        <Circle
                            key={index}
                            cx={center}
                            cy={center}
                            r={radius}
                            stroke={item.color}
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeDasharray={`${strokeDasharray} ${circumference}`} 
                            strokeDashoffset={strokeDashoffset} 
                            rotation="-90"
                            origin={`${center}, ${center}`}
                        />
                    );
                })}
                <Text style={[styles.label, { top: center - 15 }]}>
                    {totalValue}%
                </Text>
            </Svg>

            {/* Leyendas debajo del gráfico */}
            <View style={styles.legendContainer}>
                {data.map((item, index) => (
                    <View key={index} style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                        <Text>{`${item.value}%`}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    legendContainer: {
        marginTop: 15,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 5,
        gap: 10
    },
    legendColor: {
        width: 20,
        height: 20,
        borderRadius: 50, 
    },
    label: {
        // position: 'absolute',
        margin: 'auto',
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default DonutChart;
