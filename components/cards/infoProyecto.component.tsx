import { CustomButtonPrimary } from "components/buttons/mainButton.component";
import { IProyecto, IProyectoDashboard } from "interfaces/proyecto.interface";
import { useState } from "react";
import { View, Text, Pressable, Modal, ScrollView } from "react-native";
import { ExportsService } from "services/exports/exports.service";
import useStylesStore from "store/styles/styles.store";
import { capitalize } from "utils/capitalize";
import { formatNumberWithSuffix } from "utils/formatNumberWithSuffix";


export const InfoProyecto = ({ proyecto }: { proyecto: any }) => {
    const { globalColor } = useStylesStore()
    const [modalVisible, setModalVisible] = useState(false);
    const municipios = proyecto?.municipios_texto?.split(',');
    const downloadFile = async (id: number) => {
        try {
            await ExportsService.downloadFile(id);
        } catch (error) {
            console.error({ error })
        }
    }

    return <View className="w-full mt-4 bg-white rounded-lg shadow-md p-4 gap-4 items-start justify-center">
        <View className="flex-row justify-around gap-5 items-start">
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Fecha inicio</Text>
                <Text className="text-lg font-bold">
                    {
                        proyecto.fechaProyecto || proyecto.start_actSigning_date != null 
                        ? proyecto.fechaProyecto || proyecto.start_actSigning_date 
                        : 'Nulo'
                    }
                </Text>
            </View>
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Fecha fin</Text>
                <Text className="text-lg font-bold">
                    {
                        proyecto.fechaProyecto || proyecto.date_end_all != null 
                        ? proyecto.fechaProyecto || proyecto.date_end_all 
                        : 'Nulo'
                    }
                </Text>
            </View>
        </View>
        <View className="flex-row justify-around gap-5 items-start">
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Contrato</Text>
                <Text className="text-lg font-bold">
                    {proyecto.type || proyecto.id != null ? capitalize(proyecto.type) || proyecto.id : 'Nulo'}
                </Text>
            </View>
            <View className="justify-between items-start w-1/2">
                <Text className={`text-md text-gray-500`}>Estado</Text>
                <Text
                    className={`text-lg font-bold`}
                    style={{
                        color: proyecto.state_color != null
                            ? proyecto.state_color
                            : '#000'
                    }}
                >
                    {proyecto.state_name || proyecto.state != null ? proyecto.state_name || proyecto.state : 'Nulo'}
                </Text>
            </View>
        </View>
        <View className="flex-row justify-around gap-5 items-start">
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Sectorial</Text>
                <Text className="text-lg font-bold">
                    {proyecto.list_sector_name || proyecto.sector != null ? proyecto.list_sector_name || proyecto.sector : 'Nulo'}
                </Text>
            </View>
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Municipio</Text>
                {municipios &&
                    municipios.length > 1 ? (
                    <>
                        <Pressable className='' onPress={() => setModalVisible(true)}>
                            <Text style={{ color: globalColor }} className='font-bold text-lg'>Ver municipios</Text>
                        </Pressable>
                        <Modal
                            visible={modalVisible}
                            animationType="fade"
                            transparent={true}
                            onRequestClose={() => setModalVisible(false)}
                        >
                            <View className="flex-1 justify-center items-center bg-black bg-opacity-75">
                                <View className="bg-white p-8 rounded-lg w-3/4 gap-4">
                                    <Text className="text-xl font-bold mb-4">Municipios</Text>
                                    <ScrollView>
                                        {municipios.map((municipio: any, index: any) => (
                                            <Text key={index} className="text-black text-md mb-2"> {municipio.trim()}</Text>
                                        ))}
                                    </ScrollView>
                                    <CustomButtonPrimary rounded onPress={() => setModalVisible(false)} title='Cerrar' />
                                </View>
                            </View>
                        </Modal>
                    </>
                ) : (
                    <Text className="text-lg font-bold">{proyecto.municipios_texto ? proyecto.municipios_texto : 'Nulo'}</Text>
                )}
            </View>
        </View>
        <View className="flex-row justify-around gap-5 items-start">
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Contratista</Text>
                <Text className="text-lg font-bold">
                    {proyecto.BPIM != null || "" ? proyecto.BPIM : 'Nulo'}
                </Text>
            </View>
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Valor del proyecto</Text>
                <Text className="text-lg font-bold">
                    {proyecto.total_source_value != null
                        ? formatNumberWithSuffix(+proyecto.total_source_value)
                        : 'Nulo'}
                </Text>
            </View>
        </View>
        <View className="flex-row justify-around gap-5 items-start">
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Numero de contrato</Text>
                <Text className="text-lg font-bold">
                    {proyecto.contract_number || proyecto.value_exec != null ? proyecto.contract_number || proyecto.value_exec : 'Nulo'}
                </Text>
            </View>
        </View>

        <View className="justify-center items-center w-full mt-6">
            <CustomButtonPrimary rounded onPress={() => downloadFile(+proyecto.id)} title="Descargar informe" />
        </View>
    </View>
}