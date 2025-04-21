import { useState } from "react";
import { Pressable, View, Text } from "react-native"
import useActiveStore from "store/actives/actives.store";
import { Ionicons } from '@expo/vector-icons'
import { ModalMunicipios } from "components/modals/modalMunicipios.component";
import { ModalSectoriales } from "components/modals/modalSectoriales.component";
import { DecisionModal } from "components/modals/modalAcceptOrDecline.component";

interface Props {
    border?: boolean;
}

export const FiltersComponent = ({border}: Props) => {
    const [modalCleanMunicipios, setModalCleanMunicipios] = useState<boolean>(false)
    const [modalCleanSectoriales, setModalCleanSectoriales] = useState<boolean>(false)
    const { municipioActivo, setMunicipioActivo, sectorialActivo, setSectorialActivo } = useActiveStore();
    const [municipiosModal, setMunicipiosModal] = useState<boolean>(false)
    const [sectorialesModal, setSectorialesModal] = useState<boolean>(false)

    const handleCleanMunicipios = () => {
        setMunicipioActivo(undefined)
        setModalCleanMunicipios(false)
    }

    const handleCleanSectoriales = () => {
        setSectorialActivo(undefined)
        setModalCleanSectoriales(false)
    }

    return (
        <View className={`bg-white flex-row w-full h-auto mx-auto mb-4 justify-center items-center animate-fade-in ${border ? 'border-2 border-pink-600': ''}`} >

            {/* buttons */}
            <Pressable onPress={() => setMunicipiosModal(true)} className="px-6 py-2 w-1/2 rounded-sm flex-row gap-2 items-center justify-center">
                <Text className="text-black text-xl font-bold text-center">
                    {municipioActivo ? municipioActivo : 'Municipios'}
                </Text>
                {municipioActivo && (
                    <Pressable onPress={() => setModalCleanMunicipios(true)} className='items-center justify-center'>
                        <Ionicons name='trash-bin' color={'#db2777'} size={18} />
                    </Pressable>
                )}
            </Pressable>

            <Pressable onPress={() => setSectorialesModal(true)} className="px-6 py-2 w-1/2 gap-2 rounded-sm flex-row items-center justify-center">
                <Text className="text-black text-xl font-bold text-center">
                    {/* first letter capitalized */}
                    {sectorialActivo ? sectorialActivo.charAt(0).toUpperCase() + sectorialActivo.slice(1).toLowerCase() : 'Sectoriales'}
                </Text>
                {sectorialActivo && (
                    <Pressable onPress={() => setModalCleanSectoriales(true)} className='items-center justify-center'>
                        <Ionicons name='trash-bin' color={'#db2777'} size={18} />
                    </Pressable>
                )}
            </Pressable>


            {/* modals to select */}

            <View>
                <ModalMunicipios
                    closeModal={() => setMunicipiosModal(false)}
                    active={municipiosModal}
                />

                <ModalSectoriales
                    closeModal={() => setSectorialesModal(false)}
                    active={sectorialesModal}
                />
            </View>


            {/* basic modals */}
            <View>
                <DecisionModal
                    active={modalCleanMunicipios}
                    acceptButtonFunction={handleCleanMunicipios}
                    declineButtonFunction={() => setModalCleanMunicipios(false)}
                    title="¿Desea limpiar el filtro de municipios?"
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