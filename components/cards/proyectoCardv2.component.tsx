import { View, Text, Pressable } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { IProyecto } from 'interfaces/proyecto.interface';
import { formatNumberWithSuffix } from 'utils/formatNumberWithSuffix';
import { parseCurrency } from 'utils/parseCurrency';
import { parseProgress } from 'utils/parseProgress';


interface Props {
    proyecto: IProyecto;
}

export const ProyectoCardPresentable = ({ proyecto }: Props) => {
    const navigation = useNavigation();

    const valorTotal = parseCurrency(proyecto.value_project);
    const progresoFinanciero = parseProgress(proyecto.financial_current ?? 0) / 100;
    const progresoFisico = parseProgress(proyecto.physical_current ?? 0) / 100;

    const handleNavigate = () => {
        navigation.navigate('Proyecto', { proyecto });
    };

    return (
        <Pressable
            onPress={handleNavigate}
            className="bg-white border-2 border-pink-600 p-4 w-11/12 rounded-2xl justify-center items-start mx-auto mt-4 shadow-xl"
        >
            <Text className="text-black text-lg font-bold mb-5">{proyecto.name}</Text>
            <Text className="text-gray-600 text-md font-bold mb-1">{proyecto.municipios_texto}</Text>
            <Text className="text-gray-600 text-md font-bold mb-5">
                ${formatNumberWithSuffix(valorTotal)}
            </Text>

            <View className="w-full mb-2">
                <Text className="text-gray-700 text-sm font-bold mb-1">Avance financiero</Text>
                <View className="flex-row items-center gap-2">
                    <ProgressBar
                        progress={progresoFinanciero}
                        color="#db2777"
                        className='w-2/4 h-auto'
                        style={{ height: 10, borderRadius: 5, backgroundColor: '#aaa' }}
                    />
                    <Text className="text-gray-600 text-sm">{(progresoFinanciero * 100).toFixed(0)}%</Text>
                </View>
            </View>

            <View className="w-full mb-2">
                <Text className="text-gray-700 text-sm font-bold mb-1">Avance físico</Text>
                <View className="flex-row items-center gap-2">
                    <ProgressBar
                        progress={progresoFisico}
                        color="#db2777" 
                        className='w-2/4 h-auto'
                        style={{ height: 10, borderRadius: 5, backgroundColor: '#aaa' }}
                    />
                    <Text className="text-gray-600 text-sm">{(progresoFisico * 100).toFixed(0)}%</Text>
                </View>
            </View>

            <View className="w-full items-end mt-6">
                <Text
                    className="text-white px-2 py-1 rounded-full text-xs font-bold"
                    style={{ backgroundColor: proyecto.state_color }}
                >
                    {proyecto.state_name}
                </Text>
            </View>
        </Pressable>
    );
};
