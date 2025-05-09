import { CustomButtonPrimary } from "components/buttons/mainButton.component";
import { IEstado } from "interfaces/estado.interface";
import { ISectorial } from "interfaces/sectorial.interface";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native'
import Modal from 'react-native-modal'
import { SectoralService } from "services/sectoral/sectoral.service";
import { StateService } from "services/states/states.service";
import useActiveStore from "store/actives/actives.store";
import useStylesStore from "store/styles/styles.store";

interface Props {
    active: boolean,
    closeModal: () => void;
}

export const ModalEstados = ({ active, closeModal }: Props) => {
    const [estados, setEstados] = useState<IEstado[]>([])
    const { setEstadoActivo } = useActiveStore();
    const {globalColor} = useStylesStore()

    useEffect(() => {
        const fetchStates = async () => {
            const res = await StateService.getTypeStates()
            setEstados(res?.data)
        }

        fetchStates();
    }, [])

    const handleSelectSectorial = (estado: IEstado) => {
        setEstadoActivo(estado)
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
                estados ? <View className="flex-1 justify-center items-center">
                    <View className="bg-white gap-4 p-5 rounded-xl w-11/12 h-2/4 justify-center items-center">
                        <Text className="text-2xl font-bold mb-4 text-center">Estados</Text>

                        <FlatList
                            data={estados}
                            className="w-full"
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <Pressable className="w-full my-3" onPress={() => handleSelectSectorial(item)}>
                                    <Text className="font-bold text-gray-500 text-xl">
                                        {item?.name.charAt(0).toUpperCase() + item?.name.slice(1).toLowerCase()}
                                    </Text>
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