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

export const ModalSectorialesDashboard = ({ active, closeModal }: Props) => {
    const { globalColor } = useStylesStore()
    const [sectoriales, setSectoriales] = useState<ISectorial[]>([])
    const { setSectorialActivoDashboard, sectorialActivoDashboard } = useActiveStore();
    const { online } = useInternetStore();

    useEffect(() => {
        const fetchSectorals = async () => {
            try {
                let sectorialsData;
                if (online === null) {
                    return;
                }
                if (online) {
                    const res = await SectoralService.getAllSectorals();
                    sectorialsData = res?.data?.data;
                    if (sectorialsData) {
                        await AsyncStorage.setItem('sectorialesDashboard', JSON.stringify(sectorialsData));
                    }
                } else {
                    const stored = await AsyncStorage.getItem('sectorialesDashboard');
                    sectorialsData = stored ? JSON.parse(stored) : [];
                }
                setSectoriales(sectorialsData);
            } catch (error) {
                console.error({error})
            }
        }

        fetchSectorals();
    }, [])

    const handleSelectSectorial = (sectorial: ISectorial) => {
        setSectorialActivoDashboard(sectorial)
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
                                    <Text
                                        className="font-bold text-xl"
                                        style={{ color: item.id === sectorialActivoDashboard?.id ? globalColor : '#6B7280' }}
                                    >
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