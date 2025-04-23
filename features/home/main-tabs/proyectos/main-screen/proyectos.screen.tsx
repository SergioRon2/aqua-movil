import { FiltersComponentProyectos } from 'components/buttons/filters.component';
import { ProyectoCardPresentable } from 'components/cards/proyectoCardv2.component';
import { IProyecto } from 'interfaces/proyecto.interface';
import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { ProjectsService } from 'services/projects/projects.service';
import useActiveStore from 'store/actives/actives.store';

const ProyectosScreen = () => {
    const [proyectos, setProyectos] = useState<IProyecto[]>([]);
    const { municipiosActivos, sectorialActivo } = useActiveStore();

    useEffect(() => {
        const fetchProyectos = async () => {
            try {
                const municipioIds = municipiosActivos.map((m) => m.id);
                const sectorialId = sectorialActivo?.id;
                const res = await ProjectsService.getAll(municipioIds, sectorialId);
                setProyectos(res?.data?.data);
            } catch (error) {
                console.log({ error })
            }
        }

        fetchProyectos()
    }, [municipiosActivos, sectorialActivo])

    return (
        <View className='flex-1 bg-gray-100 p-4'>
            <Text className='text-2xl text-center font-bold my-4'>Proyectos</Text>

            {/* filters */}
            <FiltersComponentProyectos border />

            {proyectos === undefined ? (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#db2777" />
            </View>
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
            <Text className="text-center text-black mt-4 animate-fade-in">No hay proyectos disponibles</Text>
            )}
        </View>
    );
};


export default ProyectosScreen;