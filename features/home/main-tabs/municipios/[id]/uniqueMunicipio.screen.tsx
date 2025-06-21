import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import ProyectoCard from "components/cards/proyectoCard.component";
import SemiDonutChart from "components/charts/semiDonutChart.component";
import { generarResumenMunicipioUnicoHTML } from "components/pdfTemplates/municipioUnicoReporte.component";
import { IProyecto } from "interfaces/proyecto.interface";
import { useCallback, useEffect, useState } from "react";
import { View, Text, Dimensions, ActivityIndicator, Alert, Pressable, ScrollView, RefreshControl } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import Carousel from 'react-native-reanimated-carousel';
import { InfoService } from 'services/info/info.service';
import { ProjectsService } from 'services/projects/projects.service';
import useActiveStore from 'store/actives/actives.store';
import useInternetStore from 'store/internet/internet.store';
import useStylesStore from 'store/styles/styles.store';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import { Loading } from "components/loading/loading.component";
import * as FileSystem from 'expo-file-system';
import { sanitizarNombreArchivo } from "utils/sanitazeName";

const UniqueMunicipioScreen = () => {
    const route = useRoute();
    const { globalColor } = useStylesStore();
    const { fechaInicio, fechaFin, planDesarrolloActivo } = useActiveStore();
    const { municipio } = route.params;
    const [proyectos, setProyectos] = useState<IProyecto[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [avances, setAvances] = useState({
        avanceFinanciero: { name: '', value: 0 },
        avanceFisico: { name: '', value: 0 },
        indicadorTiempo: { name: '', value: 0 },
    });
    const { online } = useInternetStore();
    const [tipoSeleccionado, setTipoSeleccionado] = useState<'proyecto' | 'iniciativa'>('proyecto');

    const fetchProyectos = useCallback(async () => {
        if (online === null) return;

        try {
            if (!refreshing) setLoading(true);
            let proyectosData = [];

            if (online) {
                const res = await ProjectsService.getAll({
                    municipio_ids: [municipio.id],
                    fechaInicio,
                    development_plan_id: planDesarrolloActivo?.id,
                    fechaFin,
                });
                proyectosData = res?.data?.data || [];

                const proyectosFiltrados = proyectosData
                    .filter((item: any) => item?.type === tipoSeleccionado)
                    .map((item: any) => ({
                        ...item,
                        value_project: item.value_project !== null ? Number(item.value_project) : 0
                    }))
                    .sort((a: any, b: any) => b.value_project - a.value_project);
                setProyectos(proyectosFiltrados);
                await AsyncStorage.setItem(
                    'proyectosMunicipio',
                    JSON.stringify(proyectosFiltrados)
                );
            } else {
                const stored = await AsyncStorage.getItem('proyectosMunicipio');
                proyectosData = stored ? JSON.parse(stored) : [];
                const proyectosFiltrados = proyectosData
                    .filter((item: any) => item?.type === tipoSeleccionado)
                    .map((item: any) => ({
                        ...item,
                        value_project: item.value_project !== null ? Number(item.value_project) : 0
                    }))
                    .sort((a: any, b: any) => b.value_project - a.value_project);
                setProyectos(proyectosFiltrados);
            }
        } catch (error) {
            console.error('Error fetching proyectos:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [municipio.id, fechaInicio, fechaFin, online, refreshing, tipoSeleccionado, planDesarrolloActivo?.id]);

    useEffect(() => {
        fetchProyectos();
    }, [fetchProyectos]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchProyectos();
    };

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                let infoData;
                if (online === null) {
                    return;
                }
                if (online) {
                    const res = await InfoService.getInfoByAllData({
                        development_plan_id: planDesarrolloActivo?.id,
                        municipio_id: municipio.id,
                        fechaInicio: fechaInicio,
                        fechaFin: fechaFin
                    });
                    infoData = res?.data;
                    try {
                        await AsyncStorage.setItem(
                            'infoMunicipio',
                            JSON.stringify(infoData)
                        );
                    } catch (storageError) {
                        console.error('Error saving info to AsyncStorage:', storageError);
                    }
                } else {
                    try {
                        const stored = await AsyncStorage.getItem('infoMunicipio');
                        infoData = stored ? JSON.parse(stored) : {};
                    } catch (storageError) {
                        console.error('Error reading info from AsyncStorage:', storageError);
                        infoData = {};
                    }
                }
                setAvances({
                    avanceFinanciero: { name: 'Avance financiero', value: infoData?.last_progress_financial_current },
                    avanceFisico: { name: 'Avance fisico', value: infoData?.last_progress_physical_current },
                    indicadorTiempo: { name: 'Indicador de tiempo ejecutado', value: infoData?.time_exec }
                });
            } catch (error) {
                console.error({ error });
            }
        };

        fetchInfo();
    }, [municipio.id, fechaInicio, fechaFin]);

    const createPDF = async () => {
        try {
            const html = await generarResumenMunicipioUnicoHTML(
                municipio?.name,
                proyectos,
                avances
            );

            const { uri } = await Print.printToFileAsync({ html });

            const fecha = new Date().toISOString().split('T')[0];
            const nombreBase = municipio?.name ?? 'municipio';
            const nombreSanitizado = sanitizarNombreArchivo(nombreBase);
            const nombreArchivo = `resumen_${nombreSanitizado}_${fecha}.pdf`;
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

    const items = [
        {
            title: avances.avanceFinanciero.name,
            component: <SemiDonutChart percentage={avances.avanceFinanciero.value} height={150} />,
        },
        {
            title: avances.avanceFisico.name,
            component: <SemiDonutChart percentage={avances.avanceFisico.value} height={150} />,
        },
        {
            title: avances.indicadorTiempo.name,
            component: <SemiDonutChart percentage={avances.indicadorTiempo.value} height={150} />,
        },
    ];

    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[globalColor]} />
            }
            className="w-full animate-fade-in px-12 flex-1 bg-white"
        >
            {
                loading ? (
                    <Loading />
                ) : (
                    <>
                        <View className="flex-row items-center justify-center gap-4">
                            <Text className="py-4 text-center text-3xl font-bold">{municipio.name}</Text>
                            <Pressable onPress={createPDF} className="flex-row justify-end items-center px-2 active:opacity-50">
                                <Ionicons
                                    name="archive-outline"
                                    size={28}
                                    color={globalColor}
                                    style={{ marginRight: 12 }}
                                />
                            </Pressable>
                        </View >

                        <View className='gap-4 mb-4 my-3 mx-auto w-full rounded-xl shadow-lg border border-gray-300 bg-white'>
                            <View className="justify-center items-center mt-6 rounded-lg h-auto">
                                <Carousel
                                    loop
                                    width={Dimensions.get('window').width - 90}
                                    height={160}
                                    data={items}
                                    scrollAnimationDuration={1000}
                                    renderItem={({ item }) => (
                                        <View className="w-full justify-center items-center">
                                            <Text className="mt-4 text-lg font-bold">{item.title}</Text>
                                            {item.component}
                                        </View>
                                    )}
                                />
                            </View>
                        </View>

                        <View className="h-auto animate-fade-in justify-start rounded-2xl py-3">
                            <View className="flex-row items-center justify-between px-4">
                                <Pressable onPress={() => setTipoSeleccionado('proyecto')}>
                                    <Text className="text-xl font-bold py-2" style={{ color: tipoSeleccionado === 'proyecto' ? globalColor : '#000' }}>
                                        Proyectos
                                    </Text>
                                </Pressable>
                                <Pressable onPress={() => setTipoSeleccionado('iniciativa')}>
                                    <Text className="text-xl font-bold py-2" style={{ color: tipoSeleccionado === 'iniciativa' ? globalColor : '#000' }}>
                                        Iniciativas
                                    </Text>
                                </Pressable>
                            </View>
                            {loading ? (
                                <ActivityIndicator size="large" color={globalColor} />
                            ) : proyectos.length > 0 ? (
                                <>
                                    <FlatList
                                        data={proyectos}
                                        scrollEnabled={false}
                                        keyExtractor={(item, index) => `${item.id}-${index}`}
                                        renderItem={({ item, index }) => (
                                            <Animated.View
                                                entering={index < 10 ? FadeInDown.delay(index * 200) : undefined}
                                                exiting={FadeOutDown}>
                                                <ProyectoCard data={item} />
                                            </Animated.View>
                                        )}
                                        contentContainerStyle={{ paddingBottom: 20 }}
                                    />
                                </>
                            ) : (
                                <View className="m-auto items-center justify-center">
                                    <Text
                                        style={{ color: globalColor }}
                                        className="mt-4 animate-fade-in text-center text-lg font-bold">
                                        No hay {tipoSeleccionado}s disponibles.
                                    </Text>
                                </View>
                            )}
                        </View>
                    </>
                )
            }
        </ScrollView >
    );
};

export default UniqueMunicipioScreen;
