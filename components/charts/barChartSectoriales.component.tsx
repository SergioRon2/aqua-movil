import React, { useState } from 'react';
import { View, Text, ScrollView, Dimensions, Pressable } from 'react-native';
import Svg, { Rect, Text as SvgText, G, Line } from 'react-native-svg';
import { ModalSector } from 'components/modals/modalSector.component';
import useStylesStore from 'store/styles/styles.store';
import useInternetStore from 'store/internet/internet.store';

const screenWidth = Dimensions.get('window').width;

interface Props {
    horizontalScroll?: boolean;
    title?: string;
    data: {
        ids: number[];
        labels: string[];
        datasets: { data: number[] }[];
    };
}

const BarChartSectorialesComponent = ({
    data,
    title,
    horizontalScroll = true,
}: Props) => {
    const { globalColor } = useStylesStore();
    const [showModal, setShowModal] = useState(false);
    const { online } = useInternetStore();
    const [selectedItem, setSelectedItem] = useState<{
        sector_id: number;
        label: string;
        value: number;
    } | null>(null);

    const barData = data.labels.map((label, index) => ({
        label,
        value: data.datasets[0].data[index],
        sector_id: data.ids[index],
    }));

    const hasData = barData.some(item => item.value > 0);

    const chartHeight = 250;
    const barWidth = 60;
    const barSpacing = 30;

    const rawMax = Math.max(...barData.map(d => d.value), 1);
    const step = Math.ceil(rawMax / 4);
    const scaleMax = step * 4;

    const pixelsPerUnit = chartHeight / scaleMax;

    const chartWidth = Math.max(
        screenWidth,
        barData.length * (barWidth + barSpacing) + 60
    );

    return (
        <View className="w-full bg-white px-4 py-6 rounded-xl gap-4">
            {title && (
                <Text className="text-xl font-bold text-center mb-4">{title}</Text>
            )}

            <ScrollView horizontal={horizontalScroll} showsHorizontalScrollIndicator={false}>
                {hasData ? (
                    <View style={{ width: chartWidth, height: chartHeight + 40 }}>
                        {/* Gráfico SVG como fondo */}
                        <Svg width={chartWidth} height={chartHeight + 40}>
                            {/* Líneas del eje Y */}
                            {[0, 1, 2, 3, 4].map(i => {
                                const y = chartHeight - i * step * pixelsPerUnit;
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
                                const height = item.value * pixelsPerUnit;
                                const x = 50 + index * (barWidth + barSpacing);
                                const y = chartHeight - height;

                                return (
                                    <G key={index}>
                                        <Rect
                                            x={x}
                                            y={y}
                                            width={barWidth}
                                            height={height}
                                            fill={globalColor}
                                            rx={8}
                                            ry={8}
                                        />
                                        <SvgText
                                            x={x + barWidth / 2}
                                            y={y - 6}
                                            fontSize="10"
                                            fill="#000"
                                            textAnchor="middle"
                                        >
                                            {item.value}
                                        </SvgText>
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

                        {/* Pressables encima de cada barra */}
                        {barData.map((item, index) => {
                            const height = item.value * pixelsPerUnit;
                            const x = 50 + index * (barWidth + barSpacing);
                            const y = chartHeight - height;

                            return (
                                <Pressable
                                    key={`press-${index}`}
                                    onPress={() => {
                                        setSelectedItem(item);
                                        setShowModal(true);
                                    }}
                                    style={{
                                        position: 'absolute',
                                        left: x,
                                        top: y,
                                        width: barWidth,
                                        height,
                                    }}
                                />
                            );
                        })}
                    </View>
                ) : (
                    <View className="w-full items-center justify-center py-10">
                        <Text className="text-center text-gray-500 text-lg">
                            No hay datos {!online && 'sin conexion'}
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Modal */}
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
