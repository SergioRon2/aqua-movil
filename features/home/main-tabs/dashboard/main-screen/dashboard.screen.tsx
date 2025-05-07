import { FiltersComponentDashboard } from 'components/buttons/filtersInfoDashboard.component';
import { SelectedYears } from 'components/buttons/selectedYears.component';
import BarChartComponent from 'components/charts/barChart.component';
import DonutChart from 'components/charts/donutChart.component';
import { Loading } from 'components/loading/loading.component';
import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { StateService } from 'services/states/states.service';
import useStylesStore from 'store/styles/styles.store';
import { capitalize } from 'utils/capitalize';
import { formatLabel } from 'utils/formatLabel';
import { formatNumberWithSuffix } from 'utils/formatNumberWithSuffix';

type ProjectState = {
    state_id: number;
    state_code: string;
    state_name: string;
    amount_project: number;
};

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
    const { globalColor } = useStylesStore()
    // const navigation = useNavigation();

    // const handleNavigation = () => {
    //     navigation.navigate('Proyectos');
    // };

    const [projectsByState, setProjectsByState] = useState<ProjectState[]>([])
    const [sectorialInfo, setSectorialInfo] = useState<SectorialInfo[]>([])
    const [values, setValues] = useState<Values>({
        value_total_project: '0',
        value_total_executed: '0'
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProjectsByDashboard = async () => {
            try {
                setLoading(true)
                const res = await StateService.getStatesData();
                // estados para el donut chart
                setProjectsByState(res?.data?.list_state_response_filter)
                setSectorialInfo(res?.data?.list_sectorial_response)
                // valores para el bar chart
                setValues({
                    value_total_project: res?.data?.value_total_project,
                    value_total_executed: res?.data?.value_total_executed
                })
            } catch (error) {
                console.error({ error })
            } finally {
                setLoading(false)
            }
        }

        fetchProjectsByDashboard();
    }, [])

    // donut chart data
    const totalProjects = (projectsByState || []).reduce((sum, item) => sum + item.amount_project, 0);

    const donutChartData: { label: string; value: number; }[] = (projectsByState || []).map((item, index) => ({
        label: item.state_name,
        value: (item.amount_project / totalProjects) * 100,
        // color: COLORS[index % COLORS.length],
    }));


    const transformSectorialDataForBarChart = () => {
        if (sectorialInfo) {
            return sectorialInfo.map((sector) => ({
                label: sector.sector_name,
                value: sector.amount_project,
            }));
        } else {
            return;
        }
    }

const barChartData = transformSectorialDataForBarChart();

return (
    <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        className="flex-grow bg-white"
    >
        {/* select development plan */}
        <SelectedYears />


        {/* filters */}
        <FiltersComponentDashboard border={false} />

        {/* values */}
        {loading
            ? <View className='justify-center items-center w-full h-full'>
                <Loading />
            </View>
            : values && sectorialInfo && donutChartData && barChartData ? <>
                <View className='flex-row justify-center p-4 mx-auto w-11/12 bg-white border border-gray-200 px-5 py-5 rounded-lg items-start mb-4 shadow-lg'>
                    <View className='items-start w-1/2'>
                        <Text className='text-4xl font-bold'>
                            ${formatNumberWithSuffix(+values.value_total_executed)}
                        </Text>
                        <Text className='font-bold text-gray-500'>Valor ejecutado</Text>
                    </View>
                    <View className='items-start w-1/2'>
                        <Text className='text-4xl font-bold'>
                            ${formatNumberWithSuffix(+values.value_total_project)}
                        </Text>
                        <Text className='font-bold text-gray-500'>Valor de proyectos</Text>
                    </View>
                </View>


                {/* view projects */}
                {/* <View className='p-4 mx-auto w-11/12 border justify-center items-center border-gray-200 bg-white rounded-lg'>
                        <Text className="animate-fade-in text-xl p-2 font-bold">Ver proyectos</Text>
                        <Text className="animate-fade-in text-base text-gray-500 p-4 font-bold text-center">Aqui puedes ver una lista de todos los proyectos actuales, recuerda que solo es una vista basica y dinamica de todos los datos por proyecto.</Text>
                        <CustomButtonPrimary title='Ver todos los proyectos' onPress={handleNavigation} />
                    </View> */}


                {/* charts */}
                <View className='gap-4 mb-4 my-3 mx-auto w-11/12 shadow-lg'>

                    {/* bar chart */}
                    <View className='bg-white w-full py-2 border border-gray-200 rounded-lg'>
                        <BarChartComponent
                            horizontalScroll
                            title='Sectoriales'
                            data={{
                                labels: barChartData.map(item => formatLabel(capitalize(item.label))),
                                datasets: [{ data: barChartData.map(item => item.value) }]
                            }}
                        />
                    </View>

                    {/* donut chart */}
                    <View className='items-center gap-4 bg-white py-2 justify-center border border-gray-200 rounded-lg'>
                        <Text className='text-2xl text-gray-800 font-bold'>Proyectos por estados</Text>
                        <DonutChart data={donutChartData} />
                    </View>
                </View>


                {/* aditional cards */}
                {/* <View className='mx-auto w-11/12'>
                        <Text className="animate-fade-in p-4 text-xl font-bold mb-4">Proyectos</Text>
                        <View className="animate-fade-in bg-white border border-gray-200 p-4 rounded-lg mb-4">
                            <Text className="text-lg font-bold">Card 1</Text>
                            <Text className="text-gray-600">This is some content for card 1.</Text>
                        </View>
                        <View className="animate-fade-in bg-white border border-gray-200 p-4 rounded-lg mb-4">
                            <Text className="text-lg font-bold">Card 2</Text>
                            <Text className="text-gray-600">This is some content for card 2.</Text>
                        </View>
                        <View className="animate-fade-in bg-white border border-gray-200 p-4 rounded-lg mb-4">
                            <Text className="text-lg font-bold">Card 3</Text>
                            <Text className="text-gray-600">This is some content for card 3.</Text>
                        </View>
                    </View> */}
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
