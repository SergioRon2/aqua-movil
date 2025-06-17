import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { InfoProyecto } from "components/cards/infoProyecto.component";
import BarChartComponent from "components/charts/barChart.component";
import SemiDonutChart from "components/charts/semiDonutChart.component";
import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import { Alert, Dimensions, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { InfoService } from "services/info/info.service";
import { ProjectsService } from "services/projects/projects.service";
import useActiveStore from "store/actives/actives.store";
import useInternetStore from "store/internet/internet.store";
import { useCallback } from "react";
import useStylesStore from "store/styles/styles.store";
import { Loading } from "components/loading/loading.component";
import AreaChartComponent from "components/charts/areaChart.component";


const ProyectoScreen = () => {
    const route = useRoute();
    const { proyecto } = route.params;
    const { fechaInicio, fechaFin, planDesarrolloActivo } = useActiveStore()
    const [infoProject, setInfoProject] = useState<any>();
    const [refreshing, setRefreshing] = useState(false);
    const { globalColor } = useStylesStore();
    const [avances, setAvances] = useState({
        avanceFinanciero: { name: '', value: 0 },
        avanceFisico: { name: '', value: 0 },
        indicadorTiempo: { name: '', value: 0 },
    });
    const [avanceFisicoData, setAvanceFisicoData] = useState<{ value: number, label: string }[]>([]);
    const { online } = useInternetStore();

    const dataBar = {
        labels: ['Avance Fisico', 'Avance Financiero'],
        datasets: [
            {
                data: [proyecto.physical_current, proyecto.financial_current],
            }
        ]
    }

    const fetchInfoProject = useCallback(async () => {
        try {
            setRefreshing(true);
            const res = await ProjectsService.getProjectInfoById(proyecto.id)
            setInfoProject(res.data)
        } catch (error) {
            console.error({ error })
        } finally {
            setRefreshing(false);
        }
    }, [proyecto.id]);

    useEffect(() => {
        fetchInfoProject();
    }, [fetchInfoProject]);

    const fetchInfo = useCallback(async () => {
        try {
            setRefreshing(true);
            if (online === null) {
                return;
            }

            if (online) {
                const res = await InfoService.getInfoByAllData({
                    development_plan_id: planDesarrolloActivo?.id,
                    project_id: proyecto.id,
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin
                });
                const avancesData = {
                    avanceFinanciero: { name: 'Avance financiero', value: res?.data?.last_progress_financial_current },
                    avanceFisico: { name: 'Avance fisico', value: res?.data?.last_progress_physical_current },
                    indicadorTiempo: { name: 'Tiempo ejecutado', value: res?.data?.time_exec }
                };
                setAvances(avancesData);
                // Guardar en AsyncStorage
                await AsyncStorage.setItem(
                    `avances_data`,
                    JSON.stringify(avancesData)
                );
            } else {
                // Leer de AsyncStorage
                const stored = await AsyncStorage.getItem(`avances_data`);
                if (stored) {
                    setAvances(JSON.parse(stored));
                }
            }
        } catch (error) {
            console.error({ error })
        } finally {
            setRefreshing(false);
        }
    }, [online, fechaInicio, fechaFin, planDesarrolloActivo?.id, proyecto.id]);

    useEffect(() => {
        fetchInfo();
    }, [fetchInfo]);

    const fetchProgressInfo = useCallback(async () => {
        try {
            const res = await InfoService.getProgressInfo(proyecto?.id, infoProject?.contract_principal?.id);
            const rawData = res.data.data;
            const lineData = rawData
                .filter((item: any) => item.value_full_financial !== null)
                .map((item: any, index: any) => ({
                    value: item.value_full_financial,
                    label: new Date(item.date).toLocaleDateString('es-CO', {
                        month: 'short',
                        day: 'numeric'
                    }),
                }));
            setAvanceFisicoData(lineData);
        } catch (error) {
            console.error({ error });
        }
    }, [proyecto.id]);

    useEffect(() => {
        fetchProgressInfo();
    }, [fetchProgressInfo]);

    const onRefresh = () => {
        fetchInfoProject();
        fetchProgressInfo();
        fetchInfo();
    };

    console.log(avanceFisicoData)

    const items = [
        {
            title: avances.avanceFinanciero.name,
            component: <SemiDonutChart percentage={avances.avanceFinanciero.value} height={70} radius={50} strokeWidth={12} fontSize={16} marginTop={6} />
        },
        {
            title: avances.avanceFisico.name,
            component: <SemiDonutChart percentage={avances.avanceFisico.value} height={70} radius={50} strokeWidth={12} fontSize={16} marginTop={6} />
        },
        {
            title: avances.indicadorTiempo.name,
            component: <SemiDonutChart percentage={avances.indicadorTiempo.value} height={70} radius={50} strokeWidth={12} fontSize={16} marginTop={6} />
        },
    ];


    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[globalColor]} />
            }
            className="h-full mt-5 px-4"
        >
            {
                refreshing ? (
                    <Loading />
                ) : (
                    proyecto ? (
                        <>
                            <Text className="text-md font-bold text-center">{proyecto.name || proyecto.title}</Text>

                            <View>
                                <InfoProyecto infoProyecto={infoProject} proyecto={proyecto} />
                            </View>

                            <View className="justify-center items-center mt-6 bg-white border rounded-lg px-6 py-6 h-auto border-gray-200 shadow-lg">
                                <Text className="text-xl font-bold">Avances</Text>
                                <View className="flex-row justify-center items-center m-auto px-6 py-6 h-auto">
                                    {items.slice(0, 2).map((item, idx) => (
                                        <View key={idx} className="items-center justify-center mx-2">
                                            <Text className="text-sm font-semibold mb-2 text-center">{item.title}</Text>
                                            <View>
                                                {item.component}
                                            </View>
                                        </View>
                                    ))}
                                    <View className="items-center justify-center mx-2">
                                        <Text className="text-sm font-semibold mb-2 text-center">{items[2].title}</Text>
                                        <View>
                                            {items[2].component}
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View className="justify-center items-center mt-5 mb-12 bg-white border-2 rounded-lg p-4 h-auto border-gray-200 shadow-lg">
                                <AreaChartComponent data={avanceFisicoData} title="Avance fisico" />
                            </View>
                        </>
                    ) : (
                        <View className="flex justify-center items-center">
                            <LottieView
                                source={require('../../../../assets/lottie/not_found.json')}
                                autoPlay
                                loop
                                style={{ width: 350, height: 350 }}
                            />
                            <Text className="text-lg text-gray-500 mt-4">No hay datos disponibles</Text>
                        </View>
                    )
                )
            }
        </ScrollView >
    )
}

export default ProyectoScreen;