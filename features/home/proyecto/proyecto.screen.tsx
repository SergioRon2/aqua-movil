import { useRoute } from "@react-navigation/native";
import { InfoProyecto } from "components/cards/infoProyecto.component";
import AreaChartComponent from "components/charts/areaChart.component";
import PieChartComponent from "components/charts/pieChart.component";
import { Pressable, ScrollView, Text, View } from "react-native";


const ProyectoScreen = () => {
    const route = useRoute();
    const { proyecto } = route.params;

    return (
        <ScrollView className="h-full mt-5 px-4">
            <Text className="text-3xl font-bold text-center">{proyecto.name}</Text>

            <View>
                <InfoProyecto proyecto={proyecto} />
            </View>

            <View className="justify-center items-center mt-4">
                <Text className="text-center text-2xl font-bold py-5">Poblacion beneficiada</Text>
                <AreaChartComponent />
            </View>

            <View className="justify-center items-center mt-4">
                <Text className="text-center text-2xl font-bold py-5">Avance del proyecto</Text>
                <PieChartComponent />
            </View>

        </ScrollView>
    )
}

export default ProyectoScreen;