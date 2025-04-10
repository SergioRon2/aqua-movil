import { SectorialCard } from 'components/cards/sectorialCard.component';
import { sectoriales } from 'data/data';
import { View, Text, ScrollView, FlatList } from 'react-native';

const Sectoriales = () => {
    return (
        <View className='h-full'>
            <Text className='text-2xl font-bold text-center py-4'>Sectoriales</Text>
            <FlatList
                data={sectoriales}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <SectorialCard sectorialData={item} />
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    )
};

export default Sectoriales;