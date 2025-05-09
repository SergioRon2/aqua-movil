import { useState } from "react";
import { Pressable, View, Text } from "react-native"
import useActiveStore from "store/actives/actives.store";
import { Ionicons } from '@expo/vector-icons'
import { ModalMunicipios } from "components/modals/modalMunicipios.component";
import { ModalSectoriales } from "components/modals/modalSectoriales.component";
import { DecisionModal } from "components/modals/modalAcceptOrDecline.component";
import { IMunicipio } from "interfaces/municipio.interface";
import useStylesStore from "store/styles/styles.store";
import { capitalize } from "utils/capitalize";
import { ModalEstados } from "components/modals/modalEstados.component";

interface Props {
    border?: boolean;
}

export const FiltersComponentProyectos = ({ border }: Props) => {
    const { globalColor } = useStylesStore()
    const [modalCleanMunicipios, setModalCleanMunicipios] = useState<boolean>(false)
    const [modalCleanSectoriales, setModalCleanSectoriales] = useState<boolean>(false)
    const [modalCleanEstados, setModalCleanEstados] = useState<boolean>(false)
    const { municipiosActivos, setMunicipiosActivos, sectorialActivo, setSectorialActivo, estadoActivo, setEstadoActivo } = useActiveStore();
    const [municipiosModal, setMunicipiosModal] = useState<boolean>(false)
    const [sectorialesModal, setSectorialesModal] = useState<boolean>(false)
    const [estadosModal, setEstadosModal] = useState<boolean>(false)
    const [municipioAEliminar, setMunicipioAEliminar] = useState<IMunicipio | null>(null);

    const handleCleanMunicipios = () => {
        if (!municipioAEliminar) return;

        const nuevos = municipiosActivos?.filter(m => m.id !== municipioAEliminar.id) || [];
        setMunicipiosActivos(nuevos);
        setMunicipioAEliminar(null); // limpiar el estado
        setModalCleanMunicipios(false);
    }

    const handleCleanSectoriales = () => {
        setSectorialActivo(undefined)
        setModalCleanSectoriales(false)
    }

    const handleCleanEstados = () => {
        setEstadoActivo(undefined)
        setModalCleanEstados(false)
    }

    return (
        <View className={`bg-white flex-col w-full h-auto mx-auto mb-4 justify-center items-center gap-2`} >

            {/* buttons */}
            <View className="flex-row w-full gap-2 justify-center items-center">
                <Pressable style={border && { borderColor: globalColor }} onPress={() => setMunicipiosModal(true)} className={`px-6 py-2 w-1/2 gap-2 rounded-full flex-row items-center justify-center ${border ? 'border-2' : ''}`}>
                    <Text className="text-black text-lg font-bold text-center">
                        {municipiosActivos && municipiosActivos.length > 0
                            ? municipiosActivos.map((m, index) => (
                                <View key={m.id} className="flex-row items-center">
                                    <Text className="text-black text-lg font-bold text-center mr-2">{m.nombre}</Text>

                                    {municipiosActivos && municipiosActivos.length > 0 && (
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
                                    {/* {index < municipiosActivos.length - 1 && <Text className="text-black mx-2">,</Text>} */}
                                </View>
                            ))
                            : 'Municipios'}
                    </Text>
                </Pressable>

                <Pressable style={border && { borderColor: globalColor }} onPress={() => setSectorialesModal(true)} className={`px-6 py-2 w-1/2 gap-2 rounded-full flex-row items-center justify-center ${border ? 'border-2' : ''}`}>
                    <Text className="text-black text-lg font-bold text-center">
                        {/* first letter capitalized */}
                        {sectorialActivo ? capitalize(sectorialActivo?.name) : 'Sectoriales'}
                    </Text>
                    {sectorialActivo && (
                        <Pressable onPress={() => setModalCleanSectoriales(true)} className='items-center justify-center'>
                            <Ionicons name='trash-bin' color={globalColor} size={18} />
                        </Pressable>
                    )}
                </Pressable>
            </View>

            <Pressable style={border && { borderColor: globalColor }} onPress={() => setEstadosModal(true)} className={`px-6 py-2 w-full gap-2 rounded-full flex-row items-center justify-center ${border ? 'border-2' : ''}`}>
                <Text className="text-black text-lg font-bold text-center">
                    {/* first letter capitalized */}
                    {estadoActivo ? capitalize(estadoActivo?.name) : 'Estados de proyectos'}
                </Text>
                {estadoActivo && (
                    <Pressable onPress={() => setModalCleanEstados(true)} className='items-center justify-center'>
                        <Ionicons name='trash-bin' color={globalColor} size={18} />
                    </Pressable>
                )}
            </Pressable>


            {/* modals to select */}

            <View className="absolute">
                <ModalMunicipios
                    closeModal={() => setMunicipiosModal(false)}
                    active={municipiosModal}
                />

                <ModalSectoriales
                    closeModal={() => setSectorialesModal(false)}
                    active={sectorialesModal}
                />

                <ModalEstados
                    closeModal={() => setEstadosModal(false)}
                    active={estadosModal}
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

                <DecisionModal
                    active={modalCleanEstados}
                    acceptButtonFunction={handleCleanEstados}
                    declineButtonFunction={() => setModalCleanEstados(false)}
                    title="¿Desea limpiar el filtro de estados?"
                />
            </View>
        </View >
    )
}