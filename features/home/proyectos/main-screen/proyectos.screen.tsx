import ProyectoCard from 'components/cards/proyectoCard.component';
import { IProyectos } from 'interfaces/municipio.interface';
import { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { ProjectsService } from 'services/projects/projects.service';

const ProyectosScreen = () => {
    const [proyectos, setProyectos] = useState<any[]>([]);

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
            <Text className='text-2xl font-bold'>Proyectos</Text>
            <FlatList
                data={proyectos}
                keyExtractor={(item) => item.id}
                renderItem={(item: any) => (
                    <ProyectoCard data={item} />
                )}
            />
        </View>
    );
};


export default ProyectosScreen;