import { useNavigation } from '@react-navigation/native';
import { ISectorial } from 'interfaces/sectorial.interface';
import { View, Text, Pressable } from 'react-native';
import { ActivityIndicator, ProgressBar } from 'react-native-paper';
import { parseCurrency } from 'utils/parseCurrency';
import { Ionicons } from '@expo/vector-icons';
import { formatNumberWithSuffix } from 'utils/formatNumberWithSuffix';
import useStylesStore from 'store/styles/styles.store';
import { capitalize } from 'utils/capitalize';
import { memo, useCallback, useEffect, useState } from 'react';
import { StateService } from 'services/states/states.service';
import useActiveStore from 'store/actives/actives.store';
import useInternetStore from 'store/internet/internet.store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CardLoading } from './cardMunicipioSectorialLoading.component';

interface Props {
    sectorialData: any;
    onLoaded: () => void;
    index: number;
}

const SectorialCard = ({ sectorialData, onLoaded, index }: Props) => {
    const { globalColor } = useStylesStore()
    const { fechaInicio, fechaFin, planDesarrolloActivo } = useActiveStore()
    const [loading, setLoading] = useState<boolean>(false)
    const [sectorialInfo, setSectorialInfo] = useState<any>()
    const { online } = useInternetStore();
    const navigation = useNavigation();

    const fetchProjectsByDashboard = useCallback(async () => {
        const key = `sectorialInfo_${sectorialData.id}`;
        let isMounted = true;

        try {
            setLoading(true);
            let data;

            if (online === null) return;

            if (online) {
                const res = await StateService.getStatesData({
                    sectorial_id: sectorialData.sector_id,
                    fechaInicio,
                    fechaFin,
                    development_plan_id: planDesarrolloActivo?.id
                });
                data = res?.data;
                if (data) {
                    await AsyncStorage.setItem(key, JSON.stringify(data));
                }
            } else {
                const stored = await AsyncStorage.getItem(key);
                data = stored ? JSON.parse(stored) : null;
            }

            if (isMounted) {
                setSectorialInfo(data || {});
                onLoaded();
            }
        } catch (error) {
            console.error({ error });
        } finally {
            if (isMounted) {
                setLoading(false);
                onLoaded();
            }
        }

        // Para cancelar en caso de desmontaje
        return () => {
            isMounted = false;
        };
    }, [sectorialData.id, fechaInicio, fechaFin, online, planDesarrolloActivo?.id]);

    useEffect(() => {
        const delay = index * 1000; // espera 1000ms por cada índice
        const timeout = setTimeout(() => {
            fetchProjectsByDashboard();
        }, delay);

        return () => clearTimeout(timeout); // limpieza por si el componente se desmonta
    }, [fechaInicio, fechaFin]);

    const handleNavigate = useCallback(() => {
        navigation.navigate('UniqueSectorial', { sectorial: sectorialData });
    }, [navigation, sectorialData]);

    const total = sectorialInfo?.value_total_project
    const ejecutado = sectorialInfo?.value_total_executed
    const progress = total > 0 ? ejecutado / total : 0;

    if (!sectorialInfo) return <CardLoading />;

    return (
        <Pressable onPress={handleNavigate} className='flex-row h-40 w-11/12 rounded-2xl justify-center items-center mx-auto mt-5 shadow-lg'>
            <View style={{ backgroundColor: globalColor }} className='w-1/2 h-full rounded-l-2xl justify-center items-center'>
                {
                    loading ? (
                        <ActivityIndicator size={'small'} color={'white'} className='w-full h-full' />
                    ) : (
                        <>
                            <Text
                                className='text-white text-2xl font-bold text-center'
                                numberOfLines={2}
                                adjustsFontSizeToFit
                            >
                                {capitalize(sectorialData?.sector_name)}
                            </Text>
                            <View className='flex-col justify-center items-center w-full mt-2'>
                                <View className='flex-row ml-16 justify-start w-full items-center mt-2'>
                                    <Ionicons color={'white'} name='briefcase' size={20} />
                                    <Text className='text-white ml-2 text-lg font-bold'>{sectorialInfo?.amount_project_initiatives}</Text>
                                    <Text className='text-white ml-1 text-lg font-bold'>Proyectos</Text>
                                </View>
                                <View className='flex-row ml-16 justify-start items-center w-full mt-2'>
                                    <Ionicons color={'white'} name='rocket' size={20} />
                                    <Text className='text-white text-lg ml-2 font-bold'>{sectorialInfo?.amount_initiatives}</Text>
                                    <Text className='text-white text-lg ml-1 font-bold'>Iniciativas</Text>
                                </View>
                            </View>
                        </>
                    )
                }
            </View>
            <View style={{ borderColor: globalColor }} className='w-1/2 bg-white border rounded-r-2xl p-5 h-full justify-center gap-4 items-center'>
                {
                    !loading ? (
                        <>
                            <View className='w-full h-1/2 justify-center items-start'>
                                <Text className='text-black text-md font-bold '>Valor de proyectos</Text>
                                <Text className='text-black text-4xl font-bold'>{formatNumberWithSuffix(+total)}</Text>
                            </View>
                            <View className='w-full h-1/2 justify-center items-start'>
                                <Text className='text-black text-md font-bold'>Total ejecutado</Text>
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
                        </>
                    ) : (
                        <ActivityIndicator size={'small'} color={globalColor} className='w-full h-full animate-fade-in' />
                    )
                }
            </View>
        </Pressable>
    );
}

export default memo(SectorialCard);