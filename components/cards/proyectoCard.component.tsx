
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, Pressable } from 'react-native';

const ProyectoCard = ({ data, index }: any) => {
    const navigation = useNavigation();

    const handleNavigate = () => {
        navigation.navigate('Proyecto', { proyecto: data.item });
    };

    const delayClass = `delay-[${index * 100}ms]`;


    return (
        <Pressable 
            className={`bg-white rounded-lg my-2 flex-row animate-fade-in ${delayClass}`} onPress={handleNavigate}
        >
            <View className="p-3 w-2/3">
                <Text className="text-xl font-bold mb-1">
                    {data?.item?.name != null ? data?.item?.name : 'Nulo'}
                </Text>
                <Text className="text-sm text-gray-600">
                    {data?.item?.financial_delay != null ? data?.item?.financial_delay : 'Nulo'}
                </Text>
            </View>
            <View className='w-1/3 justify-center items-center'>
                <Text 
                    className={`font-bold text-base`} 
                    style={{ color: data?.item?.state_color != null ? data?.item?.state_color : '#000' }}
                >
                    {data?.item?.state_name != null ? data?.item?.state_name : 'Nulo'}
                </Text>
            </View>
        </Pressable>
    );
};

export default ProyectoCard;