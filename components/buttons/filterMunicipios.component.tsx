import { useState } from "react";
import { Pressable, View, Text } from "react-native"
import useActiveStore from "store/actives/actives.store";
import { Ionicons } from '@expo/vector-icons'
import { DecisionModal } from "components/modals/modalAcceptOrDecline.component";
import { IMunicipio } from "interfaces/municipio.interface";
import useStylesStore from "store/styles/styles.store";
import { ModalMunicipiosSectorialFilter } from "components/modals/modalMunicipios-SectorialFilter.component";

interface Props {
    border?: boolean;
}

export const FiltersMunicipios = ({ border }: Props) => {
    const { globalColor } = useStylesStore()
    const [modalCleanMunicipios, setModalCleanMunicipios] = useState<boolean>(false)
    const { municipioActivo_SectorialesScreen, setMunicipioActivo_SectorialesScreen } = useActiveStore();
    const [municipiosModal, setMunicipiosModal] = useState<boolean>(false)
    const [municipioAEliminar, setMunicipioAEliminar] = useState<IMunicipio | null>(null);

    const handleCleanMunicipios = () => {
        if (!municipioAEliminar) return;
        setMunicipioActivo_SectorialesScreen(undefined);
        setMunicipioAEliminar(null);
        setModalCleanMunicipios(false);
    }

    return (
        <View className={`bg-white flex-col w-full h-auto mx-auto mb-2 justify-center items-center gap-2`} >

            {/* buttons */}
            <View className="flex-row w-full gap-2 justify-center items-center px-3">
                <Pressable style={{ borderColor: globalColor }} onPress={() => setMunicipiosModal(true)} className="px-6 border p-2 w-full rounded-full flex-row gap-2 items-center justify-center">
                    <Text className="text-black text-xl font-bold text-center">
                        {municipioActivo_SectorialesScreen ? (
                            <View className="flex-row items-center">
                                <Text className="text-black text-lg font-bold text-center mr-2">
                                    {municipioActivo_SectorialesScreen.nombre}
                                </Text>
                                <Pressable
                                    onPress={() => {
                                        setMunicipioAEliminar(municipioActivo_SectorialesScreen);
                                        setModalCleanMunicipios(true);
                                    }}
                                    className="items-center justify-center"
                                >
                                    <Ionicons name="trash-bin" color={globalColor} size={18} />
                                </Pressable>
                            </View>
                        ) : (
                            'Municipios'
                        )}
                    </Text>
                </Pressable>
            </View>

            {/* modals to select */}

            <View className="absolute">
                <ModalMunicipiosSectorialFilter
                    closeModal={() => setMunicipiosModal(false)}
                    active={municipiosModal}
                />
            </View>

            {/* basic modals */}
            <View className="absolute">
                <DecisionModal
                    active={modalCleanMunicipios}
                    acceptButtonFunction={handleCleanMunicipios}
                    declineButtonFunction={() => {
                        setModalCleanMunicipios(false)
                        setMunicipioAEliminar(null)
                    }}
                    title={`¿Desea eliminar ${municipioAEliminar?.nombre} de la lista de filtros?`}
                />
            </View>
        </View >
    )
}