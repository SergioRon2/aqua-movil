import { FiltersComponentProyectos } from 'components/buttons/filters.component';
import { ProyectoCardPresentable } from 'components/cards/proyectoCardv2.component';
import { IProyecto } from 'interfaces/proyecto.interface';
import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { ProjectsService } from 'services/projects/projects.service';
import useActiveStore from 'store/actives/actives.store';
import LottieView from 'lottie-react-native';
import useStylesStore from 'store/styles/styles.store';
import { Loading } from 'components/loading/loading.component';

const ProyectosScreen = () => {
    const { globalColor } = useStylesStore()
    const [proyectos, setProyectos] = useState<IProyecto[]>([]);
    const { municipiosActivos, sectorialActivo, estadoActivo, fechaInicio, fechaFin } = useActiveStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProyectos = async () => {
            try {
                setLoading(true);
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
            } catch (error) {
                console.error({ error })
            } finally {
                setLoading(false)
            }
        }

        fetchProyectos()
    }, [municipiosActivos, sectorialActivo, estadoActivo, fechaInicio, fechaFin])

    return (
        <View className='flex-1 bg-white p-4'>
            <View>
                <Text className='text-2xl text-center font-bold my-4'>Proyectos</Text>
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