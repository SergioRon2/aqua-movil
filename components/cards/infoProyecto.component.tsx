import { CustomButtonPrimary } from "components/buttons/mainButton.component";
import { IProyecto, IProyectoDashboard } from "interfaces/proyecto.interface";
import { useCallback, useEffect, useState } from "react";
import { View, Text, Pressable, Modal, ScrollView, FlatList, Alert, ActivityIndicator, Image } from "react-native";
import { useRef } from "react";
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
import useActiveStore from "store/actives/actives.store";
import { InfoService } from "services/info/info.service";
import { sanitizarNombreArchivo } from "utils/sanitazeName";

type Props = {
    proyecto: any;
    infoProyecto?: any;
}


export const InfoProyecto = ({ proyecto, infoProyecto }: Props) => {
    const { globalColor } = useStylesStore()
    const { fechaInicio, fechaFin, planDesarrolloActivo } = useActiveStore();
    const [modalMunicipiosVisible, setModalMunicipiosVisible] = useState(false);
    const [modalSubproyectosVisible, setModalSubproyectosVisible] = useState(false);
    const [modalAdjuntosVisible, setModalAdjuntosVisible] = useState(false);
    const [subProjects, setSubProjects] = useState<any>();
    const municipios = proyecto?.municipios_texto?.split(',');
    const [loading, setLoading] = useState<boolean>(false)
    const [proyectoInfo, setProyectoInfo] = useState<any>()
    const [avances, setAvances] = useState({
        avanceFinanciero: { name: '', value: 0 },
        avanceFisico: { name: '', value: 0 },
        indicadorTiempo: { name: '', value: 0 },
    });
    const flatListRef = useRef<FlatList<any>>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { online } = useInternetStore();

    const fetchInfo = useCallback(async () => {
        try {
            setLoading(true);
            if (online === null) {
                return;
            }

            if (online) {
                const res = await InfoService.getInfoByAllData({
                    development_plan_id: planDesarrolloActivo?.id,
                    project_id: proyecto.id,
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin
                });
                const avancesData = {
                    avanceFinanciero: { name: 'Avance financiero', value: res?.data?.last_progress_financial_current },
                    avanceFisico: { name: 'Avance fisico', value: res?.data?.last_progress_physical_current },
                    indicadorTiempo: { name: 'Indicador de tiempo ejecutado', value: res?.data?.time_exec }
                };
                console.log({ avancesData })
                setAvances(avancesData);
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
        } finally {
            setLoading(false);
        }
    }, [online, fechaInicio, fechaFin, planDesarrolloActivo?.id, proyecto.id]);

    useEffect(() => {
        fetchInfo();
    }, [fetchInfo]);

    const fetchInfoProyect = useCallback(async () => {
        try {
            if (online === null) {
                return;
            }

            if (online) {
                const res = await InfoService.getInfoByProject(proyecto?.id);
                setProyectoInfo(res.data);
                if (res.data) {
                    await AsyncStorage.setItem(`info_proyecto_${proyecto?.id}`, JSON.stringify(res.data));
                }
            } else {
                const cached = await AsyncStorage.getItem(`info_proyecto_${proyecto?.id}`);
                setProyectoInfo(cached ? JSON.parse(cached) : {});
                if (cached) {
                    return JSON.parse(cached);
                }
            }
        } catch (error) {
            console.error({ error })
        }
    }, [online, proyecto?.id]);

    useEffect(() => {
        fetchInfoProyect();
    }, [fetchInfoProyect]);

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

    useEffect(() => {
        if (!proyecto || !infoProyecto || !proyectoInfo) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [proyecto, infoProyecto]);

    const downloadFile = async (id: number) => {
        try {
            await ExportsService.downloadFile(id);
        } catch (error) {
            console.error({ error })
        }
    }

    const createPDF = async () => {
        try {
            const html = await generarReporteProyectoHTML(
                proyecto,
                subProjects.length,
                infoProyecto,
                avances
            );

            const { uri } = await Print.printToFileAsync({ html });

            const fecha = new Date().toISOString().split('T')[0];

            const nombreCrudo =
                proyecto?.name ??
                proyecto?.title ??
                'reporte';

            const nombreProyecto = sanitizarNombreArchivo(nombreCrudo);
            const nombreArchivo = `proyecto_${nombreProyecto}_${fecha}.pdf`;
            const nuevaRuta = FileSystem.documentDirectory + nombreArchivo;

            await FileSystem.moveAsync({
                from: uri,
                to: nuevaRuta,
            });

            await Sharing.shareAsync(nuevaRuta);
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            Alert.alert('Error', 'No se pudo generar el PDF.');
        }
    };


    return <View className="w-full mt-4 bg-white rounded-lg shadow-md p-4 gap-4 min-h-80 items-start justify-center">
        {loading ? (<ActivityIndicator size={'large'} color={globalColor} className="m-auto" />) : (
            <>
                {infoProyecto?.description && (
                    <View className="justify-between items-start">
                        <Text className="text-md text-gray-500 text-start">Descripción</Text>
                        <Text className="text-md font-bold text-start">{capitalize(infoProyecto?.description)}</Text>
                    </View>
                )}
                <View className="flex-row justify-around gap-5 items-start">
                    <View className="justify-between items-start w-1/2">
                        <Text className="text-md text-gray-500">Fecha de inicio</Text>
                        <Text className="text-lg font-bold">
                            {
                                proyecto.fechaProyecto || proyecto.start_actSigning_date != null
                                    ? proyecto.fechaProyecto || proyecto.start_actSigning_date
                                    : 'Nulo'
                            }
                        </Text>
                    </View>
                    <View className="justify-between items-start w-1/2">
                        <Text className="text-md text-gray-500">Fecha de finalización</Text>
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
                            {proyecto.list_sector_name || proyecto.sector != null ? capitalize(proyecto.list_sector_name || proyecto.sector) : 'Nulo'}
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
                                    <View className="flex-1 justify-center items-center bg-black/75">
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
                            {proyectoInfo?.name_contract || 'Nulo'}
                        </Text>
                    </View>
                    <View className="justify-between items-start w-1/2">
                        <Text className="text-md text-gray-500">Valor inicial del proyecto</Text>
                        <Text className="text-lg font-bold">
                            {formatNumberWithSuffix(+proyectoInfo?.value_init_project) ?? 0}
                        </Text>
                    </View>
                </View>
                <View className="flex-row justify-around gap-5 items-start">
                    <View className="justify-between items-start w-1/2">
                        <Text className="text-md text-gray-500">Número de contrato</Text>
                        <Text className="text-lg font-bold">
                            {proyectoInfo?.number_contract || 'Nulo'}
                        </Text>
                    </View>
                    <View className="justify-between items-start w-1/2">
                        <Text className="text-md text-gray-500">Valor total del proyecto</Text>
                        <Text className="text-lg font-bold">
                            {formatNumberWithSuffix(+proyectoInfo?.value_project) ?? 0}
                        </Text>
                    </View>
                </View>
                <View className="flex-row justify-around gap-5 items-start">
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
                                        <Text className="text-md text-gray-500">No hay subproyectos disponibles {!online && 'sin conexión'}.</Text>
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
                        <View className="bg-white p-8 rounded-lg w-11/12 h-3/5 gap-4 justify-between items-center">
                            <Text className="text-xl font-bold mb-4">Adjuntos</Text>
                            <View className="w-full items-center">
                                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                                    {/* Botón izquierdo */}
                                    {infoProyecto?.files.length > 1 && (
                                        <Pressable
                                            onPress={() => flatListRef.current?.scrollToIndex({ index: Math.max(currentIndex - 1, 0), animated: true })}
                                            disabled={currentIndex === 0}
                                            style={{ opacity: currentIndex === 0 ? 0.3 : 1, padding: 8 }}
                                        >
                                            <Text style={{ fontSize: 24 }}>{'<'}</Text>
                                        </Pressable>
                                    )}

                                    {/* Carrusel */}
                                    <FlatList
                                        ref={flatListRef}
                                        data={infoProyecto?.files}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(_, idx) => idx.toString()}
                                        renderItem={({ item, index }) => (
                                            <View style={{ width: 250, alignItems: 'center', marginHorizontal: 10 }}>
                                                <Animated.View entering={FadeInDown.delay(index * 200)} exiting={FadeOutDown}>
                                                    <View className="shadow-lg border-2 bg-white h-full w-full rounded-xl justify-center items-center px-8 py-12" style={{ borderColor: globalColor }}>
                                                        <View className="w-full items-center">
                                                            {item.path?.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) ? (
                                                                <View className="w-full h-auto flex items-center justify-center">
                                                                    <Image
                                                                        source={{ uri: item.url }}
                                                                        style={{ width: 180, height: 180, borderRadius: 12, marginBottom: 8 }}
                                                                        resizeMode="contain"
                                                                    />
                                                                </View>
                                                            ) : (
                                                                <View className="w-[180px] h-[180px] justify-center items-center mb-2">
                                                                    <View
                                                                        className="w-[120px] h-[160px] border-2 border-gray-200 rounded-lg bg-gray-50 justify-center items-center shadow"
                                                                        style={{
                                                                            shadowColor: '#000',
                                                                            shadowOffset: { width: 0, height: 2 },
                                                                            shadowOpacity: 0.1,
                                                                            shadowRadius: 4,
                                                                            elevation: 2,
                                                                        }}
                                                                    >
                                                                        <Text className="text-4xl text-gray-400">📄</Text>
                                                                        <Text className="text-xs mt-2 text-gray-500">
                                                                            {item.path?.split('.').pop()?.toUpperCase() || 'ARCHIVO'}
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                            )}
                                                            <Text className="text-sm text-center mb-2">
                                                                {item.name}
                                                                {item.created_at && (
                                                                    <Text className="text-xs text-gray-400">
                                                                        {"\n"}
                                                                        {new Date(item.created_at).toLocaleDateString()}
                                                                    </Text>
                                                                )}
                                                            </Text>
                                                        </View>
                                                        <CustomButtonPrimary
                                                            rounded
                                                            onPress={() => downloadFile(item.id)}
                                                            title="Descargar"
                                                        />
                                                    </View>
                                                </Animated.View>
                                            </View>
                                        )}
                                        pagingEnabled
                                        onMomentumScrollEnd={ev => {
                                            const idx = Math.round(ev.nativeEvent.contentOffset.x / 250);
                                            setCurrentIndex(idx);
                                        }}
                                        style={{ flexGrow: 0, maxHeight: 300 }}
                                    />

                                    {/* Botón derecho */}
                                    {infoProyecto?.files.length > 1 && (
                                        <Pressable
                                            onPress={() => flatListRef.current?.scrollToIndex({ index: Math.min(currentIndex + 1, (infoProyecto?.files?.length ?? 1) - 1), animated: true })}
                                            disabled={currentIndex === (infoProyecto?.files?.length ?? 1) - 1}
                                            style={{ opacity: currentIndex === (infoProyecto?.files?.length ?? 1) - 1 ? 0.3 : 1, padding: 8 }}
                                        >
                                            <Text style={{ fontSize: 24 }}>{'>'}</Text>
                                        </Pressable>
                                    )}
                                </View>
                            </View>
                            <CustomButtonPrimary rounded onPress={() => setModalAdjuntosVisible(false)} title="Cerrar" />
                        </View>
                    </View>
                </Modal>
            </>
        )}
    </View>
}