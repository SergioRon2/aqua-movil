import { FiltersComponentProyectos } from 'components/buttons/filters.component';
import { ProyectoCardPresentable } from 'components/cards/proyectoCardv2.component';
import { IProyecto } from 'interfaces/proyecto.interface';
import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, Pressable, Alert } from 'react-native';
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

const ProyectosScreen = () => {
    const { globalColor } = useStylesStore()
    const [proyectos, setProyectos] = useState<IProyecto[]>([]);
    const { municipiosActivos, sectorialActivo, estadoActivo, fechaInicio, fechaFin } = useActiveStore();
    const [loading, setLoading] = useState(true);
    const { online } = useInternetStore();

    useEffect(() => {
        const fetchProyectos = async () => {
            try {
                setLoading(true);
                if (online) {
                    const municipioIds = municipiosActivos.map((m) => m.id);
                    const sectorialId = sectorialActivo?.id;
                    const estadoId = estadoActivo?.id;
                    const res = await ProjectsService.getAll({
                        municipio_ids: municipioIds,
                        sectorial_id: sectorialId,
                        estado_id: estadoId,
                        fechaInicio: fechaInicio,
                        fechaFin: fechaFin
                    });
                    setProyectos(res?.data?.data);
                    // Guarda los datos en AsyncStorage
                    await AsyncStorage.setItem('proyectos', JSON.stringify(res?.data?.data));
                } else {
                    // Si no hay internet, usa los datos almacenados
                    const storedProyectos = await AsyncStorage.getItem('proyectos');
                    if (storedProyectos) {
                        setProyectos(JSON.parse(storedProyectos));
                    } else {
                        setProyectos([]);
                    }
                }
            } catch (error) {
                console.error({ error })
            } finally {
                setLoading(false)
            }
        }

        fetchProyectos()
    }, [municipiosActivos, sectorialActivo, estadoActivo, fechaInicio, fechaFin])

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
                <Text className='text-2xl text-center font-bold my-4'>Proyectos</Text>
                <Pressable onPress={createPDF} className="flex-row justify-end items-center px-2 active:opacity-50">
                    <Ionicons
                        name="archive-outline"
                        size={28}
                        color={globalColor}
                        style={{ marginRight: 12 }}
                    />
                </Pressable>
            </View>

            {/* filters */}
            <FiltersComponentProyectos border />

            {loading ? (
                <Loading />
            ) : proyectos.length > 0 ? (
                <FlatList
                    data={proyectos}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
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