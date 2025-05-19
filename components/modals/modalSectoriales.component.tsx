import AsyncStorage from "@react-native-async-storage/async-storage";
import { CustomButtonPrimary } from "components/buttons/mainButton.component";
import { ISectorial } from "interfaces/sectorial.interface";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native'
import Modal from 'react-native-modal'
import { SectoralService } from "services/sectoral/sectoral.service";
import useActiveStore from "store/actives/actives.store";
import useInternetStore from "store/internet/internet.store";
import useStylesStore from "store/styles/styles.store";

interface Props {
    active: boolean,
    closeModal: () => void;
}

export const ModalSectoriales = ({ active, closeModal }: Props) => {
    const [sectoriales, setSectoriales] = useState<ISectorial[]>([])
    const { setSectorialActivo, sectorialActivo } = useActiveStore();
    const { globalColor } = useStylesStore()
    const { online } = useInternetStore();

    useEffect(() => {
        const fetchSectorals = async () => {
            try {
                if (online) {
                    const res = await SectoralService.getAllSectorals();
                    setSectoriales(res?.data?.data);
                    // Guarda los datos en AsyncStorage
                    await AsyncStorage.setItem('sectoriales', JSON.stringify(res?.data?.data));
                } else {
                    // Obtiene los datos de AsyncStorage si está offline
                    const stored = await AsyncStorage.getItem('sectoriales');
                    if (stored) {
                        setSectoriales(JSON.parse(stored));
                    }
                }
            } catch (error) {
                console.error({error})
            }
        }

        fetchSectorals();
    }, [])

    const handleSelectSectorial = (sectorial: ISectorial) => {
        setSectorialActivo(sectorial)
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
                sectoriales ? <View className="flex-1 justify-center items-center">
                    <View className="bg-white gap-4 p-5 rounded-xl w-11/12 h-2/4 justify-center items-center">
                        <Text className="text-2xl font-bold mb-4 text-center">Sectoriales</Text>

                        <FlatList
                            data={sectoriales}
                            className="w-full"
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <Pressable className="w-full my-3" onPress={() => handleSelectSectorial(item)}>
                                    <Text style={{ color: item.id === sectorialActivo?.id ? globalColor : '#6B7280' }} className="font-bold text-xl">
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