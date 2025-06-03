import { useState } from "react";
import { Pressable, View, Text } from "react-native"
import useActiveStore from "store/actives/actives.store";
import { Ionicons } from '@expo/vector-icons'
import { DecisionModal } from "components/modals/modalAcceptOrDecline.component";
import useStylesStore from "store/styles/styles.store";
import { ISectorial } from "interfaces/sectorial.interface";
import { ModalSectorialesMunicipiosFilter } from "components/modals/modalSectoriales-MunicipiosFilter.component";
import { capitalize } from "utils/capitalize";

interface Props {
    border?: boolean;
}

export const FiltersSectoriales = ({ border }: Props) => {
    const { globalColor } = useStylesStore()
    const [modalCleanSectorial, setModalCleanSectorial] = useState<boolean>(false)
    const { sectorialActivo_MunicipiosScreen, setSectorialActivo_MunicipiosScreen } = useActiveStore();
    const [sectorialModal, setSectorialModal] = useState<boolean>(false)
    const [sectorialAEliminar, setSectorialAEliminar] = useState<ISectorial | null>(null);

    const handleCleanSectorial = () => {
        if (!sectorialAEliminar) return;
        setSectorialActivo_MunicipiosScreen(undefined);
        setSectorialAEliminar(null);
        setModalCleanSectorial(false);
    }

    return (
        <View className={`bg-white flex-col w-full h-auto mx-auto mb-2 justify-center items-center gap-2`} >

            {/* buttons */}
            <View className="flex-row w-full gap-2 justify-center items-center px-3">
                <Pressable style={{ borderColor: globalColor }} onPress={() => setSectorialModal(true)} className="px-6 border p-2 w-full rounded-full flex-row gap-2 items-center justify-center">
                    <Text className="text-black text-xl font-bold text-center">
                        {sectorialActivo_MunicipiosScreen ? (
                            <View className="flex-row items-center">
                                <Text className="text-black text-lg font-bold text-center mr-2">
                                    {capitalize(sectorialActivo_MunicipiosScreen.name)}
                                </Text>
                                <Pressable
                                    onPress={() => {
                                        setSectorialAEliminar(sectorialActivo_MunicipiosScreen);
                                        setModalCleanSectorial(true);
                                    }}
                                    className="items-center justify-center"
                                >
                                    <Ionicons name="trash-bin" color={globalColor} size={18} />
                                </Pressable>
                            </View>
                        ) : (
                            'Sectoriales'
                        )}
                    </Text>
                </Pressable>
            </View>

            {/* modals to select */}

            <View className="absolute">
                <ModalSectorialesMunicipiosFilter
                    closeModal={() => setSectorialModal(false)}
                    active={sectorialModal}
                />
            </View>

            {/* basic modals */}
            <View className="absolute">
                <DecisionModal
                    active={modalCleanSectorial}
                    acceptButtonFunction={handleCleanSectorial}
                    declineButtonFunction={() => {
                        setModalCleanSectorial(false)
                        setSectorialAEliminar(null)
                    }}
                    title={`Desea eliminar ${sectorialAEliminar?.name} de la lista de filtros`}
                />
            </View>
        </View >
    )
}