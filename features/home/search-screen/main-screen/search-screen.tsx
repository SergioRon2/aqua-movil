import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackButton } from 'components/buttons/backButton.component';
import ProyectoCard from 'components/cards/proyectoCard.component';
import { IProyecto } from 'interfaces/proyecto.interface';
import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import { FlatList, Text, View, TextInput } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { ProjectsService } from 'services/projects/projects.service';
import useActiveStore from 'store/actives/actives.store';
import useInternetStore from 'store/internet/internet.store';
import useStylesStore from 'store/styles/styles.store';

const SearchScreen = () => {
    const { fechaInicio, fechaFin, planDesarrolloActivo } = useActiveStore();
    const { globalColor } = useStylesStore()
    const [searchValue, setSearchValue] = useState<string>('');
    const [proyectos, setProyectos] = useState<IProyecto[]>([]);
    const { online } = useInternetStore();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProyectos = async () => {
            setLoading(true);
            try {
                if (online === null) {
                    return;
                }
                if (online) {
                    const res = await ProjectsService.getAll();
                    setProyectos(res?.data?.data || []);
                    try {
                        await AsyncStorage.setItem('proyectos', JSON.stringify(res?.data?.data || []));
                    } catch (storageError) {
                        console.error('Error guardando en AsyncStorage', storageError);
                    }
                } else {
                    try {
                        const storedProyectos = await AsyncStorage.getItem('proyectos');
                        if (storedProyectos) {
                            setProyectos(JSON.parse(storedProyectos));
                        } else {
                            setProyectos([]);
                        }
                    } catch (storageError) {
                        console.error('Error leyendo de AsyncStorage', storageError);
                        setProyectos([]);
                    }
                }
            } catch (error) {
                console.error({ error });
            } finally {
                setLoading(false);
            }
        };

        fetchProyectos();
    }, [fechaInicio, fechaFin, planDesarrolloActivo?.id]);

    const handleChange = (text: string) => {
        setSearchValue(text);
    };

    const filteredProjects = proyectos
        .filter((proyecto) => {
            const search = searchValue.toLowerCase();
            if (search === 'proyecto' || search === 'iniciativa') {
                return proyecto.type?.toLowerCase() === search
            }
            return (
                proyecto.name?.toLowerCase().includes(search) ||
                proyecto.BPIM?.toLowerCase().includes(search) ||
                proyecto.list_sector_name?.toLowerCase().includes(search) ||
                proyecto.municipios_texto?.toLowerCase().includes(search) ||
                proyecto.state_name?.toLowerCase().includes(search)
            );
        })
        .sort((a: any, b: any) => (b.value_project ?? 0) - (a.value_project ?? 0));

    return (
        <View className='flex-1 bg-white items-center justify-start'>
            <View className='h-1/6 gap-3 w-full rounded-3xl items-center justify-center flex-row'>
                <BackButton />
                <TextInput
                    onChangeText={handleChange}
                    value={searchValue}
                    placeholder='Buscar'
                    style={{
                        borderColor: globalColor,
                        color: searchValue === 'proyecto' || searchValue === 'iniciativa' ? globalColor : '#000',
                        fontWeight: (searchValue === 'proyecto' || searchValue === 'iniciativa') ? 'bold' : 'normal'
                    }}
                    className='border rounded-full px-6 py-4 w-2/3'
                />
            </View>

            <View className='justify-center items-center h-5/6 w-full px-4'>
                {!searchValue ? (
                    <Text className='text-xl text-center'>
                        Hola, ¿estás buscando algún proyecto?
                    </Text>
                ) : filteredProjects.length > 0 ? (
                    <FlatList
                        data={filteredProjects}
                        keyExtractor={(item, index) => `${item.id}-${index}`}
                        renderItem={({ item, index }) => (
                            <Animated.View entering={FadeInDown.delay(index * 200)} exiting={FadeOutDown}>
                                <ProyectoCard data={item} />
                            </Animated.View>
                        )}
                    />
                ) : loading ? (
                    <ActivityIndicator size="large" color={globalColor} className="mt-4" />
                ) : (
                    <View className='justify-center items-center m-auto'>
                        <LottieView
                            source={require('../../../../assets/lottie/not_found.json')}
                            autoPlay
                            loop
                            style={{ width: 200, height: 200 }}
                        />
                        <Text style={{ color: globalColor }} className="text-center text-lg font-bold mt-4 animate-fade-in">No hay proyectos disponibles.</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

export default SearchScreen;
