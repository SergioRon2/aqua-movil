import { CustomButtonPrimary } from "components/buttons/mainButton.component";
import { IMunicipio } from "interfaces/municipio.interface";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native'
import Modal from 'react-native-modal'
import { MunicipalitiesService } from "services/municipalities/municipalities.service";
import useActiveStore from "store/actives/actives.store";
import useStylesStore from "store/styles/styles.store";

interface Props {
    active: boolean,
    closeModal: () => void;
}

export const ModalMunicipiosDashboard = ({ active, closeModal }: Props) => {
    const { globalColor } = useStylesStore()
    const [municipios, setMunicipios] = useState<IMunicipio[]>([])
    const { setMunicipiosActivosDashboard, municipiosActivosDashboard } = useActiveStore();

    useEffect(() => {
        const fetchMunicipios = async () => {
            const { data } = await MunicipalitiesService.getMunicipalitiesValledupar()
            setMunicipios(data)
        }

        fetchMunicipios();
    }, [])

    const handleSelectMunicipio = (municipio: IMunicipio) => {
        // Verificar si el municipio ya está en la lista
        const isMunicipioSelected = municipiosActivosDashboard.some(m => m.id === municipio.id);

        if (isMunicipioSelected) {
            // Si ya está seleccionado, eliminarlo de la lista
            setMunicipiosActivosDashboard(municipiosActivosDashboard.filter(m => m.id !== municipio.id));
        } else {
            // Si no está seleccionado, agregarlo a la lista
            setMunicipiosActivosDashboard([...municipiosActivosDashboard, municipio]);
        }

        closeModal()
    }

    return (
        <Modal
            isVisible={active}
            onBackdropPress={closeModal}
            useNativeDriver
            animationIn="zoomIn"
            animationOut="zoomOut"
        >
            {
                municipios ? <View className="flex-1 justify-center items-center">
                    <View className="bg-white gap-4 p-5 rounded-xl w-11/12 h-2/4 justify-center items-center">
                        <Text className="text-2xl font-bold mb-4 text-center">Municipios</Text>

                        <FlatList
                            data={municipios}
                            className="w-full"
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <Pressable className="w-full my-3" onPress={() => handleSelectMunicipio(item)}>
                                    <Text style={{ color: municipiosActivosDashboard.some(m => m.id === item.id) ? globalColor : '#333' }} className={`font-bold text-xl`}>{item?.nombre}</Text>
                                </Pressable>
                            )}
                        />

                        <CustomButtonPrimary rounded onPress={closeModal} title="Cerrar" />
                    </View>
                </View> : <ActivityIndicator size={'large'} color={globalColor} />
            }
        </Modal>
    )
}