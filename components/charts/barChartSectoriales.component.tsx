import React, { useState } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText, G, Line } from 'react-native-svg';
import { ModalSector } from 'components/modals/modalSector.component';
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

const BarChartSectorialesComponent = ({ data, title, horizontalScroll = true }: Props) => {
    const { globalColor } = useStylesStore();
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<{
        sector_id: number;
        label: string;
        value: number;
    } | null>(null);

    const hasData = data.datasets[0].data.some(value => value > 0);
    const chartHeight = 250;
    const barSpacing = 30;
    const barWidth = 60;

    const barData = hasData
        ? data.labels.map((label, index) => ({
            label,
            value: data.datasets[0].data[index],
            sector_id: data.ids[index],
        }))
        : [];

    const maxVal = Math.max(...data.datasets[0].data, 1);
    const step = Math.ceil(maxVal / 4);
    const chartWidth = Math.max(screenWidth, barData.length * (barWidth + barSpacing) + 60); // 60 for y-axis space

    return (
        <View className="w-full bg-white px-4 py-6 rounded-xl gap-4">
            {title && <Text className="text-xl font-bold text-center mb-4">{title}</Text>}

            <ScrollView horizontal={horizontalScroll} showsHorizontalScrollIndicator={false}>
                {hasData ? (
                    <Svg width={chartWidth} height={chartHeight + 40}>
                        {/* Líneas horizontales y valores Y */}
                        {[0, 1, 2, 3, 4].map(i => {
                            const y = chartHeight - (i * chartHeight) / 4;
                            return (
                                <G key={i}>
                                    <Line
                                        x1={40}
                                        y1={y}
                                        x2={chartWidth}
                                        y2={y}
                                        stroke="#ccc"
                                        strokeWidth={1}
                                    />
                                    <SvgText
                                        x={30}
                                        y={y + 5}
                                        fontSize="10"
                                        fill="#666"
                                        textAnchor="end"
                                    >
                                        {i * step}
                                    </SvgText>
                                </G>
                            );
                        })}

                        {/* Barras */}
                        {barData.map((item, index) => {
                            const height = (item.value / maxVal) * (chartHeight - 20); // Evita que toquen el techo
                            const x = 50 + index * (barWidth + barSpacing);
                            const y = chartHeight - height;

                            return (
                                <G key={index} onPress={() => {
                                    setSelectedItem(item);
                                    setShowModal(true);
                                }}>
                                    {/* Barra */}
                                    <Rect
                                        x={x}
                                        y={y}
                                        width={barWidth}
                                        height={height}
                                        fill={globalColor}
                                        rx={8}
                                        ry={8}
                                    />

                                    {/* Valor encima */}
                                    <SvgText
                                        x={x + barWidth / 2}
                                        y={y - 6}
                                        fontSize="10"
                                        fill="#000"
                                        textAnchor="middle"
                                    >
                                        {item.value}
                                    </SvgText>

                                    {/* Label */}
                                    <SvgText
                                        x={x + barWidth / 2}
                                        y={chartHeight + 20}
                                        fontSize="10"
                                        fill="#333"
                                        textAnchor="middle"
                                    >
                                        {item.label}
                                    </SvgText>
                                </G>
                            );
                        })}
                    </Svg>
                ) : (
                    <View className="w-full items-center justify-center py-10">
                        <Text className="text-center text-gray-500 text-lg">No hay datos</Text>
                    </View>
                )}
            </ScrollView>

            {/* Modal al presionar barra */}
            {showModal && selectedItem && (
                <ModalSector
                    showModal={showModal}
                    setShowModal={setShowModal}
                    selectedItem={selectedItem}
                />
            )}
        </View>
    );
};

export default BarChartSectorialesComponent;
