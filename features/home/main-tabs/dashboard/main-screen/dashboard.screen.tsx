import { FiltersComponentDashboard } from 'components/buttons/filtersInfoDashboard.component';
import { SelectedYears } from 'components/buttons/selectedYears.component';
import AreaChartComponent from 'components/charts/areaChart.component';
import DonutChart from 'components/charts/donutChart.component';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { StateService } from 'services/states/states.service';

type ProjectState = {
    state_id: number;
    state_code: string;
    state_name: string;
    amount_project: number;
};

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

const DashboardScreen = () => {
    // const navigation = useNavigation();

    // const handleNavigation = () => {
    //     navigation.navigate('Proyectos');
    // };

    const [projectsByState, setProjectsByState] = useState<ProjectState[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(()=> {
        const fetchProjectsByState = async () => {
            try {
                setLoading(true)
                const res = await StateService.getStatesData();
                setProjectsByState(res?.data?.list_state_response_filter)
            } catch (error) {
                console.error({error})   
            } finally {
                setLoading(false)
            }
        }

        fetchProjectsByState();
    }, [])

    const totalProjects = (projectsByState || []).reduce((sum, item) => sum + item.amount_project, 0);

    const chartData: { label: string; value: number; color: string }[] = (projectsByState || []).map((item, index) => ({
        label: item.state_name,
        value: (item.amount_project / totalProjects) * 100,
        color: COLORS[index % COLORS.length],
    }));
    

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
            <View className='flex-row justify-center p-4 mx-auto w-11/12 bg-white border border-gray-200 px-5 py-5 rounded-lg items-start mb-4'>
                <View className='items-start w-1/2'>
                    <Text className='text-4xl font-bold'>$ 6.25 M</Text>
                    <Text className='font-bold text-gray-500'>Valor ejecutado</Text>
                </View>
                <View className='items-start w-1/2'>
                    <Text className='text-4xl font-bold'>$ 10.00 M</Text>
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
            <View className='gap-4 mb-4 my-3 mx-auto w-11/12'>
                <View className='items-center bg-white justify-center'>
                    <AreaChartComponent />
                </View>
                <View className='items-center gap-4 bg-white py-2 justify-center border border-gray-200 rounded-lg'>
                    {loading ? (
                        <ActivityIndicator size="small" color="#db2777" className='my-4' />
                    ) : (
                        <>
                            <Text className='text-2xl text-gray-800 font-bold'>Proyectos por estados</Text>
                            <DonutChart data={chartData} />
                        </>
                    )}
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
        </ScrollView>
    );
};

export default DashboardScreen;
