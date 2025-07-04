import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { InfoProyecto } from "components/cards/infoProyecto.component";
import SemiDonutChart from "components/charts/semiDonutChart.component";
import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { InfoService } from "services/info/info.service";
import { ProjectsService } from "services/projects/projects.service";
import useActiveStore from "store/actives/actives.store";
import useInternetStore from "store/internet/internet.store";
import { useCallback } from "react";
import useStylesStore from "store/styles/styles.store";
import { Loading } from "components/loading/loading.component";
import AreaChartComponent from "components/charts/areaChart.component";
import { useWindowDimensions } from "react-native";


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
    const [avanceFisicoData, setAvanceFisicoData] = useState<{ frontValue: number, backValue: number, label: string }[]>([]);
    const { online } = useInternetStore();

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
        const allReady =
            online !== null &&
            planDesarrolloActivo?.id &&
            proyecto?.id &&
            fechaInicio &&
            fechaFin;

        if (allReady) {
            fetchInfoProject();
        }
    }, [online, planDesarrolloActivo?.id, proyecto?.id, fechaInicio, fechaFin]);

    const fetchInfo = useCallback(async () => {
        try {
            setRefreshing(true);
            if (online === null) {
                return;
            }

            if (online) {
                const res = await InfoService.getInfoByProject(proyecto.id);
                const avancesData = {
                    avanceFinanciero: { name: 'Avance financiero', value: res?.data?.last_progress_financial_current },
                    avanceFisico: { name: 'Avance físico', value: res?.data?.last_progress_physical_current },
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
        const allReady =
            online !== null &&
            planDesarrolloActivo?.id &&
            proyecto?.id &&
            fechaInicio &&
            fechaFin;

        if (allReady) {
            fetchInfo();
        }
    }, [online, planDesarrolloActivo?.id, proyecto?.id, fechaInicio, fechaFin]);

    const fetchProgressInfo = useCallback(async () => {
        try {
            if (online) {
            const res = await InfoService.getProgressInfo(infoProject?.contract_principal?.id);
            const rawData = res?.data;

            if (!Array.isArray(rawData)) {
                console.warn("Datos no válidos recibidos para el gráfico.");
                setAvanceFisicoData([]);
                await AsyncStorage.removeItem('avanceFisicoData');
                return;
            }

            const filteredData = rawData
                .filter((item: any) =>
                item?.progress_type?.trim().toLowerCase() === "fisico" &&
                typeof item?.physical_current === "number" &&
                typeof item?.physical_projected === "number" &&
                !isNaN(item.physical_current) &&
                !isNaN(item.physical_projected)
                );

            const lineData = filteredData.map((item: any) => ({
                frontValue: item.physical_current,
                backValue: item.physical_projected,
                label: item.date,
            }));

            if (!lineData.length) {
                console.warn("No hay datos válidos para mostrar en el gráfico.");
            }

            setAvanceFisicoData(lineData);
            await AsyncStorage.setItem('avanceFisicoData', JSON.stringify(lineData));
            } else {
            const stored = await AsyncStorage.getItem('avanceFisicoData');
            if (stored) {
                setAvanceFisicoData(JSON.parse(stored));
            } else {
                setAvanceFisicoData([]);
            }
            }
        } catch (error) {
            console.error("Error en fetchProgressInfo:", error);
            setAvanceFisicoData([]);
        }
    }, [infoProject?.contract_principal?.id]);

    useEffect(() => {
        fetchProgressInfo();
    }, [fetchProgressInfo]);

    const onRefresh = () => {
        fetchInfoProject();
        fetchProgressInfo();
        fetchInfo();
    };

    const { width } = useWindowDimensions();
    const donutSize = Math.max(60, Math.min(110, width * 0.25));
    const donutRadius = donutSize * 0.53;
    const donutStrokeWidth = donutSize * 0.16;
    const donutFontSize = donutSize * 0.14;

    const items = [
        {
            title: avances.avanceFinanciero.name,
            component: (
                <SemiDonutChart
                    percentage={avances.avanceFinanciero.value}
                    height={donutSize}
                    radius={donutRadius}
                    strokeWidth={donutStrokeWidth}
                    fontSize={donutFontSize}
                    marginTop={4}
                />
            ),
        },
        {
            title: avances.avanceFisico.name,
            component: (
                <SemiDonutChart
                    percentage={avances.avanceFisico.value}
                    height={donutSize}
                    radius={donutRadius}
                    strokeWidth={donutStrokeWidth}
                    fontSize={donutFontSize}
                    marginTop={4}
                />
            ),
        },
        {
            title: avances.indicadorTiempo.name,
            component: (
                <SemiDonutChart
                    percentage={avances.indicadorTiempo.value}
                    height={donutSize}
                    radius={donutRadius}
                    strokeWidth={donutStrokeWidth}
                    fontSize={donutFontSize}
                    marginTop={4}
                />
            ),
        },
    ];

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
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

                            <View
                                className="justify-center items-center mt-6 bg-white border rounded-lg p-2 h-auto border-gray-200 shadow-lg w-full"
                                style={{ width: '100%', alignSelf: 'center' }}
                            >
                                <Text className="text-xl font-bold">Avances</Text>
                                <View
                                    className="flex-row flex-wrap justify-center items-stretch m-auto px-2 py-6 h-auto w-full"
                                    style={{ gap: 12 }}
                                >
                                    {items.map((item, idx) => (
                                        <View
                                            key={idx}
                                            className="items-center justify-center flex-1 min-w-[120px] max-w-[180px] mx-2"
                                            style={{ minWidth: 120, maxWidth: 180, flexBasis: '40%' }}
                                        >
                                            <Text className="text-sm font-semibold mb-2 text-center">{item.title}</Text>
                                            <View>
                                                {item.component}
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            <View className="justify-center items-center mt-5 mb-12 bg-white border-2 rounded-lg p-4 h-auto border-gray-200 shadow-lg">
                                <AreaChartComponent data={avanceFisicoData} title="Avance físico" />
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
                            <Text className="text-lg text-gray-500 mt-4">No hay datos disponibles {!online && 'sin conexión'}</Text>
                        </View>
                    )
                )
            }
        </ScrollView>
    )
}

export default ProyectoScreen;