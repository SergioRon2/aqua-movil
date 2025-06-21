import AsyncStorage from '@react-native-async-storage/async-storage';
import SectorialCard from 'components/cards/sectorialCard.component';
import { Loading } from 'components/loading/loading.component';
import { generarReporteSectorialesHTML } from 'components/pdfTemplates/sectorialesReporte.component';
import { ISectorial } from 'interfaces/sectorial.interface';
import LottieView from 'lottie-react-native';
import { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, FlatList, Alert, Modal, RefreshControl } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import useInternetStore from 'store/internet/internet.store';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import useActiveStore from 'store/actives/actives.store';
import { CustomButtonPrimary } from 'components/buttons/mainButton.component';
import useStylesStore from 'store/styles/styles.store';
import { SelectedYears } from 'components/buttons/selectedYears.component';
import { FiltersMunicipios } from 'components/buttons/filterMunicipios.component';
import { StateService } from 'services/states/states.service';
import * as FileSystem from 'expo-file-system';

const Sectoriales = () => {
    const [sectoriales, setSectoriales] = useState<any[]>([])
    const [sectorialesCargados, setSectorialesCargados] = useState(0)
    const [loading, setLoading] = useState(true)
    const { online } = useInternetStore();
    const { fechaInicio, fechaFin, municipioActivo_SectorialesScreen, planDesarrolloActivo } = useActiveStore();
    const [refreshing, setRefreshing] = useState(false);
    const { globalColor } = useStylesStore();

    const onCardLoaded = useCallback(() => {
        setSectorialesCargados(prev => {
            const newCount = prev + 1;
            if (newCount === sectoriales.length) {
                setLoading(false);
            }
            return newCount;
        });
    }, [sectoriales.length]);

    const fetchSectoriales = useCallback(async () => {
        try {
            setRefreshing(true);
            setLoading(true);
            if (online === null) return;

            if (online) {
                const res = await StateService.getStatesData({ fechaInicio, fechaFin, municipio_id: municipioActivo_SectorialesScreen?.id, development_plan_id: planDesarrolloActivo?.id });
                const sectorialesData = res?.data?.list_sectorial_response;
                setSectoriales(sectorialesData);
                await AsyncStorage.setItem('sectoriales', JSON.stringify(sectorialesData));
            } else {
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
            setLoading(false);
            setRefreshing(false);
        }
    }, [online, fechaInicio, fechaFin, municipioActivo_SectorialesScreen]);

    useEffect(() => {
        fetchSectoriales();
    }, [fetchSectoriales]);

    const onRefresh = () => {
        fetchSectoriales();
    };

    const renderItem = useCallback(
        ({ item, index }: { item: any; index: number }) => {
            const safeFechaInicio = fechaInicio ?? 'sin-inicio';
            const safeFechaFin = fechaFin ?? 'sin-fin';
            const key = `${item.sector_id}-${safeFechaInicio}-${safeFechaFin}`;
            return (
                <Animated.View key={key} entering={index < 10 ? FadeInDown.delay(index * 100) : undefined}>
                    <SectorialCard
                        key={key}
                        sectorialData={item}
                        onLoaded={onCardLoaded}
                        index={index}
                    />
                </Animated.View>
            );
        },
        [fechaInicio, fechaFin]
    );

    const createPDF = async (sectorialesData: ISectorial[]) => {
        try {
            const html = await generarReporteSectorialesHTML(sectorialesData, fechaInicio!, fechaFin!);

            const { uri } = await Print.printToFileAsync({ html });

            const fechaInicioStr = fechaInicio?.split('T')[0] ?? 'sin_fecha_inicio';
            const fechaFinStr = fechaFin?.split('T')[0] ?? 'sin_fecha_fin';
            const nombreArchivo = `reporte_sectoriales_${fechaInicioStr}_a_${fechaFinStr}.pdf`;
            const rutaDestino = FileSystem.documentDirectory + nombreArchivo;

            await FileSystem.moveAsync({
                from: uri,
                to: rutaDestino,
            });

            await Sharing.shareAsync(rutaDestino);
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            Alert.alert('Error', 'No se pudo generar el PDF.');
        }
    };

    return (
        <View className='h-full bg-white'>
            <Text className='text-2xl font-bold text-center pt-4'>Sectoriales</Text>
            <SelectedYears />
            <FiltersMunicipios border />
            {loading ? (
                <Loading />
            ) : sectoriales && sectoriales.length > 0 ? (
                <FlatList
                    data={sectoriales}
                    keyExtractor={(item) => item.sector_id.toString()}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[globalColor]} />
                    }
                    renderItem={renderItem}
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