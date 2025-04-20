import { CustomButtonPrimary } from "components/buttons/mainButton.component";
import { IMunicipio } from "interfaces/municipio.interface";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native'
import Modal from 'react-native-modal'
import { MunicipalitiesService } from "services/municipalities/municipalities.service";
import useActiveStore from "store/actives/actives.store";

interface Props {
    active: boolean,
    closeModal: () => void;
}

export const ModalMunicipios = ({ active, closeModal }: Props) => {
    const [municipios, setMunicipios] = useState<IMunicipio[]>([])
    const {setMunicipioActivo} = useActiveStore();

    useEffect(() => {
        const fetchMunicipios = async () => {
            const { data } = await MunicipalitiesService.getMunicipalitiesValledupar()
            setMunicipios(data)
        }

        fetchMunicipios();
    }, [])

    const handleSelectMunicipio = (municipio: string) => {
        setMunicipioActivo(municipio)
        closeModal();
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
                                <Pressable className="w-full my-3" onPress={() => handleSelectMunicipio(item.nombre)}>
                                    <Text className="font-bold text-gray-500 text-xl">{item?.nombre}</Text>
                                </Pressable>
                            )}
                        />

                        <CustomButtonPrimary rounded onPress={closeModal} title="Cerrar" />
                    </View>
                </View> : <ActivityIndicator size={'large'} color={'#DB2777'} />
            } 
        </Modal>
    )
}