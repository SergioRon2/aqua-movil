import { ISectorial } from 'interfaces/sectorial.interface';
import { View, Text, Pressable } from 'react-native';
import { ProgressBar } from 'react-native-paper';

interface Props {
    sectorialData: ISectorial;
}

const parseCurrency = (value: string): number => {
    return Number(value.replace(/[^0-9.-]+/g, ''));
};

export const SectorialCard = ({ sectorialData }: Props) => {
    const total = parseCurrency(sectorialData.valor);
    const ejecutado = parseCurrency(sectorialData.valorEjecutado);
    const progress = total > 0 ? ejecutado / total : 0;

    return (
        <Pressable onPress={() => console.log({sectorialData})} className='bg-pink-100 p-1 flex-row h-40 w-11/12 rounded-2xl justify-center items-center mx-auto mt-5 animate-fade-in'>
            <View className='bg-pink-300 w-1/2 h-full rounded-2xl justify-center gap-2 items-center animate-fade-in'>
                <Text className='text-black text-2xl font-bold animate-fade-in'>{sectorialData.sectorial}</Text>
                <View className='flex-row justify-center items-center w-full mt-2 animate-fade-in'>
                    <View className='flex-col justify-around items-center w-1/2 mt-2'>
                        <Text className='text-black text-3xl font-bold'>{sectorialData.proyectos}</Text>
                        <Text className='text-gray-700 text-md font-bold'>Proyectos</Text>
                    </View>
                    <View className='flex-col justify-around items-center w-1/2 mt-2'>
                        <Text className='text-black text-3xl font-bold'>{sectorialData.iniciativas}</Text>
                        <Text className='text-gray-700 text-md font-bold'>Iniciativas</Text>
                    </View>
                </View>
            </View>
            <View className='w-1/2 bg-pink-100 rounded-r-2xl p-5 h-full justify-center gap-4 items-center animate-fade-in'>
                <View className='w-full h-1/2 justify-center items-start animate-fade-in'>
                    <Text className='text-black text-md font-bold '>Valor de proyectos</Text>
                    <Text className='text-black text-3xl font-bold'>{sectorialData.valor}</Text>
                </View>
                <View className='w-full h-1/2 justify-center items-start animate-fade-in'>
                    <Text className='text-black text-md font-bold'>Valor ejecutado</Text>
                    <View className='w-full flex-row gap-3 justify-center items-center'>
                        <ProgressBar
                            progress={progress}
                            color="#db2777"
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