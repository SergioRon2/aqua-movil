import SectorialCard from 'components/cards/sectorialCard.component';
import { Loading } from 'components/loading/loading.component';
import { ISectorial } from 'interfaces/sectorial.interface';
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { SectoralService } from 'services/sectoral/sectoral.service';

const Sectoriales = () => {
    const [sectoriales, setSectoriales] = useState<ISectorial[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSectoriales = async () => {
            try {
                setLoading(true)
                const res = await SectoralService.getAllSectorals();
                setSectoriales(res?.data?.data)
            } catch (error) {
                console.error('Error fetching sectoriales:', error);
            } finally {
                setLoading(false)
            }
        }

        fetchSectoriales();
    }, [])

    return (
        <View className='h-full bg-white'>
            <Text className='text-2xl font-bold text-center py-4'>Sectoriales</Text>
            {loading ? (
                <Loading />
            ) : (
                <FlatList
                    data={sectoriales}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item, index }) => (
                        <Animated.View entering={FadeInDown.delay(index * 200)} exiting={FadeOutDown}>
                            <SectorialCard sectorialData={item} />
                        </Animated.View>
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />)}
        </View>
    )
};

export default Sectoriales;