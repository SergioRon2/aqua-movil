import AsyncStorage from "@react-native-async-storage/async-storage";
import { CustomButtonPrimary } from "components/buttons/mainButton.component";
import { IEstado } from "interfaces/estado.interface";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native'
import Modal from 'react-native-modal'
import { StateService } from "services/states/states.service";
import useActiveStore from "store/actives/actives.store";
import useInternetStore from "store/internet/internet.store";
import useStylesStore from "store/styles/styles.store";

interface Props {
    active: boolean,
    closeModal: () => void;
}

export const ModalEstados = ({ active, closeModal }: Props) => {
    const [estados, setEstados] = useState<IEstado[]>([])
    const { setEstadoActivo, estadoActivo } = useActiveStore();
    const { globalColor } = useStylesStore();
    const { online } = useInternetStore();

    useEffect(() => {
        const fetchStates = async () => {
            try {
                let estadosData;

                if (online === null) {
                    return;
                }
                if (online) {
                    const res = await StateService.getTypeStates();
                    estadosData = res?.data;
                    await AsyncStorage.setItem('estados', JSON.stringify(estadosData));
                } else {
                    const storedEstados = await AsyncStorage.getItem('estados');
                    estadosData = storedEstados ? JSON.parse(storedEstados) : [];
                }
                setEstados(estadosData);
            } catch (error) {
                console.error({error})
            }
        }

        fetchStates();
    }, [])

    const handleSelectEstado = (estado: IEstado) => {
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
                                <Pressable className="w-full my-3" onPress={() => handleSelectEstado(item)}>
                                    <Text style={{ color: item.id === estadoActivo?.id ? globalColor : '#6B7280' }} className="font-bold text-xl">
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