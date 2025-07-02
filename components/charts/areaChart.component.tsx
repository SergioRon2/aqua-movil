import { CustomButtonPrimary } from 'components/buttons/mainButton.component';
import { useState } from 'react';
import { View, Text, Dimensions, Modal } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import useInternetStore from 'store/internet/internet.store';
import useStylesStore from 'store/styles/styles.store';

interface Props {
    title?: string;
    data: { frontValue: number, backValue: number, label: string }[];
}

export default function AreaChartComponent({ title, data }: Props) {
    const { globalColor } = useStylesStore();
    const {online} = useInternetStore();
    const screenWidth = Dimensions.get('window').width;
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState<{value: number, type: string, label: string} | null>(null);
    const sortedData = [...data].sort((a, b) => {
        const parseDate = (label: string) => {
            const parts = label.includes('-') ? label.split('-') : label.split('/');

            if (parts.length < 3) return new Date(0);

            let day, month, year;

            if (Number(parts[0]) > 31) {
                // Formato yyyy-mm-dd
                [year, month, day] = parts.map(Number);
            } else {
                // Formato dd-mm-yyyy
                [day, month, year] = parts.map(Number);
            }

            return new Date(year, month - 1, day);
        };

        const dateA = parseDate(a.label);
        const dateB = parseDate(b.label);

        return dateA.getTime() - dateB.getTime();
    });

    console.log(sortedData.map((item: any) => item.label));

    const sortedFront = sortedData;
    const sortedBack = sortedData;

    const monthNames = [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];

    const formatLabel = (label: string) => {
        const parts = label.includes('-') ? label.split('-') : label.split('/');
        if (parts.length < 3) return label;

        let day, month, year;
        if (Number(parts[0]) > 31) {
            // yyyy-mm-dd
            [year, month, day] = parts.map(Number);
        } else {
            // dd-mm-yyyy
            [day, month, year] = parts.map(Number);
        }
        if (!month || !year) return label;
        // Devuelve solo el nombre del mes
        return monthNames[month - 1] || label;
    };

    const legendLabels = ['Actual', 'Proyectado'];

    const chartData = {
        labels: sortedFront.map(item => formatLabel(item?.label)),
        datasets: [
            {
                data: sortedFront.map(item => item?.frontValue),
                color: () => globalColor,
                strokeWidth: 2,
                datasetIndex: 0
            },
            {
                data: sortedBack.map(item => item?.backValue),
                color: () => '#22c55e',
                withShadow: true,
                strokeWidth: 4,
                datasetIndex: 1
            },
        ],
        legend: legendLabels,
    };

    const hasChartData =
        Array.isArray(sortedFront) &&
        sortedFront.length > 0 &&
        sortedFront.every(item => typeof item?.frontValue === 'number') &&
        Array.isArray(sortedBack) &&
        sortedBack.length > 0 &&
        sortedBack.every(item => typeof item?.backValue === 'number');


    console.log(chartData.datasets[0].data, chartData.datasets[1].data);

    return (
        <View className="p-2 px-8 items-center justify-center">
            {title &&
                <View className="mb-5 justify-center items-center">
                    <Text className="text-xl font-bold">
                        {title}
                    </Text>
                </View>
            }
            {!hasChartData ? (
                <View className="justify-center items-center w-full h-40">
                    <Text className="text-gray-400">No hay datos para mostrar {!online && 'sin conexion'} 🔍</Text>
                </View>
            ) : (
                <View className="justify-center items-center w-full">
                    <LineChart
                        data={chartData}
                        width={screenWidth * 0.85}
                        height={230}
                        withDots
                        withShadow={false}
                        fromZero
                        transparent
                        onDataPointClick={(data: any) => {
                            const label = legendLabels[chartData.datasets.indexOf(data.dataset)];
                            setModalVisible(true);
                            setSelectedValue({ value: data.value, type: label, label: sortedData[data.index]?.label });
                        }}
                        withInnerLines={true}
                        yAxisLabel=""
                        chartConfig={{
                            backgroundGradientFrom: '#ffffff',
                            backgroundGradientTo: '#ffffff',
                            decimalPlaces: 0,
                            color: () => globalColor,
                            labelColor: () => '#555',
                            style: {
                                borderRadius: 12,
                                paddingTop: 40,
                                paddingBottom: 40,
                            },
                            propsForHorizontalLabels: {
                                fontSize: '12',
                                fontWeight: 'bold',
                            },
                            propsForDots: {
                                r: '5',
                            },
                        }}
                        style={{
                            borderRadius: 16,
                        }}
                    />
                    <Modal
                        visible={modalVisible}
                        transparent
                        animationType="fade"
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View className="flex-1 justify-center items-center bg-black/50">
                            <View className="bg-white w-3/4 h-auto p-6 rounded-xl items-center justify-center gap-4">
                                <Text className="text-lg font-bold">
                                    Valor {selectedValue?.type} del 
                                </Text>
                                <Text style={{color: selectedValue?.type == 'Actual' ? globalColor : '#16a34a'}} className={`text-6xl font-bold`}>
                                    {selectedValue?.value}%
                                </Text>
                                <Text className="text-lg font-semibold text-gray-500">
                                    Fecha: {selectedValue?.label}
                                </Text>
                                <CustomButtonPrimary
                                    title='Cerrar'
                                    rounded
                                    onPress={() => setModalVisible(false)}
                                />
                            </View>
                        </View>
                    </Modal>
                </View>
            )}
        </View>
    );
}
