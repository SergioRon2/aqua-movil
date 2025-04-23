import { useRoute } from "@react-navigation/native";
import { InfoProyecto } from "components/cards/infoProyecto.component";
import AreaChartComponent from "components/charts/areaChart.component";
import BarChartComponent from "components/charts/barChart.component";
import PieChartComponent from "components/charts/pieChart.component";
import SemiDonutChart from "components/charts/semiDonutChart.component";
import { Pressable, ScrollView, Text, View } from "react-native";


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
            <Text className="text-md font-bold text-center">{proyecto.name}</Text>

            <View>
                <InfoProyecto proyecto={proyecto} />
            </View>

            <View className="justify-center items-center mt-6">
                <Text className="text-center text-2xl font-bold py-5">Poblacion beneficiada</Text>
                <SemiDonutChart />
            </View>

            <View className="justify-center items-center mt-12">
                <Text className="text-center text-2xl font-bold py-5">Avance del proyecto</Text>
                <BarChartComponent data={dataBar} />
            </View>

        </ScrollView>
    )
}

export default ProyectoScreen;