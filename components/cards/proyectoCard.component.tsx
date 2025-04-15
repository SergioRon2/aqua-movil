
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, Pressable } from 'react-native';

const ProyectoCard = ({ data }: any) => {
    const navigation = useNavigation();

    const handleNavigate = () => {
        navigation.navigate('Proyecto', { proyecto: data });
    };

    return (
        <Pressable className="bg-white rounded-lg shadow-md my-2 flex-row" onPress={handleNavigate}>
            <View className="p-3 w-2/3">
                <Text className="text-xl font-bold mb-1">{data?.name}</Text>
                <Text className="text-sm text-gray-600">{data?.financial_delay}</Text>
            </View>
            <View className='w-1/3 justify-center items-center'>
                <Text className={`font-bold text-base ${data?.state_name === 'Ejecutado' ? 'text-pink-600' : 'text-gray-600'}`}>{data?.state_name}</Text>
            </View>
        </Pressable>
    );
};

export default ProyectoCard;
