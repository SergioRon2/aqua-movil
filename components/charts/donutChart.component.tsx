import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import useInternetStore from 'store/internet/internet.store';
import useStylesStore from 'store/styles/styles.store';
import { getRandomColor } from 'utils/getRandomColor';

// const getRandomColor = () => {
//     const letters = '0123456789ABCDEF';
//     let color = '#';
//     for (let i = 0; i < 6; i++) {
//         color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
// };

type DonutDataItem = {
    label: string;
    value: number;
};

type DonutChartProps = {
    data: DonutDataItem[];
    radius?: number;
    strokeWidth?: number;
    dataRow?: boolean;
    height?: number;
    amount?: number;
};

const DonutChartComponent: React.FC<DonutChartProps> = ({
    data,
    radius = 80,
    strokeWidth = 20,
    dataRow,
    height,
    amount
}) => {
    const { globalColor } = useStylesStore();
    const { online } = useInternetStore();
    const chartData = data.map(item => ({
        value: item.value,
        color: getRandomColor(globalColor),
        text: item.label,
    }));

    const hasData = chartData.length > 0 && chartData.reduce((sum, item) => sum + item.value, 0) > 0;

    return (
        <View style={[styles.container, { height: height }]} className={`animate-fade-in gap-4 ${dataRow ? 'flex-row items-center' : 'flex-col'}`}>
            {hasData ? (
                <PieChart
                    data={chartData}
                    donut
                    radius={radius}
                    innerRadius={radius - strokeWidth}
                    textColor="#000"
                    textSize={14}
                    centerLabelComponent={() => (
                        <View className='flex flex-col items-center justify-center'>
                            <Text style={styles.centerText}>{amount ? amount : data?.length}</Text>
                            <Text style={styles.centerText}>Proyectos</Text >
                        </View>
                    )}
                />
            ) : (
                <View className='flex flex-col items-center justify-center py-12'>
                    <Text className='text-lg'>No hay datos {!online && 'sin conexion'}</Text>
                </View>
            )}
            <View className=''>
                {
                    hasData &&
                    data.map((item, index) => (
                        <View key={index} style={styles.legendItem}>
                            <View style={[styles.colorBox, { backgroundColor: chartData[index].color || '#ccc' }]} />
                            <Text style={styles.legendText}>
                                {`${item.label}: ${item.value.toFixed(1)}%`}
                            </Text>
                        </View>
                    ))}
            </View>
        </View>
    );
};

export default React.memo(DonutChartComponent);

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
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
