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
import { InfoService } from "services/info/info.service";
import { ProjectsService } from "services/projects/projects.service";
import useActiveStore from "store/actives/actives.store";
import useStylesStore from "store/styles/styles.store";

const UniqueMunicipioScreen = () => {
    const route = useRoute();
    const { globalColor } = useStylesStore()
    const { fechaInicio, fechaFin } = useActiveStore();
    const { municipio } = route.params;
    const [proyectos, setProyectos] = useState<IProyecto[]>([]);
    const [loading, setLoading] = useState(true);
    const [avances, setAvances] = useState({
        avanceFinanciero: { name: '', value: 0 },
        avanceFisico: { name: '', value: 0 },
        indicadorTiempo: { name: '', value: 0 },
    });

    useEffect(() => {
        const fetchProyectos = async () => {
            try {
                setLoading(true);
                const res = await ProjectsService.getAll({ municipio_ids: [municipio.id], fechaInicio: fechaInicio, fechaFin: fechaFin });
                setProyectos(res?.data?.data);
            } catch (error) {
                console.error('Error fetching proyectos:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchProyectos();
    }, [municipio.id, fechaInicio, fechaFin]);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const res = await InfoService.getInfoByAllData({
                    municipio_id: municipio.id, 
                    fechaInicio: fechaInicio, 
                    fechaFin: fechaFin
                });
                setAvances({
                    avanceFinanciero: { name: 'Avance financiero', value: res?.data?.last_progress_financial_current },
                    avanceFisico: { name: 'Avance fisico', value: res?.data?.last_progress_physical_current },
                    indicadorTiempo: { name: 'Indicador de tiempo ejecutado', value: res?.data?.time_exec }
                });
            } catch (error) {
                console.error({ error })
            }
        }

        fetchInfo();
    }, [municipio.id, fechaInicio, fechaFin])

    const items = [
        { title: avances.avanceFinanciero.name, component: <SemiDonutChart percentage={avances.avanceFinanciero.value} height={240} /> },
        { title: avances.avanceFisico.name, component: <SemiDonutChart percentage={avances.avanceFisico.value} height={240} /> },
        // { 
        //     title: 'Gráfico de Dona', 
        //     component: <DonutChartComponent 
        //         height={240} 
        //         dataRow 
        //         data={[
        //             { label: avances?.avanceFinanciero?.name, value: avances?.avanceFinanciero?.value }, 
        //             { label: avances?.avanceFisico?.name, value: avances?.avanceFisico?.value }]} 
        //     /> 
        // },
        { title: avances.indicadorTiempo.name, component: <SemiDonutChart percentage={avances.indicadorTiempo.value} height={240} /> },
    ];

    return (
        <View className="animate-fade-in px-12 w-full">
            <Text className="text-3xl font-bold text-center py-6">
                {municipio.nombre}
            </Text>

            <View className="w-full justify-center items-center">
                <Carousel
                    loop
                    width={Dimensions.get('window').width - 50}
                    height={290}
                    data={items}
                    scrollAnimationDuration={1000}
                    renderItem={({ item }) => (
                        <View className="w-full gap-5 rounded-xl bg-white border border-gray-300 justify-center items-center mb-5">
                            <Text className="text-lg font-bold mt-4">{item.title}</Text>
                            {item.component}
                        </View>
                    )}
                />
            </View>


            <View className="rounded-2xl justify-center animate-fade-in py-5 h-2/4">
                <Text className="text-2xl font-bold py-2">
                    Proyectos
                </Text>
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