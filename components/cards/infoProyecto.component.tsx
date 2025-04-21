import { CustomButtonPrimary } from "components/buttons/mainButton.component";
import { IProyecto } from "interfaces/proyecto.interface";
import { View, Text, Pressable } from "react-native";
import { ExportsService } from "services/exports/exports.service";
import { formatNumberWithSuffix } from "utils/formatNumberWithSuffix";


export const InfoProyecto = ({ proyecto }: { proyecto: IProyecto }) => {

    const downloadFile = async (id: number) => {
        try {
            await ExportsService.downloadFile(id);
        } catch (error) {
            console.error({error})
        }
    }

    return <View className="w-full mt-4 bg-white rounded-lg shadow-md p-4 gap-4 items-start justify-center">
        <View className="flex-row justify-around gap-5 items-start">
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Fecha inicio</Text>
                <Text className="text-xl font-bold">
                    {proyecto.projectBankDate != null ? proyecto.projectBankDate : 'Nulo'}
                </Text>
            </View>
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Fecha fin</Text>
                <Text className="text-xl font-bold">
                    {proyecto.fechaProyecto != null ? proyecto.fechaProyecto : 'Nulo'}
                </Text>
            </View>
        </View>
        <View className="flex-row justify-around gap-5 items-start">
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Contrato</Text>
                <Text className="text-xl font-bold">
                    {proyecto.type != null ? proyecto.type : 'Nulo'}
                </Text>
            </View>
            <View className="justify-between items-start w-1/2">
                <Text className={`text-md text-gray-500`}>Estado</Text>
                <Text
                    className={`text-xl font-bold`}
                    style={{
                        color: proyecto.state_color != null
                            ? proyecto.state_color
                            : '#000'
                    }}
                >
                    {proyecto.state_name != null ? proyecto.state_name : 'Nulo'}
                </Text>
            </View>
        </View>
        <View className="flex-row justify-around gap-5 items-start">
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Sectorial</Text>
                <Text className="text-xl font-bold">
                    {proyecto.list_sector_name != null ? proyecto.list_sector_name : 'Nulo'}
                </Text>
            </View>
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Municipio</Text>
                <Text className="text-xl font-bold">
                    {proyecto.municipios_texto != null ? proyecto.municipios_texto : 'Indefinido.'}
                </Text>
            </View>
        </View>
        <View className="flex-row justify-around gap-5 items-start">
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Contratista</Text>
                <Text className="text-xl font-bold">
                    {proyecto.BPIM != null || "" ? proyecto.BPIM : 'Nulo'}
                </Text>
            </View>
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Valor del proyecto</Text>
                <Text className="text-xl font-bold">
                    {proyecto.total_source_value != null 
                    ? formatNumberWithSuffix(+proyecto.total_source_value) 
                    : 'Nulo'}
                </Text>
            </View>
        </View>
        <View className="flex-row justify-around gap-5 items-start">
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Numero de contrato</Text>
                <Text className="text-xl font-bold">
                    {proyecto.contract_number != null ? proyecto.contract_number : 'Nulo'}
                </Text>
            </View>
        </View>

        <View className="justify-center items-center w-full mt-6">
            <CustomButtonPrimary rounded onPress={() => downloadFile(+proyecto.id)} title="Descargar informe" />
        </View>
    </View>
}