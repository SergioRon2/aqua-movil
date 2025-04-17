import { View, Text, Pressable } from "react-native";


export const InfoProyecto = ({ proyecto }: { proyecto: any }) => (
    <View className="w-full mt-4 bg-white rounded-lg shadow-md p-4 gap-4 items-start justify-center">
        <View className="flex-row justify-around gap-5 items-start">
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Fecha inicio</Text>
                <Text className="text-xl font-bold">
                    {proyecto.projectBankDate != null ? proyecto.projectBankDate : 'Nulo'}
                </Text>
            </View>
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Fecha fin</Text>
                <Text className="text-xl font-bold">
                    {proyecto.fechaProyecto != null ? proyecto.fechaProyecto : 'Nulo'}
                </Text>
            </View>
        </View>
        <View className="flex-row justify-around gap-5 items-start">
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Contrato</Text>
                <Text className="text-xl font-bold">
                    {proyecto.type != null ? proyecto.type : 'Nulo'}
                </Text>
            </View>
            <View className="justify-between items-start w-1/2">
                <Text className={`text-md text-gray-500`}>Estado</Text>
                <Text 
                    className={`text-xl font-bold`} 
                    style={{
                        color: proyecto.state_color != null 
                        ? proyecto.state_color 
                        : '#000' 
                    }}
                >
                    {proyecto.state_name != null ? proyecto.state_name : 'Nulo'}
                </Text>
            </View>
        </View>
        <View className="flex-row justify-around gap-5 items-start">
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Sectorial</Text>
                <Text className="text-xl font-bold">
                    {proyecto.list_sector_name != null ? proyecto.list_sector_name : 'Nulo'}
                </Text>
            </View>
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Municipio</Text>
                <Text className="text-xl font-bold">
                    {proyecto.municipios_texto != null ? proyecto.municipios_texto : 'Indefinido.'}
                </Text>
            </View>
        </View>
        <View className="flex-row justify-around gap-5 items-start">
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Contratista</Text>
                <Text className="text-xl font-bold">{proyecto.id}</Text>
            </View>
            <View className="justify-between items-start w-1/2">
                <Text className="text-md text-gray-500">Valor del proyecto</Text>
                <Text className="text-xl font-bold">
                    {proyecto.total_source_value != null ? proyecto.total_source_value : 'Nulo'}
                </Text>
            </View>
        </View>

        <View className="justify-between items-start w-1/2">
            <Pressable className="bg-pink-500 rounded-lg p-2 mt-4" onPress={() => console.log('Descargar informe')}>
                <Text className="text-md font-bold text-white">Imprimir informe</Text>
            </Pressable>
        </View>
    </View>
)