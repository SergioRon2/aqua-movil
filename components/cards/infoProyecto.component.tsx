import { View, Text, Pressable } from "react-native";


export const InfoProyecto = ({ proyecto }: { proyecto: any }) => (
    <View className="w-full mt-4 bg-white rounded-lg shadow-md p-4 gap-4 items-start justify-center">
        <View className="flex-row justify-around items-start">
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Fecha inicio</Text>
                <Text className="text-xl font-bold">{proyecto.fechaInicio}</Text>
            </View>
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Fecha fin</Text>
                <Text className="text-xl font-bold">{proyecto.fechaFin}</Text>
            </View>
        </View>
        <View className="flex-row justify-around items-start">
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Contrato</Text>
                <Text className="text-xl font-bold">{proyecto.contrato}</Text>
            </View>
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Estado</Text>
                <Text className="text-xl font-bold">{proyecto.estado}</Text>
            </View>
        </View>
        <View className="flex-row justify-around items-start">
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Sectorial</Text>
                <Text className="text-xl font-bold">{proyecto.sectorial}</Text>
            </View>
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Municipio</Text>
                <Text className="text-xl font-bold">{proyecto.municipio}</Text>
            </View>
        </View>
        <View className="flex-row justify-around items-start">
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Contratista</Text>
                <Text className="text-xl font-bold">{proyecto.contratista}</Text>
            </View>
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Valor del proyecto</Text>
                <Text className="text-xl font-bold">{proyecto.valor}</Text>
            </View>
        </View>

        <View className="justify-between items-start w-1/2">
            <Pressable className="bg-pink-500 rounded-lg p-2 mt-4" onPress={() => console.log('Descargar informe')}>
                <Text className="text-md font-bold text-white">Imprimir informe</Text>
            </Pressable>
        </View>
    </View>
)