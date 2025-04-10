import { MunicipioCard } from 'components/cards/municipioCard.component';
import { IMunicipio } from 'interfaces/municipio.interface';
import React from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';

const Municipios = () => {

    const municipios: IMunicipio[] = [
        {
            id: 1,
            municipio: "Valledupar",
            proyectos: "12",
            iniciativas: "25",
            valor: "$5,000,000",
            valorEjecutado: "$4,000,000",
        },
        {
            id: 2,
            municipio: "Aguachica",
            proyectos: "8",
            iniciativas: "18",
            valor: "$3,200,000",
            valorEjecutado: "$2,500,000",
        },
        {
            id: 3,
            municipio: "Bosconia",
            proyectos: "6",
            iniciativas: "10",
            valor: "$1,800,000",
            valorEjecutado: "$1,200,000",
        },
        {
            id: 4,
            municipio: "Chimichagua",
            proyectos: "5",
            iniciativas: "8",
            valor: "$1,000,000",
            valorEjecutado: "$700,000",
        },
    ];

    return (
        <View className='h-full'>
            <Text className='text-2xl font-bold text-center py-4'>Municipios</Text>
            <FlatList
                data={municipios}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <MunicipioCard municipioData={item} />
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    )
}


export default Municipios;