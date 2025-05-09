import { useState } from "react";
import { Pressable, View, Text } from "react-native"
import useActiveStore from "store/actives/actives.store";
import { Ionicons } from '@expo/vector-icons'
import { DecisionModal } from "components/modals/modalAcceptOrDecline.component";
import { IMunicipio } from "interfaces/municipio.interface";
import { ModalMunicipiosDashboard } from "components/modals/modalMunicipiosDashboard.component";
import { ModalSectorialesDashboard } from "components/modals/modalSectorialesDashboard.component";
import useStylesStore from "store/styles/styles.store";
import { capitalize } from "utils/capitalize";

interface Props {
    border?: boolean;
}

export const FiltersComponentDashboard = ({ border }: Props) => {
    const {globalColor} = useStylesStore()
    const [modalCleanMunicipios, setModalCleanMunicipios] = useState<boolean>(false)
    const [modalCleanSectoriales, setModalCleanSectoriales] = useState<boolean>(false)
    const { municipioActivoDashboard, setMunicipioActivoDashboard, sectorialActivoDashboard, setSectorialActivoDashboard } = useActiveStore();
    const [municipiosModal, setMunicipiosModal] = useState<boolean>(false)
    const [sectorialesModal, setSectorialesModal] = useState<boolean>(false)
    const [municipioAEliminar, setMunicipioAEliminar] = useState<IMunicipio | null>(null);

    const handleCleanMunicipios = () => {
        if (!municipioAEliminar) return;
        setMunicipioActivoDashboard(undefined);
        setMunicipioAEliminar(null);
        setModalCleanMunicipios(false);
    }


    const handleCleanSectoriales = () => {
        setSectorialActivoDashboard(undefined)
        setModalCleanSectoriales(false)
    }

    return (
        <View style={border && {borderColor: globalColor}} className={`bg-white flex-row w-full h-auto mb-4 justify-center items-center animate-fade-in gap-2 px-3`} >

            {/* buttons */}
            <Pressable style={{borderColor: globalColor}} onPress={() => setMunicipiosModal(true)} className="px-6 border py-2 w-1/2 rounded-full flex-row gap-2 items-center justify-center">
                <Text className="text-black text-xl font-bold text-center">
                    {municipioActivoDashboard ? (
                        <View className="flex-row items-center">
                            <Text className="text-black text-lg font-bold text-center mr-2">
                                {municipioActivoDashboard.nombre}
                            </Text>
                            <Pressable
                                onPress={() => {
                                    setMunicipioAEliminar(municipioActivoDashboard);
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

            <Pressable style={{borderColor: globalColor}} onPress={() => setSectorialesModal(true)} className="px-6 border py-2 w-1/2 gap-2 rounded-full flex-row items-center justify-center">
                <Text className="text-black text-lg font-bold text-center">
                    {/* first letter capitalized */}
                    {sectorialActivoDashboard ? capitalize(sectorialActivoDashboard?.name) : 'Sectoriales'}
                </Text>
                {sectorialActivoDashboard && (
                    <Pressable onPress={() => setModalCleanSectoriales(true)} className='items-center justify-center'>
                        <Ionicons name='trash-bin' color={globalColor} size={18} />
                    </Pressable>
                )}
            </Pressable>


            {/* modals to select */}

            <View className="absolute">
                <ModalMunicipiosDashboard
                    closeModal={() => setMunicipiosModal(false)}
                    active={municipiosModal}
                />

                <ModalSectorialesDashboard
                    closeModal={() => setSectorialesModal(false)}
                    active={sectorialesModal}
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
                    title={`Desea eliminar ${municipioAEliminar?.nombre} de la lista de filtros`}
                />

                <DecisionModal
                    active={modalCleanSectoriales}
                    acceptButtonFunction={handleCleanSectoriales}
                    declineButtonFunction={() => setModalCleanSectoriales(false)}
                    title="¿Desea limpiar el filtro de sectoriales?"
                />
            </View>
        </View >
    )
}