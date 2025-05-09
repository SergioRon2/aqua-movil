import { useRoute } from "@react-navigation/native";
import { InfoProyecto } from "components/cards/infoProyecto.component";
import BarChartComponent from "components/charts/barChart.component";
import SemiDonutChart from "components/charts/semiDonutChart.component";
import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import { Dimensions, Pressable, ScrollView, Text, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { InfoService } from "services/info/info.service";
import useActiveStore from "store/actives/actives.store";


const ProyectoScreen = () => {
    const route = useRoute();
    const { proyecto } = route.params;
    const { fechaInicio, fechaFin } = useActiveStore()
    const [avances, setAvances] = useState({
        avanceFinanciero: { name: '', value: 0 },
        avanceFisico: { name: '', value: 0 },
        indicadorTiempo: { name: '', value: 0 },
    });

    const dataBar = {
        labels: ['Avance Fisico', 'Avance Financiero'],
        datasets: [
            {
                data: [proyecto.physical_current, proyecto.financial_current],
            }
        ]
    }

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const res = await InfoService.getInfoByAllData({ 
                    project_id: proyecto.id, 
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
    }, [proyecto.id])

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
        <ScrollView className="h-full mt-5 px-4">
            {
                proyecto ? (
                    <>
                        <Text className="text-md font-bold text-center">{proyecto.name || proyecto.title}</Text>

                        <View>
                            <InfoProyecto proyecto={proyecto} />
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