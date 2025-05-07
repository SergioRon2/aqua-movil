import MunicipioCard from 'components/cards/municipioCard.component';
import { Loading } from 'components/loading/loading.component';
import { IMunicipio } from 'interfaces/municipio.interface';
import LottieView from 'lottie-react-native';
import { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MunicipalitiesService } from 'services/municipalities/municipalities.service';

const Municipios = () => {
    const [municipios, setMunicipios] = useState<IMunicipio[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMunicipios = async () => {
            try {
                setLoading(true);
                const res = await MunicipalitiesService.getMunicipalitiesCesar();
                setMunicipios(res?.data);
            } catch (error) {
                console.error('Error fetching municipios:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMunicipios();
    }, [])

    const renderItem = useCallback(
        ({ item, index }: { item: IMunicipio; index: number }) => (
            <Animated.View entering={index < 10 ? FadeInDown.delay(index * 100) : undefined}>
                <MunicipioCard municipioData={item} />
            </Animated.View>
        ),
        []
    );

    return (
        <View className="h-full bg-white">
            <Text className="text-2xl font-bold text-center py-4">Municipios</Text>
            {loading ? (
                <Loading />
            ) : municipios && municipios.length > 0 ? (
                <FlatList
                    data={municipios}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            ) : (
                <View className="flex justify-center items-center">
                    <LottieView
                        source={require('../../../../../assets/lottie/not_found.json')}
                        autoPlay
                        loop
                        style={{ width: 350, height: 350 }}
                    />
                    <Text className="text-lg text-gray-500 mt-4">No hay datos disponibles</Text>
                </View>
            )}
        </View>
    )
}


export default Municipios;