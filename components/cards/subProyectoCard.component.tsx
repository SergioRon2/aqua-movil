
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, Pressable } from 'react-native';
import useStylesStore from 'store/styles/styles.store';
import { formatNumberWithSuffix } from 'utils/formatNumberWithSuffix';

interface Props {
    data: any;
    setModalFalse?: (value: boolean) => void;
}

const SubProyectoCard = ({ data, setModalFalse }: Props) => {
    const { globalColor } = useStylesStore()
    const navigation = useNavigation();

    const handleNavigate = () => {
        if (setModalFalse) setModalFalse(false);
        navigation.navigate('SubProyecto', { subproyecto: data });
    };

    return (
        <Pressable
            style={{ borderColor: globalColor }}
            className={`bg-white border-2 rounded-lg my-2 flex-row shadow-lg`} onPress={handleNavigate}
        >
            <View className="p-3 w-2/3">
                <Text className="text-md font-bold mb-1">
                    {data?.name || data?.title != null ? data?.name || data?.title : 'Nulo'}
                </Text>
                <Text className="text-sm text-gray-600">
                    {data?.total_source_value || data?.project_value != null ? formatNumberWithSuffix(data?.total_source_value || data?.project_value) : 'Nulo'}
                </Text>
            </View>
            <View className='w-1/3 justify-center items-center'>
                <Text
                    className={`font-bold text-base`}
                    style={{ color: data?.state_color != null ? data?.state_color : '#000' }}
                >
                    {data?.state_name || data?.state != null ? data?.state_name || data?.state : 'Nulo'}
                </Text>
            </View>
        </Pressable>
    );
};

export default SubProyectoCard;