import { CustomButtonPrimary } from "components/buttons/mainButton.component";
import { IProyecto, IProyectoDashboard } from "interfaces/proyecto.interface";
import { useEffect, useState } from "react";
import { View, Text, Pressable, Modal, ScrollView, FlatList, Alert, ActivityIndicator } from "react-native";
import { ExportsService } from "services/exports/exports.service";
import { ProjectsService } from "services/projects/projects.service";
import useStylesStore from "store/styles/styles.store";
import { capitalize } from "utils/capitalize";
import { formatNumberWithSuffix } from "utils/formatNumberWithSuffix";
import SubProyectoCard from "./subProyectoCard.component";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { generarReporteProyectoHTML } from "components/pdfTemplates/proyectoUnicoReporte.component";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useInternetStore from "store/internet/internet.store";
import * as FileSystem from 'expo-file-system';

type Props = {
    proyecto: any;
    infoProyecto?: any;
}


export const InfoProyecto = ({ proyecto, infoProyecto }: Props) => {
    const { globalColor } = useStylesStore()
    const [modalMunicipiosVisible, setModalMunicipiosVisible] = useState(false);
    const [modalSubproyectosVisible, setModalSubproyectosVisible] = useState(false);
    const [modalAdjuntosVisible, setModalAdjuntosVisible] = useState(false);
    const [subProjects, setSubProjects] = useState<any>();
    const municipios = proyecto?.municipios_texto?.split(',');
    const [loading, setLoading] = useState<boolean>(false)
    const { online } = useInternetStore();

    useEffect(() => {
        const fetchSubProjects = async () => {
            try {
                setLoading(true)
                const storageKey = `subprojects_${infoProyecto?.principal_contract_id}`;
                if (online === null) {
                    return;
                }
                if (online) {
                    const res = await ProjectsService.getSubProjects(infoProyecto?.principal_contract_id);
                    setSubProjects(res.data);
                    await AsyncStorage.setItem(storageKey, JSON.stringify(res.data));
                } else {
                    const cached = await AsyncStorage.getItem(storageKey);
                    if (cached) {
                        setSubProjects(JSON.parse(cached));
                    } else {
                        setSubProjects([]);
                    }
                }
            } catch (error) {
                console.error({ error })
            } finally {
                setLoading(false)
            }
        }

        fetchSubProjects();
    }, [infoProyecto?.principal_contract_id])

    const downloadFile = async (id: number) => {
        try {
            await ExportsService.downloadFile(id);
        } catch (error) {
            console.error({ error })
        }
    }

    const createPDF = async () => {
        try {
            const html = await generarReporteProyectoHTML(proyecto, subProjects.length);

            const { uri } = await Print.printToFileAsync({ html });

            // console.log('PDF generado:', uri, { html });

            await Sharing.shareAsync(uri);
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            Alert.alert('Error', 'No se pudo generar el PDF.');
        }
    };

    return <View className="w-full mt-4 bg-white rounded-lg shadow-md p-4 gap-4 items-start justify-center">
        {infoProyecto?.description && (
            <View className="justify-between items-start">
                <Text className="text-md text-gray-500 text-start">Descripcion</Text>
                <Text className="text-md font-bold text-start">{capitalize(infoProyecto?.description)}</Text>
            </View>
        )}
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
            {subProjects && subProjects.length > 0 && (
                <View className="justify-between items-start w-1/2">
                    <Text className="text-md text-gray-500">Subproyectos</Text>
                    <Pressable onPress={() => setModalSubproyectosVisible(true)}>
                        <Text style={{ color: globalColor }} className="text-lg font-bold">
                            {subProjects.length} subproyectos
                        </Text>
                    </Pressable>
                </View>
            )}
        </View>
        <View className="flex-row justify-around gap-5 items-start">
            {infoProyecto?.files && infoProyecto?.files.length > 0 && (
                <View className="justify-between items-start w-1/2">
                    <Text className="text-md text-gray-500">Adjuntos</Text>
                    <Pressable onPress={() => setModalAdjuntosVisible(true)}>
                        <Text style={{ color: globalColor }} className="text-lg font-bold">
                            {infoProyecto.files.length} adjuntos
                        </Text>
                    </Pressable>
                </View>
            )}
        </View>

        <View className="justify-center items-center w-full mt-6">
            <CustomButtonPrimary rounded onPress={createPDF} title="Descargar informe" />
        </View>



        <Modal
            visible={modalSubproyectosVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setModalSubproyectosVisible(false)}
        >
            <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-white p-8 rounded-lg w-3/4 h-2/4 gap-4 justify-between items-center">
                    <Text className="text-xl font-bold mb-4">Subproyectos</Text>

                    {subProjects && (
                        <FlatList
                            className=""
                            data={subProjects}
                            keyExtractor={(_, idx) => idx.toString()}
                            renderItem={({ item, index }) => (
                                <Animated.View entering={FadeInDown.delay(index * 200)} exiting={FadeOutDown}>
                                    <SubProyectoCard setModalFalse={setModalSubproyectosVisible} data={item} />
                                </Animated.View>
                            )}
                            ListEmptyComponent={
                                <Text className="text-md text-gray-500">No hay subproyectos disponibles.</Text>
                            }
                            style={{ maxHeight: 300 }}
                        />
                    )}

                    <CustomButtonPrimary rounded onPress={() => setModalSubproyectosVisible(false)} title="Cerrar" />
                </View>
            </View>
        </Modal>

        <Modal
            visible={modalAdjuntosVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setModalAdjuntosVisible(false)}
        >
            <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-white p-8 rounded-lg w-3/4 h-2/4 gap-4 justify-between items-center">
                    <Text className="text-xl font-bold mb-4">Adjuntos</Text>

                    <FlatList
                        className=""
                        data={infoProyecto?.files}
                        keyExtractor={(_, idx) => idx.toString()}
                        renderItem={({ item, index }) => (
                            <Animated.View entering={FadeInDown.delay(index * 200)} exiting={FadeOutDown}>
                                <Pressable onPress={() => downloadFile(item.id)} style={{ borderColor: globalColor }} className="shadow-lg border-2 bg-white w-full rounded-xl justify-start items-center p-5 active:opacity-50">
                                    {loading ? <ActivityIndicator size={'small'} color={globalColor} /> : <Text className="text-sm">{item.name}</Text>}
                                </Pressable>
                            </Animated.View>
                        )}
                        ListEmptyComponent={
                            <Text className="text-md text-gray-500">No hay adjuntos disponibles.</Text>
                        }
                        style={{ maxHeight: 300 }}
                    />

                    <CustomButtonPrimary rounded onPress={() => setModalAdjuntosVisible(false)} title="Cerrar" />
                </View>
            </View>
        </Modal>
    </View>
}