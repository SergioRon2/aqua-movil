import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

type DonutDataItem = {
    label: string;
    value: number;
    color: string;
};

type DonutChartProps = {
    data: DonutDataItem[];
    radius?: number;
    strokeWidth?: number;
};

const DonutChartComponent: React.FC<DonutChartProps> = ({
    data,
    radius = 80,
    strokeWidth = 20,
}) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    const chartData = data.map(item => ({
        value: item.value,
        color: item.color,
        text: item.label,
    }));

    return (
        <View style={styles.container} className='animate-fade-in'>
            <PieChart
                data={chartData}
                donut
                radius={radius}
                innerRadius={radius - strokeWidth}
                textColor="#000"
                textSize={14}
                centerLabelComponent={() => (
                    <View className='flex flex-col items-center justify-center'>
                        <Text style={styles.centerText}>{data.length}</Text>
                        <Text style={styles.centerText}>Proyectos</Text >
                    </View>
                )}
            />
            <View style={styles.legendContainer}>
                {data.map((item, index) => (
                    <View key={index} style={styles.legendItem}>
                        <View style={[styles.colorBox, { backgroundColor: item.color }]} />
                        <Text style={styles.legendText}>
                            {`${item.label}: ${item.value.toFixed(1)}%`}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default DonutChartComponent;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: 20,
    },
    centerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    legendContainer: {
        marginTop: 20,
        width: '80%',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    colorBox: {
        width: 16,
        height: 16,
        borderRadius: 4,
        marginRight: 8,
    },
    legendText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
});
