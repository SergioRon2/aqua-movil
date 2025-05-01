import { useNavigation } from '@react-navigation/native';
import { ISectorial } from 'interfaces/sectorial.interface';
import { View, Text, Pressable } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { parseCurrency } from 'utils/parseCurrency';
import { Ionicons } from '@expo/vector-icons';
import { formatNumberWithSuffix } from 'utils/formatNumberWithSuffix';
import useStylesStore from 'store/styles/styles.store';

interface Props {
    sectorialData: ISectorial;
}

export const SectorialCard = ({ sectorialData }: any) => {
    const {globalColor} = useStylesStore()
    const total = parseCurrency(sectorialData.valor);
    const ejecutado = parseCurrency(sectorialData.valorEjecutado);
    const progress = total > 0 ? ejecutado / total : 0;

    const navigation = useNavigation();

    const handleNavigate = () => {
        navigation.navigate('UniqueSectorial', { sectorial: sectorialData });
    };

    return (
        <Pressable onPress={handleNavigate} className='flex-row h-40 w-11/12 rounded-2xl justify-center items-center mx-auto mt-5 shadow-lg'>
            <View style={{backgroundColor: globalColor}} className='w-1/2 h-full rounded-l-2xl justify-center gap-2 items-center animate-fade-in'>
                <Text className='text-white text-2xl font-bold animate-fade-in'>{sectorialData.sectorial}</Text>
                <View className='flex-col justify-center items-center w-full mt-2 animate-fade-in'>
                    <View className='flex-row ml-16 justify-start w-full items-center mt-2'>
                        <Ionicons color={'white'} name='briefcase' size={20} />
                        <Text className='text-white ml-2 text-lg font-bold'>{sectorialData.proyectos.total}</Text>
                        <Text className='text-white ml-1 text-lg font-bold'>Proyectos</Text>
                    </View>
                    <View className='flex-row ml-16 justify-start items-center w-full mt-2'>
                        <Ionicons color={'white'} name='rocket' size={20} />
                        <Text className='text-white text-lg ml-2 font-bold'>{sectorialData.iniciativas}</Text>
                        <Text className='text-white text-lg ml-1 font-bold'>Iniciativas</Text>
                    </View>
                </View>
            </View>
            <View style={{borderColor: globalColor}} className='w-1/2 bg-white border-2 rounded-r-2xl p-5 h-full justify-center gap-4 items-center animate-fade-in'>
                <View className='w-full h-1/2 justify-center items-start animate-fade-in'>
                    <Text className='text-black text-md font-bold '>Valor de proyectos</Text>
                    <Text className='text-black text-4xl font-bold'>{formatNumberWithSuffix(total)}</Text>
                </View>
                <View className='w-full h-1/2 justify-center items-start animate-fade-in'>
                    <Text className='text-black text-md font-bold'>Valor ejecutado</Text>
                    <View className='w-full flex-row gap-3 justify-center items-center'>
                        <ProgressBar
                            progress={progress}
                            color={globalColor}
                            className='w-3/4 h-auto'
                            style={{ height: 10, borderRadius: 5, backgroundColor: '#aaa' }}
                        />
                        <Text className='text-gray-600 text-base '>
                            {`${(progress * 100).toFixed()}%`}
                        </Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );
}