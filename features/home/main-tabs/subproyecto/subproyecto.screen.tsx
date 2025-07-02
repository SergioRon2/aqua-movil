import { useRoute } from "@react-navigation/native";
import { InfoSubProyecto } from "components/cards/infoSubproyecto.component";
import BarChartComponent from "components/charts/barChart.component";
import LottieView from "lottie-react-native";
import { ScrollView, Text, View } from "react-native";
import useInternetStore from "store/internet/internet.store";

const SubProyectoScreen = () => {
    const route = useRoute();
    const { online } = useInternetStore();
    const { subproyecto } = route.params;

    const dataBar = {
        labels: ['Avance Fisico', 'Avance Financiero'],
        datasets: [
            {
                data: [subproyecto.physical_current, subproyecto.financial_current],
            }
        ]
    }

    console.log({subproyecto})

    return (
        <ScrollView className="h-full mt-5 px-4">
            {
                subproyecto ? (
                    <>
                        <Text className="text-md font-bold text-center">{subproyecto.name}</Text>

                        <View>
                            <InfoSubProyecto subproyecto={subproyecto} />
                        </View>

                        <View style={{ backgroundColor: '#fff' }} className="justify-center items-center mt-5 mb-12 bg-white border-2 rounded-lg p-4 h-auto border-gray-200 shadow-lg">
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
                        <Text className="text-lg text-gray-500 mt-4">No hay datos disponibles {!online && 'sin conexion'}</Text>
                    </View>
                )
            }
        </ScrollView>
    )
}

export default SubProyectoScreen;