import { useRoute } from "@react-navigation/native";
import ProyectoCard from "components/cards/proyectoCard.component";
import AreaChartComponent from "components/charts/areaChart.component";
import BarChartComponent from "components/charts/barChart.component";
import PieChartComponent from "components/charts/pieChart.component";
import { View, Text, Dimensions } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Animated, { FadeInDown, FadeOutDown, useSharedValue } from "react-native-reanimated";
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');

const UniqueMunicipioScreen = () => {
    const route = useRoute();
    const { municipio } = route.params;

    const values = [40, 75, 50, 90, 30, 60];
    const labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];

    const items = [
        { title: 'Gráfico de Pastel', component: <PieChartComponent /> },
        { title: 'Gráfico de Area', component: <AreaChartComponent /> },
    ];

    return (
        <View className="animate-fade-in px-12 w-full">
            <Text className="text-3xl font-bold text-center py-6">
                {municipio.municipio}
            </Text>

            <View>
                <Carousel
                    width={width * 0.85}
                    height={300}
                    data={items}
                    loop={false}
                    style={{ alignSelf: 'center' }}
                    renderItem={({ item }) => {
                        return (
                            <View
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: 16,
                                    alignItems: 'center',
                                }}
                            >
                                {item.component}
                            </View>
                        );
                    }}
                />
            </View>

            <Text className="text-2xl font-bold py-2">
                Proyectos
            </Text>

            <View className="rounded-2xl justify-center animate-fade-in">
                <FlatList
                    data={municipio.proyectos.lista}
                    keyExtractor={(item) => item.nombre}
                    renderItem={({ item, index }) => (
                        <Animated.View entering={FadeInDown.delay(index * 200)} exiting={FadeOutDown}>
                            <ProyectoCard data={item} />
                        </Animated.View>
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            </View>
        </View>
    );
}


export default UniqueMunicipioScreen;