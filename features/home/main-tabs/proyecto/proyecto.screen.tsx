import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { InfoProyecto } from "components/cards/infoProyecto.component";
import BarChartComponent from "components/charts/barChart.component";
import SemiDonutChart from "components/charts/semiDonutChart.component";
import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import { Alert, Dimensions, Pressable, ScrollView, Text, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { InfoService } from "services/info/info.service";
import { ProjectsService } from "services/projects/projects.service";
import useActiveStore from "store/actives/actives.store";
import useInternetStore from "store/internet/internet.store";


const ProyectoScreen = () => {
    const route = useRoute();
    const { proyecto } = route.params;
    const { fechaInicio, fechaFin } = useActiveStore()
    const [infoProject, setInfoProject] = useState<any>();
    const [avances, setAvances] = useState({
        avanceFinanciero: { name: '', value: 0 },
        avanceFisico: { name: '', value: 0 },
        indicadorTiempo: { name: '', value: 0 },
    });
    const { online } = useInternetStore();

    const dataBar = {
        labels: ['Avance Fisico', 'Avance Financiero'],
        datasets: [
            {
                data: [proyecto.physical_current, proyecto.financial_current],
            }
        ]
    }

    useEffect(() => {
        const fetchInfoProject = async () => {
            try {
                const res = await ProjectsService.getProjectInfoById(proyecto.id)
                setInfoProject(res.data)
            } catch (error) {
                console.error({ error })
            }
        }

        fetchInfoProject()
    }, [])


    useEffect(() => {
        const fetchInfo = async () => {
            try {
                if (online) {
                    const res = await InfoService.getInfoByAllData({
                        project_id: proyecto.id,
                        fechaInicio: fechaInicio,
                        fechaFin: fechaFin
                    });
                    const avancesData = {
                        avanceFinanciero: { name: 'Avance financiero', value: res?.data?.last_progress_financial_current },
                        avanceFisico: { name: 'Avance fisico', value: res?.data?.last_progress_physical_current },
                        indicadorTiempo: { name: 'Indicador de tiempo ejecutado', value: res?.data?.time_exec }
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
            }
        }

        fetchInfo();
    }, [proyecto.id])


    const items = [
        { title: avances.avanceFinanciero.name, component: <SemiDonutChart percentage={avances.avanceFinanciero.value} height={240} /> },
        { title: avances.avanceFisico.name, component: <SemiDonutChart percentage={avances.avanceFisico.value} height={240} /> },
        { title: avances.indicadorTiempo.name, component: <SemiDonutChart percentage={avances.indicadorTiempo.value} height={240} /> },
    ];

    return (
        <ScrollView className="h-full mt-5 px-4">
            {
                proyecto ? (
                    <>
                        <Text className="text-md font-bold text-center">{proyecto.name || proyecto.title}</Text>

                        <View>
                            <InfoProyecto infoProyecto={infoProject} proyecto={proyecto} />
                        </View>

                        <View className="justify-center items-center mt-6 bg-white border rounded-lg px-4 h-auto border-gray-200 shadow-lg">
                            <Carousel
                                loop
                                width={Dimensions.get('window').width - 50}
                                height={300}
                                data={items}
                                scrollAnimationDuration={1000}
                                renderItem={({ item }) => (
                                    <View className="w-full gap-5 rounded-xl bg-white justify-center items-center mb-5">
                                        <Text className="text-lg font-bold mt-4">{item.title}</Text>
                                        {item.component}
                                    </View>
                                )}
                            />
                        </View>

                        <View className="justify-center items-center mt-5 mb-12 bg-white border-2 rounded-lg p-4 h-auto border-gray-200 shadow-lg">
                            <BarChartComponent title="Avance del proyecto" horizontalScroll={false} data={dataBar} />
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
            }
        </ScrollView>
    )
}

export default ProyectoScreen;