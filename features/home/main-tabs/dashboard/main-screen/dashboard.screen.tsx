import { FiltersComponentDashboard } from 'components/buttons/filtersInfoDashboard.component';
import { SelectedYears } from 'components/buttons/selectedYears.component';
import { Loading } from 'components/loading/loading.component';
import LottieView from 'lottie-react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, Text, View, Image, Dimensions, Alert, RefreshControl, TouchableOpacity } from 'react-native';
import { StateService } from 'services/states/states.service';
import useStylesStore from 'store/styles/styles.store';
import { capitalize } from 'utils/capitalize';
import { formatLabel } from 'utils/formatLabel';
import { formatNumberWithSuffix } from 'utils/formatNumberWithSuffix'
import { Ionicons } from '@expo/vector-icons';
import BarChartSectorialesComponent from 'components/charts/barChartSectoriales.component';
import Carousel from 'react-native-reanimated-carousel';
import { InfoService } from 'services/info/info.service';
import SemiDonutChart from 'components/charts/semiDonutChart.component';
import useActiveStore from 'store/actives/actives.store';
import DonutChartComponent from 'components/charts/donutChart.component';
import useInternetStore from 'store/internet/internet.store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { generarReporteDashboardHTML } from 'components/pdfTemplates/dashboardReporte.component';
import { CustomButtonPrimary } from 'components/buttons/mainButton.component';

type Values = {
    value_total_project: string;
    value_total_executed: string;
}

type SectorialInfo = {
    sector_id: number;
    sector_name: string;
    amount_project: number;
};

const DashboardScreen = () => {
    const { online } = useInternetStore();
    const { globalColor } = useStylesStore()
    const { municipioActivoDashboard, sectorialActivoDashboard, fechaInicio, fechaFin, planDesarrolloActivo } = useActiveStore()
    const [sectorialInfo, setSectorialInfo] = useState<SectorialInfo[]>([])
    const [refreshing, setRefreshing] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef<any>(null);
    const [values, setValues] = useState<Values>({
        value_total_project: '0',
        value_total_executed: '0'
    })
    const [amount, setAmount] = useState(0)
    const [avances, setAvances] = useState({
        avanceFinanciero: { name: '', value: 0 },
        avanceFisico: { name: '', value: 0 },
        indicadorTiempo: { name: '', value: 0 },
    });
    const [loading, setLoading] = useState(true)
    console.log({fechaInicio, fechaFin})

    const fetchProjectsByDashboard = useCallback(async () => {
        try {
            setLoading(true)
            setRefreshing(true);
            if (online === null) {
                return;
            }

            if (online) {
                const res = await StateService.getStatesData({
                    municipio_id: municipioActivoDashboard?.id,
                    sectorial_id: sectorialActivoDashboard?.id,
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin,
                    development_plan_id: planDesarrolloActivo?.id
                });
                setAmount(res?.data?.amount_project)
                setSectorialInfo(res?.data?.list_sectorial_response)
                setValues({
                    value_total_project: res?.data?.value_total_project,
                    value_total_executed: res?.data?.value_total_executed
                })
                // Save to AsyncStorage
                const dataToStore = {
                    amount: res?.data?.amount_project,
                    sectorialInfo: res?.data?.list_sectorial_response,
                    values: {
                        value_total_project: res?.data?.value_total_project,
                        value_total_executed: res?.data?.value_total_executed
                    }
                };
                try {
                    await AsyncStorage.setItem('dashboardData', JSON.stringify(dataToStore));
                } catch (e) {
                    console.error('Error saving dashboard data to storage', e);
                }
            } else {
                try {
                    const storedData = await AsyncStorage.getItem('dashboardData');
                    if (storedData) {
                        const parsed = JSON.parse(storedData);
                        setAmount(parsed.amount);
                        setSectorialInfo(parsed.sectorialInfo);
                        setValues(parsed.values);
                    }
                } catch (e) {
                    console.error('Error loading dashboard data from storage', e);
                }
            }
        } catch (error) {
            console.error({ error })
        } finally {
            setLoading(false)
            setRefreshing(false);
        }
    }, [
        fechaInicio,
        fechaFin,
        online,
        municipioActivoDashboard?.id,
        sectorialActivoDashboard?.id,
        planDesarrolloActivo?.id
    ]);

    const fetchInfo = useCallback(async () => {
        setLoading(true);
        try {
            if (online === null) {
                return;
            }
            if (online) {
                const res = await InfoService.getInfoByAllData({
                    development_plan_id: planDesarrolloActivo?.id,
                    sectorial_id: sectorialActivoDashboard?.id,
                    municipio_id: municipioActivoDashboard?.id,
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin
                });
                const avancesData = {
                    avanceFinanciero: { name: 'Avance financiero', value: res?.data?.last_progress_financial_current },
                    avanceFisico: { name: 'Avance fisico', value: res?.data?.last_progress_physical_current },
                    indicadorTiempo: { name: 'Indicador de tiempo ejecutado', value: res?.data?.time_exec }
                };
                setAvances(avancesData);
                try {
                    await AsyncStorage.setItem('dashboardAvances', JSON.stringify(avancesData));
                } catch (e) {
                    console.error('Error saving avances data to storage', e);
                }
            } else {
                try {
                    const storedAvances = await AsyncStorage.getItem('dashboardAvances');
                    if (storedAvances) {
                        setAvances(JSON.parse(storedAvances));
                    }
                } catch (e) {
                    console.error('Error loading avances data from storage', e);
                }
            }
        } catch (error) {
            console.error({ error })
        } finally {
            setLoading(false);
        }
    }, [
        fechaInicio,
        fechaFin,
        online,
        planDesarrolloActivo?.id,
        sectorialActivoDashboard?.id,
        municipioActivoDashboard?.id,
    ]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (online !== null) {
                fetchProjectsByDashboard();
                fetchInfo();
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [online, fetchProjectsByDashboard, fetchInfo]);

    useEffect(() => {
        if (!planDesarrolloActivo) {
            setLoading(true);
        } else {
            setLoading(false)
        }
    }, [planDesarrolloActivo])

    // donut chart data
    const totalProjects = (sectorialInfo || []).reduce((sum, item) => sum + item.amount_project, 0);

    const donutChartData = useMemo(() => {
        return (sectorialInfo || []).map((item, index) => ({
            label: item.sector_name,
            value: (item.amount_project / totalProjects) * 100,
        }));
    }, [sectorialInfo, totalProjects, planDesarrolloActivo?.id]);

    const transformSectorialDataForBarChart = () => {
        if (sectorialInfo && planDesarrolloActivo?.id) {
            return sectorialInfo.map((sector) => ({
                sector_id: sector.sector_id,
                label: sector.sector_name,
                value: sector.amount_project,
            }));
        } else {
            return;
        }
    }

    const barChartData = transformSectorialDataForBarChart();

    const createPDF = async () => {
        const valoresProyectoGeneral = {
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            valorTotal: values.value_total_project,
            valorEjecutado: values.value_total_executed
        }

        try {
            const html = await generarReporteDashboardHTML(valoresProyectoGeneral, sectorialInfo, avances);
            const { uri } = await Print.printToFileAsync({ html, height: 1000 });

            const nombreArchivo = `reporte-dashboard-${new Date().toISOString().split('T')[0]}.pdf`;
            const nuevaRuta = FileSystem.documentDirectory + nombreArchivo;

            await FileSystem.moveAsync({
                from: uri,
                to: nuevaRuta,
            });
            await Sharing.shareAsync(nuevaRuta);
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            Alert.alert('Error', 'No se pudo generar el PDF.');
        }
    };

    const onRefresh = () => {
        fetchProjectsByDashboard();
        fetchInfo();
    };

    const items = [
        { title: avances.avanceFinanciero.name, component: <SemiDonutChart percentage={avances.avanceFinanciero.value} height={180} /> },
        { title: avances.avanceFisico.name, component: <SemiDonutChart color='#009966' percentage={avances.avanceFisico.value} height={180} /> },
        { title: avances.indicadorTiempo.name, component: <SemiDonutChart color='#000099' percentage={avances.indicadorTiempo.value} height={180} /> },
    ];

    return (
        <ScrollView
            contentContainerStyle={{
                paddingBottom: 20,
                flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[globalColor]} />
            }
            className="bg-white"
        >
            {/* select development plan */}
            <SelectedYears />

            {/* filters */}
            <FiltersComponentDashboard border={false} />

            {/* values */}
            {loading
                ? <View className='justify-start items-center w-full h-full'>
                    <Loading />
                </View>
                : values && sectorialInfo && donutChartData && barChartData ? <>
                    <View className='flex-row justify-center p-4 mx-auto w-11/12 bg-white border border-gray-200 px-5 py-5 rounded-lg items-start mb-4 shadow-lg gap-5'>
                        <View className='items-center flex-row w-1/2 gap-3'>
                            <Text><Ionicons name='wallet-outline' color={globalColor} size={40} /></Text>
                            <View>
                                <Text className='text-4xl font-bold'>
                                    ${formatNumberWithSuffix(+values.value_total_executed)}
                                </Text>
                                <Text className='font-bold text-gray-500'>Valor ejecutado</Text>
                            </View>
                        </View>
                        <View className='items-center flex-row w-1/2 gap-3'>
                            <Text><Ionicons name='cash-outline' color={globalColor} size={40} /></Text>
                            <View>
                                <Text className='text-4xl font-bold'>
                                    ${formatNumberWithSuffix(+values.value_total_project)}
                                </Text>
                                <Text className='font-bold text-gray-500'>Valor total</Text>
                            </View>
                        </View>
                    </View>

                    {/* charts */}
                    <View className='gap-4 mb-4 my-3 mx-auto w-11/12 shadow-lg'>

                        {/* bar chart */}
                        <View className='bg-white w-full py-2 border border-gray-200 rounded-lg shadow-lg'>
                            <BarChartSectorialesComponent
                                horizontalScroll
                                title='Proyectos por sectoriales'
                                data={{
                                    ids: barChartData.map(item => item.sector_id),
                                    labels: barChartData.map(item => formatLabel(capitalize(item.label))),
                                    datasets: [{ data: barChartData.map(item => item.value) }]
                                }}
                            />
                        </View>

                        {/* carousel */}
                        {avances && (
                            <View className="justify-center items-center bg-white border rounded-lg px-4 border-gray-200 shadow-lg">
                                <Carousel
                                    ref={carouselRef}
                                    loop
                                    width={Dimensions.get('window').width - 50}
                                    height={250}
                                    data={items}
                                    scrollAnimationDuration={1000}
                                    onSnapToItem={(index) => setCurrentIndex(index)}
                                    onScrollEnd={(index) => setCurrentIndex(index)}
                                    renderItem={({ item }) => (
                                        <View className="w-full rounded-xl bg-white justify-center items-center">
                                            <Text className="text-lg font-bold mt-4">{item.title}</Text>
                                            {item.component}
                                        </View>
                                    )}
                                />
                                <View pointerEvents="box-none" className="absolute flex-row justify-between items-center w-full px-2 mt-4">
                                    <TouchableOpacity
                                        onPress={() => {
                                            if (carouselRef.current) {
                                                carouselRef.current.prev();
                                            }
                                        }}
                                        className="p-2 bg-gray-200 rounded-full items-center justify-center"
                                    >
                                        <Text className='text-2xl text-center font-bold'>{'<'}</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            if (carouselRef.current) {
                                                carouselRef.current.next();
                                            }
                                        }}
                                        className="p-2 bg-gray-200 rounded-full items-center justify-center"
                                    >
                                        <Text className='text-2xl text-center font-bold'>{'>'}</Text>
                                    </TouchableOpacity>
                                </View>

                                <View className="flex-row justify-center mb-4">
                                    {items.map((_, index) => (
                                        <View
                                            key={index}
                                            className={`w-2 h-2 mx-1 rounded-full ${index === currentIndex ? 'bg-black' : 'bg-gray-400'
                                                }`}
                                        />
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* donut chart */}
                        <View className='items-center gap-4 bg-white p-3 justify-center border border-gray-200 rounded-lg shadow-lg'>
                            <Text className='text-2xl text-gray-800 font-bold text-center'>
                                Porcentaje de proyectos por sectorial
                            </Text>
                            <DonutChartComponent amount={amount} data={donutChartData} />
                        </View>
                    </View>

                    <View className='justify-center items-center my-8'>
                        <CustomButtonPrimary rounded title='Generar reporte' onPress={createPDF} />
                    </View>
                </>
                    : <View className='justify-center items-center w-full h-full'>
                        <LottieView
                            source={require('../../../../../assets/lottie/not_found.json')}
                            autoPlay
                            loop
                            style={{ width: 350, height: 350 }}
                        />
                        <Text className='text-lg font-bold text-gray-500'>No hay datos disponibles</Text>
                    </View>}
        </ScrollView>
    );
};

export default DashboardScreen;
