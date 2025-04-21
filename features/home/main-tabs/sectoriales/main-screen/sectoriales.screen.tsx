import { SectorialCard } from 'components/cards/sectorialCard.component';
import { sectoriales } from 'data/data';
import { ISectorial } from 'interfaces/sectorial.interface';
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { SectoralService } from 'services/sectoral/sectoral.service';

const Sectoriales = () => {
    // const [sectoriales, setSectoriales] = useState<ISectorial[]>([])

    // useEffect(() => {
    //     const fetchSectoriales = async() => {
    //         const res = await SectoralService.getAllSectorals();
    //         setSectoriales(res?.data?.data)
    //     }

    //     fetchSectoriales();
    // }, [])

    return (
        <View className='h-full'>
            <Text className='text-2xl font-bold text-center py-4'>Sectoriales</Text>
            <FlatList
                data={sectoriales}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                    <Animated.View entering={FadeInDown.delay(index * 200)} exiting={FadeOutDown}>
                        <SectorialCard sectorialData={item} />
                    </Animated.View>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    )
};

export default Sectoriales;