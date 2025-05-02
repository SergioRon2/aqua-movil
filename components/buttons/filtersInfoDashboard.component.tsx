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
    const { municipiosActivosDashboard, setMunicipiosActivosDashboard, sectorialActivoDashboard, setSectorialActivoDashboard } = useActiveStore();
    const [municipiosModal, setMunicipiosModal] = useState<boolean>(false)
    const [sectorialesModal, setSectorialesModal] = useState<boolean>(false)
    const [municipioAEliminar, setMunicipioAEliminar] = useState<IMunicipio | null>(null);

    const handleCleanMunicipios = () => {
        if (!municipioAEliminar) return;

        const nuevos = municipiosActivosDashboard?.filter(m => m.id !== municipioAEliminar.id) || [];
        setMunicipiosActivosDashboard(nuevos);
        setMunicipioAEliminar(null); // limpiar el estado
        setModalCleanMunicipios(false);
    }


    const handleCleanSectoriales = () => {
        setSectorialActivoDashboard(undefined)
        setModalCleanSectoriales(false)
    }

    return (
        <View style={border && {borderColor: globalColor}} className={`bg-white flex-row w-full h-auto mx-auto mb-4 justify-center items-center animate-fade-in ${border ? 'border-2' : ''}`} >

            {/* buttons */}
            <Pressable onPress={() => setMunicipiosModal(true)} className="px-6 py-2 w-1/2 rounded-sm flex-row gap-2 items-center justify-center">
                <Text className="text-black text-xl font-bold text-center">
                    {municipiosActivosDashboard && municipiosActivosDashboard.length > 0
                        ? municipiosActivosDashboard.map((m, index) => (
                            <View key={m.id} className="flex-row items-center">
                                <Text className="text-black text-xl font-bold text-center mr-2">{m.nombre}</Text>

                                {municipiosActivosDashboard && municipiosActivosDashboard.length > 0 && (
                                    <Pressable
                                        onPress={() => {
                                            setMunicipioAEliminar(m);
                                            setModalCleanMunicipios(true);
                                        }}
                                        className='items-center justify-center'
                                    >
                                        <Ionicons name='trash-bin' color={globalColor} size={18} />
                                    </Pressable>
                                )}
                            </View>
                        ))
                        : 'Municipios'}
                </Text>
            </Pressable>

            <Pressable onPress={() => setSectorialesModal(true)} className="px-6 py-2 w-1/2 gap-2 rounded-sm flex-row items-center justify-center">
                <Text className="text-black text-xl font-bold text-center">
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

            <View>
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
            <View>
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