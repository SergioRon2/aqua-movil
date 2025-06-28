import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import useStylesStore from 'store/styles/styles.store';

interface Props {
    title?: string;
    data: { frontValue: number, backValue: number, label: string }[];
}

export default function AreaChartComponent({ title, data }: Props) {
    const { globalColor } = useStylesStore();
    const screenWidth = Dimensions.get('window').width;
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
        // Ajuste para evitar NaN
        if (!day || !month || !year) return label;
        // Asegura dos dígitos para día y mes
        const dayStr = day.toString().padStart(2, '0');
        const monthStr = month.toString().padStart(2, '0');
        return `${dayStr}/${monthStr}/${year}`;
    };

    const chartData = {
        labels: sortedFront.map(item => formatLabel(item?.label)),
        datasets: [
            {
                data: sortedFront.map(item => item?.frontValue),
                color: () => globalColor,
                strokeWidth: 2,
            },
            {
                data: sortedBack.map(item => item?.backValue),
                color: () => '#22c55e',
                withShadow: true,
                strokeWidth: 4,
            },
        ],
        legend: ['Actual', 'Proyectado'],
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
                    <Text className="text-gray-400">No hay datos para mostrar 🔍</Text>
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
                                r: '4',
                                strokeWidth: '2',
                                stroke: globalColor,
                            },
                        }}
                        style={{
                            borderRadius: 16,
                        }}
                    />
                </View>
            )}
        </View>
    );
}
