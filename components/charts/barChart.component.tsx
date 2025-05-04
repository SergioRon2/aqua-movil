import { CustomButtonPrimary } from 'components/buttons/mainButton.component';
import React, { useState } from 'react';
import { View, ScrollView, Dimensions, Text, Modal } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import useStylesStore from 'store/styles/styles.store';

const screenWidth = Dimensions.get('window').width;

interface Props {
    title?: string;
    data: {
        labels: string[];
        datasets: {
            data: number[];
        }[];
    };
}

const BarChartComponent = ({ data, title }: Props) => {
    const { globalColor } = useStylesStore();
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<{ label: string, value: number } | null>(null);

    const convertedData = data.labels.map((label, index) => ({
        value: data.datasets[0].data[index],
        label,
        frontColor: globalColor,
        onPress: () => {
            setSelectedItem({ label, value: data.datasets[0].data[index] });
            setShowModal(true);
        }
    }));

    const averageLabelLength =
        data.labels.reduce((acc, label) => acc + label.length, 0) / data.labels.length;
    const barWidth = Math.min(Math.max(averageLabelLength * 5, 30), 80);

    const longestLabel = Math.max(...data.labels.map(label => label.length));
    const chartWidth = Math.max(screenWidth, data.labels.length * 80 + longestLabel * 5);

    return (
        <View className="animate-fade-in w-full">
            {title && (
                <Text className="text-center font-bold text-xl">{title}</Text>
            )}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BarChart
                    data={convertedData}
                    barWidth={barWidth}
                    spacing={30}
                    barBorderRadius={2}
                    yAxisThickness={1}
                    xAxisThickness={1}
                    xAxisColor="#ccc"
                    yAxisColor="#ccc"
                    yAxisTextStyle={{ color: '#333' }}
                    xAxisLabelTextStyle={{
                        color: '#333',
                        fontSize: 12,
                        width: barWidth + 30,
                        textAlign: 'center',
                        numberOfLines: 2,
                    }}
                    stepValue={Math.ceil(Math.max(...data.datasets[0].data) / 4)}
                    showValuesAsTopLabel
                    isAnimated
                    width={chartWidth}
                    height={250}
                />
            </ScrollView>


            <View>
                {showModal && selectedItem && (
                    <Modal
                        transparent
                        animationType="fade"
                        visible={showModal}
                        onRequestClose={() => setShowModal(false)}
                    >
                        <View className="flex-1 justify-center items-center bg-black/50">
                            <View className="p-6 bg-white items-center rounded-2xl w-5/6 shadow-2xl gap-6 border border-gray-200">
                                <Text className="text-2xl font-extrabold text-center text-gray-800">{selectedItem.label}</Text>
                                <Text className="text-gray-500 text-lg font-medium text-center">
                                    Su valor es <Text className="text-gray-800 font-bold">{selectedItem.value}</Text>
                                </Text>
                                <CustomButtonPrimary 
                                    rounded 
                                    title="Cerrar" 
                                    onPress={() => setShowModal(false)}
                                />
                            </View>
                        </View>
                    </Modal>
                )}
            </View>
        </View>
    );
};

export default BarChartComponent;
