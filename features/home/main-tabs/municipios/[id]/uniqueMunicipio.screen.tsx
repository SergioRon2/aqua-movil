import { useRoute } from "@react-navigation/native";
import ProyectoCard from "components/cards/proyectoCard.component";
import SemiDonutChart from "components/charts/semiDonutChart.component";
import { IProyecto } from "interfaces/proyecto.interface";
import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import { View, Text, Dimensions, ActivityIndicator } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Animated, { FadeInDown, FadeOutDown, useSharedValue } from "react-native-reanimated";
import Carousel from 'react-native-reanimated-carousel';
import { ProjectsService } from "services/projects/projects.service";
import useStylesStore from "store/styles/styles.store";

const { width } = Dimensions.get('window');

const UniqueMunicipioScreen = () => {
    const route = useRoute();
    const { globalColor } = useStylesStore()
    const { municipio } = route.params;
    const [proyectos, setProyectos] = useState<IProyecto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProyectos = async () => {
            try {
                setLoading(true);
                const res = await ProjectsService.getAll({ municipio_ids: [municipio.id] });
                setProyectos(res?.data?.data);
            } catch (error) {
                console.error('Error fetching proyectos:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchProyectos();
    }, [municipio.id])

    const values = [40, 75, 50, 90, 30, 60];
    const labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];

    const items = [
        { title: 'Gráfico de Media Dona', component: <SemiDonutChart /> },
    ];

    return (
        <View className="animate-fade-in px-12 w-full">
            <Text className="text-3xl font-bold text-center py-6">
                {municipio.nombre}
            </Text>

            <View style={{ borderColor: globalColor }} className="w-full py-16 rounded-xl bg-white border-2 justify-center items-center mb-5">
                <SemiDonutChart />
            </View>

            <Text className="text-2xl font-bold py-2">
                Proyectos
            </Text>

            <View className="rounded-2xl justify-center animate-fade-in py-5 h-2/4">
                {
                    loading ? (
                        <ActivityIndicator size={'large'} color={globalColor} />
                    ) : 
                    proyectos.length > 0 ? (
                        <FlatList
                            data={proyectos}
                            keyExtractor={(item, index) => `${item.id}-${index}`}
                            renderItem={({ item, index }) => (
                                <Animated.View entering={index < 10 ? FadeInDown.delay(index * 200) : undefined} exiting={FadeOutDown}>
                                    <ProyectoCard data={item} />
                                </Animated.View>
                            )}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        />
                    ) : (
                        <View className='justify-center items-center m-auto'>
                            <Text style={{ color: globalColor }} className="text-center text-lg font-bold mt-4 animate-fade-in">No hay proyectos disponibles.</Text>
                        </View>
                    )
                }
            </View>
        </View>
    );
}


export default UniqueMunicipioScreen;