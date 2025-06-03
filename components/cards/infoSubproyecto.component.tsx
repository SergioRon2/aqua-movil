import { CustomButtonPrimary } from "components/buttons/mainButton.component";
import { generarReporteProyectoHTML } from "components/pdfTemplates/proyectoUnicoReporte.component"
import { useEffect, useState } from "react";
import { View, Text, Pressable, Modal, ScrollView, Alert } from "react-native";
import { ExportsService } from "services/exports/exports.service";
import useStylesStore from "store/styles/styles.store";
import { capitalize } from "utils/capitalize";
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { formatNumberWithSuffix } from "utils/formatNumberWithSuffix";

type Props = {
    subproyecto: any;
}


export const InfoSubProyecto = ({ subproyecto }: Props) => {
    const { globalColor } = useStylesStore()
    const [modalMunicipiosVisible, setModalMunicipiosVisible] = useState(false);
    const municipios = subproyecto?.municipios_texto?.split(',');

    const createPDF = async () => {
        try {
            const html = await generarReporteProyectoHTML(subproyecto);

            const { uri } = await Print.printToFileAsync({ html });

            // console.log('PDF generado:', uri, { html });

            await Sharing.shareAsync(uri);
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            Alert.alert('Error', 'No se pudo generar el PDF.');
        }
    };

    return <View className="w-full mt-4 bg-white rounded-lg shadow-md p-4 gap-4 items-start justify-center">
        <View className="flex-row justify-around gap-5 items-start">
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Fecha inicio</Text>
                <Text className="text-lg font-bold">
                    {
                        subproyecto.fechaProyecto != null
                            ? subproyecto.fechaProyecto
                            : 'Nulo'
                    }
                </Text>
            </View>
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Fecha fin</Text>
                <Text className="text-lg font-bold">
                    {
                        subproyecto.fechaProyecto != null
                            ? subproyecto.fechaProyecto
                            : 'Nulo'
                    }
                </Text>
            </View>
        </View>
        <View className="flex-row justify-around gap-5 items-start">
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Contrato</Text>
                <Text className="text-lg font-bold">
                    {subproyecto.type != null ? capitalize(subproyecto.type) : 'Nulo'}
                </Text>
            </View>
            <View className="justify-between items-start w-1/2">
                <Text className={`text-md text-gray-500`}>Estado</Text>
                <Text
                    className={`text-lg font-bold`}
                    style={{
                        color: subproyecto.state_color != null
                            ? subproyecto.state_color
                            : '#000'
                    }}
                >
                    {subproyecto.state_name != null ? subproyecto.state_name : 'Nulo'}
                </Text>
            </View>
        </View>
        <View className="flex-row justify-around gap-5 items-start">
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Sectorial</Text>
                <Text className="text-lg font-bold">
                    {subproyecto.list_sector_name != null ? subproyecto.list_sector_name : 'Nulo'}
                </Text>
            </View>
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Municipio</Text>
                {municipios &&
                    municipios.length > 1 ? (
                    <>
                        <Pressable className='' onPress={() => setModalMunicipiosVisible(true)}>
                            <Text style={{ color: globalColor }} className='font-bold text-lg'>Ver municipios</Text>
                        </Pressable>
                        <Modal
                            visible={modalMunicipiosVisible}
                            animationType="fade"
                            transparent={true}
                            onRequestClose={() => setModalMunicipiosVisible(false)}
                        >
                            <View className="flex-1 justify-center items-center bg-black bg-opacity-75">
                                <View className="bg-white p-8 rounded-lg w-3/4 gap-4">
                                    <Text className="text-xl font-bold mb-4">Municipios</Text>
                                    <ScrollView>
                                        {municipios.map((municipio: any, index: any) => (
                                            <Text key={index} className="text-black text-md mb-2"> {municipio.trim()}</Text>
                                        ))}
                                    </ScrollView>
                                    <CustomButtonPrimary rounded onPress={() => setModalMunicipiosVisible(false)} title='Cerrar' />
                                </View>
                            </View>
                        </Modal>
                    </>
                ) : (
                    <Text className="text-lg font-bold">{subproyecto.municipios_texto ? subproyecto.municipios_texto : 'Nulo'}</Text>
                )}
            </View>
        </View>
        <View className="flex-row justify-around gap-5 items-start">
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Contratista</Text>
                <Text className="text-lg font-bold">
                    {subproyecto.BPIM != null || "" ? subproyecto.BPIM : 'Nulo'}
                </Text>
            </View>
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Valor del proyecto</Text>
                <Text className="text-lg font-bold">
                    {subproyecto.total_source_value != null
                        ? formatNumberWithSuffix(+subproyecto.total_source_value)
                        : 'Nulo'}
                </Text>
            </View>
        </View>
        <View className="flex-row justify-around gap-5 items-start">
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Numero de contrato</Text>
                <Text className="text-lg font-bold">
                    {subproyecto.contract_number != null ? subproyecto.contract_number : 'Nulo'}
                </Text>
            </View>
        </View>

        <View className="justify-center items-center w-full mt-6">
            <CustomButtonPrimary rounded onPress={createPDF} title="Descargar informe" />
        </View>
    </View>
}