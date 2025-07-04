import React, { useEffect, useState, ReactNode } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import Modal from 'react-native-modal';
import { View, Text } from 'react-native';
import { CustomButtonPrimary } from 'components/buttons/mainButton.component';
import { Loading } from 'components/loading/loading.component';
import LottieView from 'lottie-react-native';
import useStylesStore from 'store/styles/styles.store';
import useInternetStore from 'store/internet/internet.store';

type Props = {
    children: ReactNode;
};

const InternetProvider = ({ children }: Props) => {
    const { globalColor } = useStylesStore();
    const { setOnline, online } = useInternetStore();
    const [showModal, setShowModal] = useState<boolean>(false);

    const isReallyOnline = (state: NetInfoState) => {
        // Si isInternetReachable es null, asumimos true para no bloquear sin motivo
        return state.isConnected && (state.isInternetReachable ?? true);
    };

    useEffect(() => {
        const checkInitialConnection = async () => {
            try {
                const state = await NetInfo.fetch();
                const connected = isReallyOnline(state);
                setOnline(connected);
                setShowModal(!connected);
            } catch (error) {
                console.error('Error checking initial internet:', error);
                setOnline(false);
                setShowModal(true);
            }
        };

        checkInitialConnection();

        const unsubscribe = NetInfo.addEventListener((state) => {
            const connected = isReallyOnline(state);
            setOnline(connected);
            setShowModal(!connected);
        });

        return () => unsubscribe();
    }, []);

    if (online === null) return <Loading />;

    return (
        <>
            {children}

            <View>
                <Modal
                    isVisible={showModal}
                    animationIn="zoomInDown"
                    animationOut="zoomOutUp"
                    backdropColor="#fff"
                    backdropOpacity={1}
                    useNativeDriver
                    onBackdropPress={() => { }}
                    onBackButtonPress={() => { }}
                >
                    <View className="bg-white rounded-2xl p-6 items-center shadow-xl">
                        <LottieView
                            source={require('../../assets/lottie/not_internet.json')}
                            autoPlay
                            loop
                            style={{ width: 200, height: 200 }}
                            colorFilters={[
                                { keypath: 'Line3 Outlines 5', color: globalColor },
                                { keypath: 'Line2 Outlines 5', color: globalColor },
                                { keypath: 'Line1 Outlines 5', color: globalColor },
                                { keypath: 'Line3 Outlines 3', color: globalColor },
                                { keypath: 'Line2 Outlines 3', color: globalColor },
                                { keypath: 'Line1 Outlines 3', color: globalColor },
                                { keypath: 'Line3 Outlines 2', color: globalColor },
                                { keypath: 'Line2 Outlines 2', color: globalColor },
                                { keypath: 'Line1 Outlines 2', color: globalColor },
                                { keypath: 'Line3 Outlines', color: globalColor },
                                { keypath: 'Line2 Outlines', color: globalColor },
                                { keypath: 'Line1 Outlines', color: globalColor },
                                { keypath: 'Dot Outlines', color: globalColor },
                            ]}
                        />
                        <Text style={{ color: globalColor }} className="text-xl font-bold mb-2">
                            Sin conexión, pero no te preocupes!
                        </Text>
                        <Text className="text-base text-center text-gray-700 mb-4">
                            No tienes acceso a internet pero puedes acceder a la información tomada la última vez que tuviste acceso a internet.
                        </Text>
                        <CustomButtonPrimary rounded onPress={() => setShowModal(false)} title="Aceptar" />
                    </View>
                </Modal>
            </View>
        </>
    );
};

export default InternetProvider;
