import { MunicipioCard } from 'components/cards/municipioCard.component';
import { municipios } from 'data/data';
import { View, Text, ScrollView, FlatList } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

const Municipios = () => {
    return (
        <View className='h-full'>
            <Text className='text-2xl font-bold text-center py-4'>Municipios</Text>
            <FlatList
                data={municipios}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                    <Animated.View entering={FadeInDown.delay(index * 200)} exiting={FadeOutDown}>
                        <MunicipioCard municipioData={item} />
                    </Animated.View>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    )
}


export default Municipios;