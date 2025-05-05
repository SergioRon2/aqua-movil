import { BackButton } from 'components/buttons/backButton.component';
import ProyectoCard from 'components/cards/proyectoCard.component';
import { IProyecto } from 'interfaces/proyecto.interface';
import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import { FlatList, Text, View, TextInput } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { ProjectsService } from 'services/projects/projects.service';
import useStylesStore from 'store/styles/styles.store';

const SearchScreen = () => {
    const {globalColor} = useStylesStore()
    const [searchValue, setSearchValue] = useState<string>('');
    const [proyectos, setProyectos] = useState<IProyecto[]>([]);

    useEffect(() => {
        const fetchProyectos = async () => {
            try {
                const res = await ProjectsService.getAll();
                setProyectos(res?.data?.data || []);
            } catch (error) {
                console.error({ error });
            }
        };

        fetchProyectos();
    }, []);

    const handleChange = (text: string) => {
        setSearchValue(text);
    };

    const filteredProjects = proyectos.filter((proyecto) =>
        proyecto.name?.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
        <View className='flex-1 bg-white items-center justify-start'>
            <View className='h-1/6 gap-3 w-full rounded-3xl items-center justify-center flex-row'>
                <BackButton />
                <TextInput
                    onChangeText={handleChange}
                    value={searchValue}
                    placeholder='Filtra por el nombre'
                    style={{borderColor: globalColor}}
                    className='border-2 rounded-full px-6 py-4 w-2/3'
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
                ) : (
                    <View className='justify-center items-center m-auto'>
                        <LottieView
                            source={require('../../../../assets/lottie/not_found.json')}
                            autoPlay
                            loop
                            style={{ width: 200, height: 200 }}
                        />
                        <Text style={{color: globalColor}} className="text-center text-lg font-bold mt-4 animate-fade-in">No hay proyectos disponibles.</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

export default SearchScreen;
