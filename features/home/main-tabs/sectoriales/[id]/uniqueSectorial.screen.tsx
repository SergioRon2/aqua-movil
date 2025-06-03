import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import ProyectoCard from "components/cards/proyectoCard.component";
import SemiDonutChart from "components/charts/semiDonutChart.component";
import { generarResumenSectorialUnicoHTML } from "components/pdfTemplates/sectorialUnicoReporte.component";
import { IProyecto } from "interfaces/proyecto.interface";
import { useCallback, useEffect, useState } from "react";
import { View, Text, Dimensions, ActivityIndicator, ScrollView, Alert, Pressable, RefreshControl } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import Carousel from 'react-native-reanimated-carousel';
import { InfoService } from "services/info/info.service";
import { ProjectsService } from "services/projects/projects.service";
import useActiveStore from "store/actives/actives.store";
import useInternetStore from "store/internet/internet.store";
import useStylesStore from "store/styles/styles.store";
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import { Loading } from "components/loading/loading.component";
import * as FileSystem from 'expo-file-system';

const UniqueSectorialScreen = () => {
    const { globalColor } = useStylesStore()
    const { fechaInicio, fechaFin, planDesarrolloActivo } = useActiveStore();
    const route = useRoute();
    const { sectorial } = route.params;
    const [proyectos, setProyectos] = useState<IProyecto[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [avances, setAvances] = useState({
        avanceFinanciero: { name: '', value: 0 },
        avanceFisico: { name: '', value: 0 },
        indicadorTiempo: { name: '', value: 0 },
    });
    const { online } = useInternetStore();

    const fetchProyectos = useCallback(async () => {
        try {
            setRefreshing(true);
            setLoading(true);
            if (online === null) return;

            if (online) {
                const res = await ProjectsService.getAll({
                    sectorial_id: sectorial.id,
                    fechaInicio,
                    fechaFin,
                });
                const proyectos = res?.data?.data;
                setProyectos(proyectos);
                await AsyncStorage.setItem(
                    `proyectosSectorial`,
                    JSON.stringify(proyectos)
                );
            } else {
                const stored = await AsyncStorage.getItem(`proyectosSectorial`);
                if (stored) {
                    setProyectos(JSON.parse(stored));
                } else {
                    setProyectos([]);
                }
            }
        } catch (error) {
            console.error('Error fetching proyectos:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [online, sectorial.id, fechaInicio, fechaFin]);

    useEffect(() => {
        fetchProyectos();
    }, [fetchProyectos]);

    const onRefresh = () => {
        fetchProyectos();
    };


    useEffect(() => {
        const fetchInfo = async () => {
            try {
                if (online === null) {
                    return;
                }
                if (online) {
                    const res = await InfoService.getInfoByAllData({
                        development_plan_id: planDesarrolloActivo?.id,
                        sectorial_id: sectorial.id,
                        fechaInicio: fechaInicio,
                        fechaFin: fechaFin
                    });
                    setAvances({
                        avanceFinanciero: { name: 'Avance financiero', value: res?.data?.last_progress_financial_current },
                        avanceFisico: { name: 'Avance fisico', value: res?.data?.last_progress_physical_current },
                        indicadorTiempo: { name: 'Indicador de tiempo ejecutado', value: res?.data?.time_exec }
                    });
                    await AsyncStorage.setItem(
                        `avancesSectorial`,
                        JSON.stringify({
                            avanceFinanciero: { name: 'Avance financiero', value: res?.data?.last_progress_financial_current },
                            avanceFisico: { name: 'Avance fisico', value: res?.data?.last_progress_physical_current },
                            indicadorTiempo: { name: 'Indicador de tiempo ejecutado', value: res?.data?.time_exec }
                        })
                    );
                } else {
                    const stored = await AsyncStorage.getItem(`avancesSectorial`);
                    if (stored) {
                        setAvances(JSON.parse(stored));
                    } else {
                        setAvances({
                            avanceFinanciero: { name: '', value: 0 },
                            avanceFisico: { name: '', value: 0 },
                            indicadorTiempo: { name: '', value: 0 }
                        });
                    }
                }
            } catch (error) {
                console.error({ error })
            }
        }

        fetchInfo();
    }, [sectorial.id, fechaInicio, fechaFin])

    const createPDF = async () => {
        try {
            const html = await generarResumenSectorialUnicoHTML(sectorial?.name, proyectos?.length, avances);

            const { uri } = await Print.printToFileAsync({ html });

            // console.log('PDF generado:', uri, { html });

            console.log(avances.indicadorTiempo.value)

            await Sharing.shareAsync(uri);
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            Alert.alert('Error', 'No se pudo generar el PDF.');
        }
    };

    const items = [
        { title: avances.avanceFinanciero.name, component: <SemiDonutChart percentage={avances.avanceFinanciero.value || 0} height={240} /> },
        { title: avances.avanceFisico.name, component: <SemiDonutChart percentage={avances.avanceFisico.value || 0} height={240} /> },
        { title: avances.indicadorTiempo.name, component: <SemiDonutChart percentage={avances.indicadorTiempo.value || 0} height={240} /> },
    ];

    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[globalColor]} />
            }
            className="animate-fade-in px-12 w-full flex-1 bg-white"
        >
            {loading ? (
                <Loading />
            ) : (
                <>
                    <View className="flex-row items-center justify-center gap-4">
                        <Text className="py-6 text-center text-3xl font-bold">{sectorial.sector_name}</Text>
                        <Pressable onPress={createPDF} className="flex-row justify-end items-center px-2 active:opacity-50">
                            <Ionicons
                                name="archive-outline"
                                size={28}
                                color={globalColor}
                                style={{ marginRight: 12 }}
                            />
                        </Pressable>
                    </View>

                    <View className='gap-4 mb-4 my-3 mx-auto w-full rounded-xl shadow-lg border border-gray-300 bg-white'>
                        <View className="justify-center items-center mt-6 rounded-lg h-auto">
                            <Carousel
                                loop
                                width={Dimensions.get('window').width - 90}
                                height={200}
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


                    <View className="h-auto rounded-2xl justify-center animate-fade-in py-3">
                        {
                            loading ? (
                                <ActivityIndicator size={'large'} color={globalColor} />
                            ) :
                                proyectos.length > 0 ? (
                                    <View className="mb-8">
                                        <Text className="text-xl font-bold py-2">
                                            Proyectos
                                        </Text>
                                        <FlatList
                                            data={proyectos}
                                            scrollEnabled={false}
                                            keyExtractor={(item, index) => `${item.id}-${index}`}
                                            renderItem={({ item, index }) => (
                                                <Animated.View entering={index < 10 ? FadeInDown.delay(index * 200) : undefined} exiting={FadeOutDown}>
                                                    <ProyectoCard data={item} />
                                                </Animated.View>
                                            )}
                                            contentContainerStyle={{ paddingBottom: 20 }}
                                        />
                                    </View>
                                ) : (
                                    <View className='justify-center items-center m-auto'>
                                        <Text style={{ color: globalColor }} className="text-center text-lg font-bold mt-4 animate-fade-in">No hay proyectos disponibles.</Text>
                                    </View>
                                )
                        }
                    </View>
                </>
            )}
        </ScrollView>
    );
}


export default UniqueSectorialScreen;