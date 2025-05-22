import AsyncStorage from '@react-native-async-storage/async-storage';
import SectorialCard from 'components/cards/sectorialCard.component';
import { Loading } from 'components/loading/loading.component';
import { generarReporteSectorialesHTML } from 'components/pdfTemplates/sectorialesReporte.component';
import { ISectorial } from 'interfaces/sectorial.interface';
import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, FlatList, Alert, Modal } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { SectoralService } from 'services/sectoral/sectoral.service';
import useInternetStore from 'store/internet/internet.store';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import useActiveStore from 'store/actives/actives.store';
import { CustomButtonPrimary } from 'components/buttons/mainButton.component';

const Sectoriales = () => {
    const [sectoriales, setSectoriales] = useState<ISectorial[]>([])
    const [loading, setLoading] = useState(true)
    const { online } = useInternetStore();
    const { fechaInicio, fechaFin } = useActiveStore();

    useEffect(() => {
        const fetchSectoriales = async () => {
            try {
                setLoading(true);
                if (online) {
                    const res = await SectoralService.getAllSectorals();
                    setSectoriales(res?.data?.data);
                    // Save to AsyncStorage
                    await AsyncStorage.setItem('sectoriales', JSON.stringify(res?.data?.data));
                } else {
                    // Get from AsyncStorage
                    const stored = await AsyncStorage.getItem('sectoriales');
                    if (stored) {
                        setSectoriales(JSON.parse(stored));
                    } else {
                        setSectoriales([]);
                    }
                }
            } catch (error) {
                console.error('Error fetching sectoriales:', error);
            } finally {
                setLoading(false)
            }
        }

        fetchSectoriales();
    }, [])

    const createPDF = async (sectorialesData: ISectorial[]) => {
        try {
            const html = await generarReporteSectorialesHTML(sectorialesData, fechaInicio!, fechaFin!);

            const { uri } = await Print.printToFileAsync({ html });

            await Sharing.shareAsync(uri);
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            Alert.alert('Error', 'No se pudo generar el PDF.');
        }
    };

    return (
        <View className='h-full bg-white'>
            <Text className='text-2xl font-bold text-center py-4'>Sectoriales</Text>
            {loading ? (
                <Loading />
            ) : sectoriales && sectoriales.length > 0 ? (
                <FlatList
                    data={sectoriales}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item, index }) => (
                        <Animated.View entering={FadeInDown.delay(index * 200)} exiting={FadeOutDown}>
                            <SectorialCard sectorialData={item} />
                        </Animated.View>
                    )}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    ListFooterComponent={
                        <View className='w-full justify-center items-center mt-4'>
                            <CustomButtonPrimary onPress={() => createPDF(sectoriales)} rounded title='Descargar informe' />
                        </View>
                    }
                />
            ) : (
                <View className="flex justify-center items-center">
                    <LottieView
                        source={require('../../../../../assets/lottie/not_found.json')}
                        autoPlay
                        loop
                        style={{ width: 350, height: 350 }}
                    />
                    <Text className="text-lg text-gray-500 mt-4">No hay datos disponibles</Text>
                </View>
            )}
        </View>
    )
};

export default Sectoriales;