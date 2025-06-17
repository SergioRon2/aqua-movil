import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomButtonPrimary } from 'components/buttons/mainButton.component';
import ProyectoCard from 'components/cards/proyectoCard.component';
import { IProyectoDashboard } from 'interfaces/proyecto.interface';
import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import { Modal, View, Text, FlatList, ActivityIndicator } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { StateService } from 'services/states/states.service';
import useActiveStore from 'store/actives/actives.store';
import useInternetStore from 'store/internet/internet.store';
import useStylesStore from 'store/styles/styles.store';

interface Props {
    showModal: boolean;
    setShowModal: (value: boolean) => void;
    selectedItem: { sector_id: number, label: string, value: number };
}

export const ModalSector = ({ showModal, setShowModal, selectedItem }: Props) => {
    const [proyectos, setProyectos] = useState<IProyectoDashboard[]>([])
    const [loading, setLoading] = useState(true)
    const { globalColor } = useStylesStore()
    const { fechaInicio, fechaFin, planDesarrolloActivo, municipioActivoDashboard, sectorialActivoDashboard } = useActiveStore()
    const { online } = useInternetStore();

    useEffect(() => {
        const fetchProjectsByDashboard = async () => {
            try {
                setLoading(true)
                let projectsData: IProyectoDashboard[] = [];
                if (online === null) {
                    return;
                }
                if (online) {
                    const res = await StateService.getStatesData({
                        sectorial_id: selectedItem.sector_id,
                        fechaInicio,
                        fechaFin,
                        development_plan_id: planDesarrolloActivo?.id,
                        municipio_id: municipioActivoDashboard?.id
                    });
                    projectsData = res?.data?.projects || [];
                    // Guarda todos los datos recibidos en AsyncStorage (sin identificadores específicos)
                    await AsyncStorage.setItem(
                        'projects_data',
                        JSON.stringify(projectsData)
                    );
                } else {
                    // Si no hay internet, usa los datos guardados
                    const stored = await AsyncStorage.getItem('projects_data');
                    projectsData = stored ? JSON.parse(stored) : [];
                }
                setProyectos(projectsData);
            } catch (error) {
                console.error({ error })
            } finally {
                setLoading(false)
            }
        }

        fetchProjectsByDashboard();
    }, [selectedItem.sector_id, fechaInicio, fechaFin])

    return (
        <View>
            <Modal
                transparent
                animationType="fade"
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="p-6 bg-white items-center justify-between rounded-2xl w-5/6 max-h-5/6 shadow-2xl gap-6 border border-gray-200">
                        <Text className="text-2xl font-extrabold text-center text-gray-800">{selectedItem.label}</Text>
                        {!loading && <Text className="text-gray-500 text-lg font-medium text-center">
                            Actualmente en este sector hay <Text className="text-gray-800 font-bold">{proyectos.length}</Text> proyectos.
                        </Text>}

                        <View className='h-2/3'>
                            {loading ? (
                                <ActivityIndicator size="large" color={globalColor} className="m-auto" />
                            ) : proyectos.length > 0 ? (
                                <>
                                    <FlatList
                                        data={proyectos}
                                        keyExtractor={(item, index) => `${item.id}-${index}`}
                                        renderItem={({ item, index }) => (
                                            <Animated.View entering={FadeInDown.delay(index * 200)} exiting={FadeOutDown}>
                                                <ProyectoCard setModalFalse={setShowModal} data={item} />
                                            </Animated.View>
                                        )}
                                    />
                                </>
                            ) : (
                                <View className='justify-center items-center m-auto'>
                                    <LottieView
                                        source={require('../../assets/lottie/not_found.json')}
                                        autoPlay
                                        loop
                                        style={{ width: 350, height: 350 }}
                                    />
                                    <Text style={{ color: globalColor }} className="text-center text-lg font-bold mt-4 animate-fade-in">No hay proyectos disponibles.</Text>
                                </View>
                            )}
                        </View>

                        <CustomButtonPrimary
                            rounded
                            title="Cerrar"
                            onPress={() => setShowModal(false)}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    )
}