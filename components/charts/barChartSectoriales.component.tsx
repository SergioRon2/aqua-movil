import { ModalSector } from 'components/modals/modalSector.component';
import { useState } from 'react';
import { View, ScrollView, Dimensions, Text, Modal } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import useStylesStore from 'store/styles/styles.store';

const screenWidth = Dimensions.get('window').width;

interface Props {
    horizontalScroll?: boolean;
    title?: string;
    data: {
        ids: number[];
        labels: string[];
        datasets: {
            data: number[];
        }[];
    };
}

const BarChartSectorialesComponent = ({ data, title, horizontalScroll }: Props) => {
    const { globalColor } = useStylesStore();
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<{ sector_id: number, label: string, value: number } | null>(null);

    const hasData = data.datasets[0].data.some(value => value > 0);

    const convertedData = hasData
        ? data.labels.map((label, index) => {
            const value = data.datasets[0].data[index];
            const sector_id = data.ids[index];
            return {
                sector_id,
                value,
                label,
                frontColor: globalColor,
                onPress: () => {
                    setSelectedItem({ sector_id, label, value });
                    setShowModal(true);
                },
            };
        })
        : [
            {
                label: 'Sin datos',
                value: 1,
                frontColor: '#e0e0e0',
                sector_id: 0,
                onPress: () => { }
            },
        ];

    const averageLabelLength =
        data.labels.reduce((acc, label) => acc + label.length, 0) / data.labels.length;
    const barWidth = Math.min(Math.max(averageLabelLength * 5, 30), 80);

    const longestLabel = Math.max(...data.labels.map(label => label.length));
    const chartWidth = Math.max(screenWidth, data.labels.length * 100 + longestLabel * 5);

    return (
        <View className="animate-fade-in w-full gap-4" style={{ backgroundColor: '#fff' }} renderToHardwareTextureAndroid={true}>
            {title && (
                <Text className="text-center font-bold text-xl">{title}</Text>
            )}
            <ScrollView horizontal={horizontalScroll} showsHorizontalScrollIndicator={false}>
                <View className="flex-row items-center">
                    {hasData && (
                        <View className="w-[45px] items-center justify-center">
                            <Text
                                className="text-[16px] text-[#333] font-bold w-[100px] text-center -rotate-90"
                            >
                                Proyectos
                            </Text>
                        </View>
                    )}

                    {hasData ? (<BarChart
                        data={convertedData}
                        barWidth={barWidth}
                        spacing={30}
                        barBorderTopLeftRadius={18}
                        barBorderTopRightRadius={18}
                        barBorderRadius={2}
                        yAxisThickness={1}
                        xAxisThickness={1}
                        xAxisColor="#ccc"
                        yAxisColor="#ccc"
                        yAxisTextStyle={{ color: '#333' }}
                        xAxisLabelTextStyle={{
                            color: '#333',
                            fontSize: 12,
                            fontWeight: 'bold',
                            width: barWidth + 30,
                            textAlign: 'center',
                            numberOfLines: 2,
                        }}
                        stepValue={Math.ceil(Math.max(...data.datasets[0].data) / 4)}
                        showValuesAsTopLabel
                        isAnimated
                        width={chartWidth}
                        height={250}
                    />) : (
                        <View className='flex flex-col w-full items-center justify-center py-12'>
                            <Text className='text-lg text-center px-4'>No hay datos</Text>
                        </View>
                    )}
                </View>
            </ScrollView>


            <View>
                {showModal && selectedItem && (
                    <ModalSector showModal={showModal} setShowModal={setShowModal} selectedItem={selectedItem} />
                )}
            </View>
        </View>
    );
};

export default BarChartSectorialesComponent;
