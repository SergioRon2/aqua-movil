import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomButtonPrimary } from 'components/buttons/mainButton.component';
import MunicipioCard from 'components/cards/municipioCard.component';
import { Loading } from 'components/loading/loading.component';
import { generarReporteMunicipiosHTML } from 'components/pdfTemplates/municipiosReporte.component';
import { IMunicipio } from 'interfaces/municipio.interface';
import LottieView from 'lottie-react-native';
import { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, Modal, RefreshControl } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import useInternetStore from 'store/internet/internet.store';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import useActiveStore from 'store/actives/actives.store';
import useStylesStore from 'store/styles/styles.store';
import { SelectedYears } from 'components/buttons/selectedYears.component';
import { FiltersSectoriales } from 'components/buttons/filterSectoriales.component';
import { StateService } from 'services/states/states.service';

const Municipios = () => {
    const [municipios, setMunicipios] = useState<IMunicipio[]>([]);
    const [municipiosCargados, setMunicipiosCargados] = useState(0);
    const [loading, setLoading] = useState(true);
    const { online } = useInternetStore();
    const { fechaInicio, fechaFin, sectorialActivo_MunicipiosScreen } = useActiveStore();
    const [refreshing, setRefreshing] = useState(false);
    const { globalColor } = useStylesStore();

    const onCardLoaded = useCallback(() => {
        setMunicipiosCargados(prev => {
            const newCount = prev + 1;
            if (newCount === municipios.length) {
                setLoading(false);
            }
            return newCount;
        });
    }, [municipios.length]);

    const fetchMunicipios = useCallback(async () => {
        try {
            setRefreshing(true);
            setLoading(true);
            if (online === null) return;

            if (online) {
                const res = await StateService.getStatesData({ fechaInicio, fechaFin, sectorial_id: sectorialActivo_MunicipiosScreen?.id });
                const municipiosData = res?.data?.graph_municipios_all;
                setMunicipios(municipiosData);
                await AsyncStorage.setItem('municipios', JSON.stringify(municipiosData));
            } else {
                const storedData = await AsyncStorage.getItem('municipios');
                if (storedData) {
                    setMunicipios(JSON.parse(storedData));
                } else {
                    setMunicipios([]);
                }
            }
            setMunicipiosCargados(0);
        } catch (error) {
            console.error('Error fetching municipios:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [online, fechaInicio, fechaFin, sectorialActivo_MunicipiosScreen]);

    useEffect(() => {
        fetchMunicipios();
    }, [fetchMunicipios]);


    const renderItem = useCallback(
        ({ item, index }: { item: IMunicipio; index: number }) => {
            const key = `${item.id}-${fechaInicio}-${fechaFin}`;
            return (
                <Animated.View key={key} entering={index < 10 ? FadeInDown.delay(index * 100) : undefined}>
                    <MunicipioCard
                        key={key}
                        municipioData={item}
                        onLoaded={onCardLoaded}
                        index={index}
                    />
                </Animated.View>
            );
        },
        [fechaInicio, fechaFin]
    );

    const createPDF = async (municipiosData: IMunicipio[]) => {
        try {
            const html = await generarReporteMunicipiosHTML(municipiosData, fechaInicio!, fechaFin!);

            const { uri } = await Print.printToFileAsync({ html });

            // console.log('PDF generado:', uri, { html });

            await Sharing.shareAsync(uri);
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            Alert.alert('Error', 'No se pudo generar el PDF.');
        }
    };


    const onRefresh = () => {
        fetchMunicipios();
    };

    return (
        <View className="h-full bg-white">
            <View>
                <Text className="text-2xl font-bold text-center pt-4">Municipios</Text>
            </View>
            <SelectedYears />
            <FiltersSectoriales />
            {loading ? (
                <Loading />
            ) : municipios && municipios.length > 0 ? (
                <>
                    <FlatList
                        data={municipios}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[globalColor]} />
                        }
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
        </View>
    )
}


export default Municipios;