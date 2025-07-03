import { FiltersComponentProyectos } from 'components/buttons/filters.component';
import { ProyectoCardPresentable } from 'components/cards/proyectoCardv2.component';
import { IProyecto } from 'interfaces/proyecto.interface';
import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, PanResponder, Pressable, Alert, RefreshControl, SectionList, SectionListData, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, FadeOutDown, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { ProjectsService } from 'services/projects/projects.service';
import useActiveStore from 'store/actives/actives.store';
import LottieView from 'lottie-react-native';
import useStylesStore from 'store/styles/styles.store';
import { Loading } from 'components/loading/loading.component';
import useInternetStore from 'store/internet/internet.store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import { generarTablaProyectosHTML } from 'components/pdfTemplates/proyectosReporte.component';
import { SelectedYears } from 'components/buttons/selectedYears.component';
import * as FileSystem from 'expo-file-system';
import { sanitizarNombreArchivo } from 'utils/sanitazeName';
import { agruparPorLetra } from 'utils/agruparPorLetra';

const ProyectosScreen = () => {
    const { globalColor } = useStylesStore()
    const [proyectos, setProyectos] = useState<IProyecto[]>([]);
    const { municipiosActivos, sectorialActivo, estadoActivo, fechaInicio, fechaFin, planDesarrolloActivo } = useActiveStore();
    const [loading, setLoading] = useState(true);
    const [todosLosProyectos, setTodosLosProyectos] = useState([]);
    const [proyectosAgrupados, setProyectosAgrupados] = useState<any[]>([]);
    const { online } = useInternetStore();
    const [refreshing, setRefreshing] = useState(false);
    const sectionListRef = useRef<SectionList<any>>(null);
    const [letraVisible, setLetraVisible] = useState<string | null>('A');
    const posicionesSecciones = useRef<Record<string, number>>({});
    const isUserScrolling = useRef(false);
    console.log({fechaInicio, fechaFin})

    const fetchProyectos = useCallback(async () => {
        try {
            setRefreshing(true);
            setLoading(true);
            if (online === null) return;

            let data = [];
            if (online) {
                const municipioIds = municipiosActivos.map((m) => m.id);
                const sectorialId = sectorialActivo?.id;
                const estadoId = estadoActivo?.id;

                const res = await ProjectsService.getAll({
                    municipio_ids: municipioIds,
                    sectorial_id: sectorialId,
                    estado_id: estadoId,
                    fechaInicio,
                    fechaFin,
                    development_plan_id: planDesarrolloActivo?.id
                });

                data = res?.data?.data || [];
                await AsyncStorage.setItem('proyectos', JSON.stringify(data));
            } else {
                const stored = await AsyncStorage.getItem('proyectos');
                data = stored ? JSON.parse(stored) : [];
            }

            let proyectosFiltrados = data
                .sort((a: any, b: any) => b.value_project - a.value_project);
            data = proyectosFiltrados;

            setTodosLosProyectos(data);

            let acumulado: IProyecto[] = data.slice(0, 100);
            setProyectosAgrupados(agruparPorLetra(acumulado));

            let index = 100;
            const interval = setInterval(() => {
                const next = data.slice(index, index + 100);
                index += 100;

                acumulado = [...acumulado, ...next];
                setProyectosAgrupados(agruparPorLetra(acumulado));

                if (acumulado.length >= data.length) {
                    clearInterval(interval);
                }
            }, 1000);
        } catch (error) {
            console.error({ error });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [online, municipiosActivos, sectorialActivo, estadoActivo, fechaInicio, fechaFin, planDesarrolloActivo?.id]);

    useEffect(() => {
        fetchProyectos();
    }, [fetchProyectos]);

    const onRefresh = () => {
        fetchProyectos();
    };

    const createPDF = async () => {
        try {
            const html = await generarTablaProyectosHTML(todosLosProyectos);

            const { uri } = await Print.printToFileAsync({ html });

            const fecha = new Date().toISOString().split('T')[0];
            const nombreArchivo = `tabla_proyectos_${sanitizarNombreArchivo(fecha)}.pdf`;
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

    const handleLetraPress = (letra: string) => {
        if (isUserScrolling.current) return;

        const sectionIndex = proyectosAgrupados.findIndex(
            (section) => section.letra.toUpperCase() === letra
        );

        if (sectionIndex !== -1) {
            sectionListRef.current?.scrollToLocation({
                sectionIndex,
                itemIndex: 0,
                animated: true,
                viewPosition: 0, // 0 = top, 0.5 = center, 1 = bottom
            });

            setLetraVisible(letra);
            setTimeout(() => setLetraVisible(null), 1000);
        }
    };


    return (
        <View className='flex-1 bg-white p-4'>
            <View className="flex-row items-center justify-center gap-1">
                <Text className='text-2xl text-center font-bold'>Proyectos</Text>
                {proyectos && (
                    <Pressable onPress={createPDF} className="flex-row justify-end items-center px-2 active:opacity-50">
                        <Ionicons
                            name="archive-outline"
                            size={28}
                            color={globalColor}
                            style={{ marginRight: 12 }}
                        />
                    </Pressable>
                )}
            </View>

            {/* selected years */}
            <SelectedYears />

            {/* filters */}
            <FiltersComponentProyectos border />

            {loading ? (
                <Loading />
            ) : proyectosAgrupados.length > 0 ? (
                <View className='flex-row items-start'>
                    <SectionList
                        ref={sectionListRef}
                        sections={proyectosAgrupados}
                        keyExtractor={(item, index) => `${item.id}-${index}`}
                        showsVerticalScrollIndicator={false}
                        getItemLayout={(data, index) => ({
                            length: 150,
                            offset: 150 * index,
                            index,
                        })}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[globalColor]} />
                        }
                        contentContainerStyle={{ paddingBottom: 250 }}
                        renderItem={({ item, index }) => (
                            <Animated.View entering={FadeInDown.delay(index * 200)} exiting={FadeOutDown}>
                                <ProyectoCardPresentable proyecto={item} />
                            </Animated.View>
                        )}
                        renderSectionHeader={({ section: { letra } }) => (
                            <View
                                onLayout={(event) => {
                                    const y = event.nativeEvent.layout.y;
                                    posicionesSecciones.current[letra] = y;
                                }}
                            >
                                <Text style={{ color: globalColor }} className='my-auto px-8 py-3 font-bold text-2xl mt-2'>{letra}</Text>
                            </View>
                        )}
                    />
                    <View className='flex-col items-center justify-center w-16 bg-white gap-2'>
                        {proyectosAgrupados.map(({ letra }) => (
                            <TouchableOpacity key={letra} onPress={() => handleLetraPress(letra)}>
                                <Text className='text-xl font-bold' style={{ color: globalColor }}>{letra}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            ) : (
                <View className='justify-center items-center m-auto'>
                    <LottieView
                        source={require('../../../../../assets/lottie/not_found.json')}
                        autoPlay
                        loop
                        style={{ width: 350, height: 350 }}
                    />
                    <Text style={{ color: globalColor }} className="text-center text-lg font-bold mt-4 animate-fade-in">No hay proyectos disponibles {!online && 'sin conexión'}.</Text>
                </View>
            )}
        </View>
    );
};


export default ProyectosScreen;