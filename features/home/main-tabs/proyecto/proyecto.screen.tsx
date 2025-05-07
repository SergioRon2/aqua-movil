import { useRoute } from "@react-navigation/native";
import { InfoProyecto } from "components/cards/infoProyecto.component";
import BarChartComponent from "components/charts/barChart.component";
import SemiDonutChart from "components/charts/semiDonutChart.component";
import LottieView from "lottie-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import useStylesStore from "store/styles/styles.store";


const ProyectoScreen = () => {
    const route = useRoute();
    const { proyecto } = route.params;

    const dataBar = {
        labels: ['Avance Fisico', 'Avance Financiero'],
        datasets: [
            {
                data: [proyecto.physical_current, proyecto.financial_current],
            }
        ]
    }

    return (
        <ScrollView className="h-full mt-5 px-4">
            {
                proyecto ? (
                    <>
                        <Text className="text-md font-bold text-center">{proyecto.name}</Text>

                        <View>
                            <InfoProyecto proyecto={proyecto} />
                        </View>

                        <View className="justify-center items-center mt-6 bg-white border rounded-lg px-4 h-60 border-gray-200 shadow-lg">
                            <Text className="text-center text-2xl font-bold py-5">Poblacion beneficiada</Text>
                            <SemiDonutChart />
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