import { useNavigation } from '@react-navigation/native';
import AreaChartComponent from 'components/charts/areaChart.component';
import BarChartComponent from 'components/charts/barChart.component';
import PieChartComponent from 'components/charts/pieChart.component';
import { useState } from 'react';
import { Dimensions, Pressable, ScrollView, Text, View } from 'react-native';

const DashboardScreen = () => {
    const [selected, setSelected] = useState<number>(1);
    const navigation = useNavigation();

    const handleNavigation = () => {
        navigation.navigate('Proyectos');
    };

    return (
        <ScrollView
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            className="flex-grow bg-gray-100 p-2"
        >
            {/* selected years */}
            <View className={`flex-row w-full p-4 mx-auto mb-4 justify-center items-center animate-fade-in`}>
                <Pressable onPress={() => setSelected(1)} className={`${selected === 1 ? 'bg-white' : 'bg-transparent'} px-6 py-2 w-1/3 rounded-sm`}>
                    <Text className={`${selected === 1 ? 'text-pink-600' : 'text-black'} text-xl font-bold text-center`}>2023</Text>
                </Pressable>
                <Pressable onPress={() => setSelected(2)} className={`${selected === 2 ? 'bg-white' : 'bg-transparent'} px-6 py-2 w-1/3 rounded-sm`}>
                    <Text className={`${selected === 2 ? 'text-pink-600' : 'text-black'} text-xl font-bold text-center`}>2024</Text>
                </Pressable>
                <Pressable onPress={() => setSelected(3)} className={`${selected === 3 ? 'bg-white' : 'bg-transparent'} px-6 py-2 w-1/3 rounded-sm`}>
                    <Text className={`${selected === 3 ? 'text-pink-600' : 'text-black'} text-xl font-bold text-center`}>2025</Text>
                </Pressable>
            </View>


            {/* filters */}
            <View className="flex-row w-full mx-auto mb-4 justify-center items-center animate-fade-in">
                <Pressable onPress={() => console.log('Filter 1')} className="bg-white px-6 py-2 w-1/2 rounded-sm">
                    <Text className="text-pink-600 text-xl font-bold text-center">Municipios</Text>
                </Pressable>
                <Pressable onPress={() => console.log('Filter 2')} className="bg-white px-6 py-2 w-1/2 rounded-sm">
                    <Text className="text-pink-600 text-xl font-bold text-center">Sectoriales</Text>
                </Pressable>
            </View>

            {/* values */}
            <View className='flex-row justify-center w-full p-4 bg-white border border-gray-200 px-5 py-5 rounded-lg items-start mb-4'>
                <View className='items-start w-1/2'>
                    <Text className='text-4xl font-bold'>$ 6.25 M</Text>
                    <Text className='font-bold text-gray-500'>Valor ejecutado</Text>
                </View>
                <View className='items-start w-1/2'>
                    <Text className='text-4xl font-bold'>$ 10.00 M</Text>
                    <Text className='font-bold text-gray-500'>Valor de proyectos</Text>
                </View>
            </View>


            {/* charts */}
            <View className='gap-4 mb-4 p-4'>
                <View className='items-center bg-white justify-center'>
                    <AreaChartComponent />
                </View>
                <View className='items-center bg-white py-2 justify-center'>
                    <Text className='text-xl font-bold'>Proyectos por estados</Text>
                    <PieChartComponent />
                </View>
            </View>


            {/* aditional cards */}
            <View>
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
            </View>

            {/* view projects */}
            <View className='p-4 border justify-center border-gray-200 bg-white rounded-lg'>
                <Text className="animate-fade-in text-xl p-4 font-bold">Ver proyectos</Text>
                <Text className="animate-fade-in text-base text-gray-500 p-4 font-bold">Aqui puedes ver una lista de todos los proyectos actuales, recuerda que solo es una vista basica y dinamica de todos los datos por proyecto.</Text>
                <Pressable onPress={handleNavigation} className="bg-pink-600 px-4 py-2 rounded-lg mb-4">
                    <Text className="text-white text-center text-lg font-bold">Ver todos los proyectos</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
};

export default DashboardScreen;
