import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomButtonPrimary } from 'components/buttons/mainButton.component';
import MunicipioCard from 'components/cards/municipioCard.component';
import { Loading } from 'components/loading/loading.component';
import { generarReporteMunicipiosHTML } from 'components/pdfTemplates/municipiosReporte.component';
import { IMunicipio } from 'interfaces/municipio.interface';
import LottieView from 'lottie-react-native';
import { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, FlatList, Alert, Modal } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MunicipalitiesService } from 'services/municipalities/municipalities.service';
import useInternetStore from 'store/internet/internet.store';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import useActiveStore from 'store/actives/actives.store';

const Municipios = () => {
    const [municipios, setMunicipios] = useState<IMunicipio[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingReporte, setLoadingReporte] = useState(false);
    const { online } = useInternetStore();
    const { fechaInicio, fechaFin } = useActiveStore();

    useEffect(() => {
        const fetchMunicipios = async () => {
            try {
                setLoading(true);
                if (online) {
                    const res = await MunicipalitiesService.getMunicipalitiesCesar();
                    setMunicipios(res?.data);
                    // Guarda los datos en AsyncStorage
                    await AsyncStorage.setItem('municipios', JSON.stringify(res?.data));
                } else {
                    // Si no hay conexión, usa los datos guardados
                    const storedData = await AsyncStorage.getItem('municipios');
                    if (storedData) {
                        setMunicipios(JSON.parse(storedData));
                    } else {
                        setMunicipios([]);
                    }
                }
            } catch (error) {
                console.error('Error fetching municipios:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMunicipios();
    }, [])

    const renderItem = useCallback(
        ({ item, index }: { item: IMunicipio; index: number }) => (
            <Animated.View entering={index < 10 ? FadeInDown.delay(index * 100) : undefined}>
                <MunicipioCard municipioData={item} />
            </Animated.View>
        ),
        []
    );

    const createPDF = async (municipiosData: IMunicipio[]) => {
        setLoadingReporte(true)
        try {
            const html = await generarReporteMunicipiosHTML(municipiosData, fechaInicio!, fechaFin!);

            const { uri } = await Print.printToFileAsync({ html });

            // console.log('PDF generado:', uri, { html });

            await Sharing.shareAsync(uri);
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            Alert.alert('Error', 'No se pudo generar el PDF.');
        } finally {
            setLoadingReporte(false)
        }
    };

    return (
        <View className="h-full bg-white">
            <View>
                <Text className="text-2xl font-bold text-center py-4">Municipios</Text>
            </View>
            {loading ? (
                <Loading />
            ) : municipios && municipios.length > 0 ? (
                <>
                    <FlatList
                        data={municipios}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        ListFooterComponent={() => (
                            <View className='w-full justify-center items-center mt-4'>
                                <CustomButtonPrimary onPress={() => createPDF(municipios)} rounded title='Descargar informe' />
                            </View>
                        )}
                    />
                </>
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

            {/* Modal para loading */}
            <Modal
                visible={loadingReporte}
                transparent
                animationType="fade"
            >
                <View className="flex-1 bg-black/30 justify-center items-center">
                    <View className='bg-white w-2/3 h-auto rounded-lg shadow-lg items-center justify-center'>
                        <Loading />
                        <Text className="text-black mt-4">Generando reporte...</Text>
                    </View>
                </View>
            </Modal>
        </View>
    )
}


export default Municipios;