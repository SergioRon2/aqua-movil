import { FiltersComponent } from 'components/buttons/filters.component';
import ProyectoCard from 'components/cards/proyectoCard.component';
import { ProyectoCardPresentable } from 'components/cards/proyectoCardv2.component';
import { IProyecto } from 'interfaces/proyecto.interface';
import { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { ProjectsService } from 'services/projects/projects.service';

const ProyectosScreen = () => {
    const [proyectos, setProyectos] = useState<IProyecto[]>([]);

    useEffect(() => {
        const fetchProyectos = async () => {
            try {
                const res = await ProjectsService.getAll();
                setProyectos(res?.data?.data);
            } catch (error) {
                console.log({ error })
            }
        }

        fetchProyectos()
    }, [])


    return (
        <View className='flex-1 bg-gray-100 p-4'>
            <Text className='text-2xl text-center font-bold my-4'>Proyectos</Text>

            {/* filters */}
            <FiltersComponent border/>

            <FlatList
                data={proyectos}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <Animated.View entering={FadeInDown.delay(index * 200)} exiting={FadeOutDown}>
                        <ProyectoCardPresentable proyecto={item} />
                    </Animated.View>
                )}
            />
        </View>
    );
};


export default ProyectosScreen;