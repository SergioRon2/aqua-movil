import { SectorialCard } from 'components/cards/sectorialCard.component';
import { ISectorial } from 'interfaces/sectorial.interface';
import { View, Text, ScrollView, FlatList } from 'react-native';

const Sectoriales = () => {

    const sectoriales: ISectorial[] = [
        {
            id: 1,
            sectorial: "Educación",
            proyectos: "5",
            iniciativas: "12",
            valor: "$1,000,000",
            valorEjecutado: "$800,000",
        },
        {
            id: 2,
            sectorial: "Salud",
            proyectos: "8",
            iniciativas: "20",
            valor: "$2,500,000",
            valorEjecutado: "$600,000",
        },
        {
            id: 3,
            sectorial: "Infraestructura",
            proyectos: "10",
            iniciativas: "15",
            valor: "$3,000,000",
            valorEjecutado: "$3,000,000",
        },
        {
            id: 4,
            sectorial: "Tecnología",
            proyectos: "7",
            iniciativas: "18",
            valor: "$1,500,000",
            valorEjecutado: "$200,000",
        },
    ];

    return (
        <View className='h-full'>
            <Text className='text-2xl font-bold text-center py-4'>Sectoriales</Text>
            <FlatList
                data={sectoriales}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <SectorialCard sectorialData={item} />
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    )
};

export default Sectoriales;