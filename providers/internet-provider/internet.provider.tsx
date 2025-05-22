import React, { useEffect, useState, ReactNode, createContext } from 'react';
import NetInfo from '@react-native-community/netinfo';
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
    const { globalColor } = useStylesStore()
    const { setOnline, online } = useInternetStore();
    const [modalOffline, setModalOffline] = useState<boolean>(true);

    useEffect(() => {
        const checkInternetConnection = async () => {
            try {
                const state = await NetInfo.fetch();
                const isOnline = state.isConnected && (state.isInternetReachable ?? true);
                setOnline(isOnline);
                setModalOffline(!isOnline);
            } catch (error) {
                console.error('Error checking internet connection:', error);
                setOnline(false);
                setModalOffline(true);
            }
        };

        checkInternetConnection();

        const unsubscribe = NetInfo.addEventListener((state) => {
            try {
                const isOnline = state.isConnected && (state.isInternetReachable ?? true);
                setOnline(isOnline);
                setModalOffline(!isOnline);
            } catch (error) {
                console.error('Error handling internet state change:', error);
                setOnline(false);
                setModalOffline(true);
            }
        });

        return () => unsubscribe();
    }, []);

    if (online === null) {
        return <Loading />
    }


    return (
        <>
            {children}

            {modalOffline && (
                <View className='bg-white'>
                    <Modal
                        isVisible
                        animationIn="zoomInDown"
                        animationOut="zoomOutUp"
                        backdropColor='#fff'
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
                                    {
                                        keypath: 'Line3 Outlines 5',
                                        color: globalColor,
                                    },
                                    {
                                        keypath: 'Line2 Outlines 5',
                                        color: globalColor,
                                    },
                                    {
                                        keypath: 'Line1 Outlines 5',
                                        color: globalColor,
                                    },
                                    {
                                        keypath: 'Line3 Outlines 3',
                                        color: globalColor,
                                    },
                                    {
                                        keypath: 'Line2 Outlines 3',
                                        color: globalColor,
                                    },
                                    {
                                        keypath: 'Line1 Outlines 3',
                                        color: globalColor,
                                    },
                                    {
                                        keypath: 'Line3 Outlines 2',
                                        color: globalColor,
                                    },
                                    {
                                        keypath: 'Line2 Outlines 2',
                                        color: globalColor,
                                    },
                                    {
                                        keypath: 'Line1 Outlines 2',
                                        color: globalColor,
                                    },
                                    {
                                        keypath: 'Line3 Outlines',
                                        color: globalColor,
                                    },
                                    {
                                        keypath: 'Line2 Outlines',
                                        color: globalColor,
                                    },
                                    {
                                        keypath: 'Line1 Outlines',
                                        color: globalColor,
                                    },
                                    {
                                        keypath: 'Dot Outlines',
                                        color: globalColor,
                                    },
                                ]}
                            />
                            <Text style={{ color: globalColor }} className="text-xl font-bold mb-2">
                                Sin conexión, pero no te preocupes!
                            </Text>
                            <Text className="text-base text-center text-gray-700 mb-4">
                                No tienes acceso a internet pero puedes acceder a la informacion tomada la ultima vez que tuviste acceso a internet.
                            </Text>
                            <CustomButtonPrimary rounded onPress={() => setModalOffline(false)} title='Aceptar' />
                        </View>
                    </Modal>
                </View>
            )}
        </>
    );
};

export default InternetProvider;
