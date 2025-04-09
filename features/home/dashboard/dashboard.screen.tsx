import AreaChartComponent from 'components/charts/areaChart.component';
import BarChartComponent from 'components/charts/barChart.component';
import PieChartComponent from 'components/charts/pieChart.component';
import { useState } from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const items = [
        { title: 'Gráfico de Barras', component: <BarChartComponent/> },
        { title: 'Gráfico de Pastel', component: <PieChartComponent/> },
        { title: 'Gráfico de Area', component: <AreaChartComponent/> },
    ];

    return (
        <ScrollView
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            className="flex-grow p-4 mt-7 bg-gray-100"
        >
            <Text className="animate-fade-in text-2xl font-bold mb-2">Te damos la bienvenida</Text>
            <Text className="animate-fade-in text-lg text-gray-600 mb-4">Aquí puedes ver tus proyectos y estadísticas.</Text>
            <View className='items-center justify-center'>
                <Carousel
                    width={width * 0.95}
                    height={400}
                    data={items}
                    loop={false}
                    style={{ alignSelf: 'center' }}
                    onSnapToItem={(index) => setActiveIndex(index)}
                    renderItem={({ item }) => {
                        return (
                            <View
                                className='bg-white border border-gray-200 rounded-lg shadow-md'
                            >
                                {item.component}
                            </View>
                        );
                    }}

                />
            </View>
            <View>
                <Text className="animate-fade-in text-xl font-bold mb-4">Proyectos</Text>
                <View className="animate-fade-in bg-white border border-gray-200 p-4 rounded-lg mb-4">
                    <Text className="text-lg font-bold">Card 1</Text>
                    <Text className="text-gray-600">This is some content for card 1.</Text>
                </View>
                <View className="animate-fade-in bg-white border border-gray-200 p-4 rounded-lg mb-4">
                    <Text className="text-lg font-bold">Card 2</Text>
                    <Text className="text-gray-600">This is some content for card 2.</Text>
                </View>
                <View className="animate-fade-in bg-white border border-gray-200 p-4 rounded-lg mb-4">
                    <Text className="text-lg font-bold">Card 3</Text>
                    <Text className="text-gray-600">This is some content for card 3.</Text>
                </View>
            </View>
        </ScrollView>
    );
};

export default DashboardScreen;
