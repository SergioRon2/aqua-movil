import { View, Text, Pressable } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { IProyecto } from 'interfaces/proyecto.interface';
import { formatNumberWithSuffix } from 'utils/formatNumberWithSuffix';
import { parseCurrency } from 'utils/parseCurrency';
import { parseProgress } from 'utils/parseProgress';
import React, { useState } from 'react';
import { Modal, Button, ScrollView } from 'react-native';
import { CustomButtonPrimary } from 'components/buttons/mainButton.component';
import useStylesStore from 'store/styles/styles.store';


interface Props {
    proyecto: any;
}

export const ProyectoCardPresentable = ({ proyecto }: Props) => {
    const {globalColor} = useStylesStore()
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);

    const municipios = proyecto?.municipios_texto?.split(',');

    const valorTotal = proyecto?.value_project || proyecto?.project_value;
    const progresoFinanciero = proyecto.financial_current ? proyecto.financial_current / 100 : 0;
    const progresoFisico = proyecto.physical_current ? proyecto.physical_current / 100 : 0;

    const handleNavigate = () => {
        navigation.navigate('Proyecto', { proyecto });
    };

    return (
        <Pressable
            style={{ borderColor: globalColor }}
            onPress={handleNavigate}
            className="bg-white border-2 p-4 w-11/12 rounded-2xl justify-center items-start mx-auto mt-4 shadow-xl"
        >
            <Text style={{ fontSize: 12 }} className="text-black font-bold">{proyecto.name}</Text>


            <View className='flex-row mt-5'>
                <View className="w-1/2 mt-6 flex-col justify-start">
                    <View>
                        {municipios && 
                            municipios.length > 1 ? (
                            <>
                                <Pressable className='py-4' onPress={() => setModalVisible(true)}>
                                    <Text style={{color: globalColor}} className='font-bold'>Ver municipios</Text>
                                </Pressable>
                                <Modal
                                    visible={modalVisible}
                                    animationType="fade"
                                    transparent={true}
                                    onRequestClose={() => setModalVisible(false)}
                                >
                                    <View className="flex-1 justify-center items-center bg-black/75">
                                        <View className="bg-white p-8 rounded-lg w-3/4 gap-4">
                                            <Text className="text-xl font-bold mb-4">Municipios</Text>
                                            <ScrollView>
                                                {municipios.map((municipio: any, index: any) => (
                                                    <Text key={index} className="text-black text-md mb-2"> {municipio.trim()}</Text>
                                                ))}
                                            </ScrollView>
                                            <CustomButtonPrimary rounded onPress={() => setModalVisible(false)} title='Cerrar' />
                                        </View>
                                    </View>
                                </Modal>
                            </>
                        ) : (
                            <Text className="text-gray-600 text-md font-bold mb-1">{proyecto.municipios_texto}</Text>
                        )}
                        <Text className="text-gray-600 text-md font-bold mb-5">
                            {!isNaN(Number(valorTotal)) ? formatNumberWithSuffix(Number(valorTotal)) : 0}
                        </Text>
                    </View>
                    <Text
                        className="py-1 text-xs font-bold"
                        style={{ color: proyecto.state_color }}
                    >
                        {proyecto.state_name}
                    </Text>
                </View>

                <View className='flex-col w-full '>
                    <View className="w-1/2 mb-2">
                        <Text className="text-gray-700 text-sm font-bold mb-1">Avance financiero</Text>
                        <View className="flex-row items-center gap-2">
                            <ProgressBar
                                progress={progresoFinanciero}
                                color={globalColor}
                                className='w-2/4 h-auto'
                                style={{ height: 10, borderRadius: 5, backgroundColor: '#aaa' }}
                            />
                            <Text className="text-gray-600 text-sm">{(progresoFinanciero * 100).toFixed(0)}%</Text>
                        </View>
                    </View>

                    <View className="w-1/2 mb-2">
                        <Text className="text-gray-700 text-sm font-bold mb-1">Avance físico</Text>
                        <View className="flex-row items-center gap-2">
                            <ProgressBar
                                progress={progresoFisico}
                                color={globalColor}
                                className='w-2/4 h-auto'
                                style={{ height: 10, borderRadius: 5, backgroundColor: '#aaa' }}
                            />
                            <Text className="text-gray-600 text-sm">{(progresoFisico * 100).toFixed(0)}%</Text>
                        </View>
                    </View>
                </View>
            </View>
        </Pressable>
    );
};
