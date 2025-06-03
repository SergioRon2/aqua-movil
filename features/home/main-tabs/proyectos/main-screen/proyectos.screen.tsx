import { FiltersComponentProyectos } from 'components/buttons/filters.component';
import { ProyectoCardPresentable } from 'components/cards/proyectoCardv2.component';
import { IProyecto } from 'interfaces/proyecto.interface';
import { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, Pressable, Alert, RefreshControl } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
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

const ProyectosScreen = () => {
    const { globalColor } = useStylesStore()
    const [proyectos, setProyectos] = useState<IProyecto[]>([]);
    const { municipiosActivos, sectorialActivo, estadoActivo, fechaInicio, fechaFin } = useActiveStore();
    const [loading, setLoading] = useState(true);
    const [todosLosProyectos, setTodosLosProyectos] = useState([]);
    const { online } = useInternetStore();
    const [refreshing, setRefreshing] = useState(false);

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
                    fechaFin
                });

                data = res?.data?.data || [];
                await AsyncStorage.setItem('proyectos', JSON.stringify(data));
            } else {
                const stored = await AsyncStorage.getItem('proyectos');
                data = stored ? JSON.parse(stored) : [];
            }

            setTodosLosProyectos(data); // Guardamos todo
            setProyectos(data.slice(0, 100)); // Mostramos los primeros 100

            // Progresivo: cada 1s mostramos 100 más
            let index = 100;
            const interval = setInterval(() => {
                setProyectos((prev) => {
                    const next = data.slice(index, index + 100);
                    index += 100;
                    const updated = [...prev, ...next];
                    if (updated.length >= data.length) {
                        clearInterval(interval);
                    }
                    return updated;
                });
            }, 1000);
        } catch (error) {
            console.error({ error });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [online, municipiosActivos, sectorialActivo, estadoActivo, fechaInicio, fechaFin]);

    useEffect(() => {
        fetchProyectos();
    }, [fetchProyectos]);

    const onRefresh = () => {
        fetchProyectos();
    };

    const createPDF = async () => {
        try {
            const html = await generarTablaProyectosHTML(proyectos);

            const { uri } = await Print.printToFileAsync({ html, width: 1600 });

            // console.log('PDF generado:', uri, { html });

            await Sharing.shareAsync(uri);
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            Alert.alert('Error', 'No se pudo generar el PDF.');
        }
    };
    return (
        <View className='flex-1 bg-white p-4'>
            <View className="flex-row items-center justify-center gap-4">
                <Text className='text-2xl text-center font-bold'>Proyectos</Text>
                <Pressable onPress={createPDF} className="flex-row justify-end items-center px-2 active:opacity-50">
                    <Ionicons
                        name="archive-outline"
                        size={28}
                        color={globalColor}
                        style={{ marginRight: 12 }}
                    />
                </Pressable>
            </View>

            {/* selected years */}
            <SelectedYears />

            {/* filters */}
            <FiltersComponentProyectos border />

            {loading ? (
                <Loading />
            ) : proyectos.length > 0 ? (
                <FlatList
                    data={proyectos}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[globalColor]} />
                    }
                    renderItem={({ item, index }) => (
                        <Animated.View entering={FadeInDown.delay(index * 200)} exiting={FadeOutDown}>
                            <ProyectoCardPresentable proyecto={item} />
                        </Animated.View>
                    )}
                />
            ) : (
                <View className='justify-center items-center m-auto'>
                    <LottieView
                        source={require('../../../../../assets/lottie/not_found.json')}
                        autoPlay
                        loop
                        style={{ width: 350, height: 350 }}
                    />
                    <Text style={{ color: globalColor }} className="text-center text-lg font-bold mt-4 animate-fade-in">No hay proyectos disponibles.</Text>
                </View>
            )}
        </View>
    );
};


export default ProyectosScreen;