import React, { useEffect, useState, ReactNode, createContext } from 'react';
import NetInfo from '@react-native-community/netinfo';
import Modal from 'react-native-modal';
import { View, Text, Pressable } from 'react-native';
import { CustomButtonPrimary } from 'components/buttons/mainButton.component';
import { Loading } from 'components/loading/loading.component';
import LottieView from 'lottie-react-native';
import useStylesStore from 'store/styles/styles.store';

type Props = {
    children: ReactNode;
};

const InternetContext = createContext<boolean | null>(null);

const InternetProvider = ({ children }: Props) => {
    const {globalColor} = useStylesStore()
    const [isConnected, setIsConnected] = useState<boolean | null>(true);

    useEffect(() => {
        const checkInternetConnection = async () => {
            const state = await NetInfo.fetch();
            setIsConnected(state.isConnected && state.isInternetReachable);
        };

        checkInternetConnection();

        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsConnected(state.isConnected && state.isInternetReachable);
        });

        return () => unsubscribe();
    }, []);

    const fetchInternet = async () => {
        setIsConnected(null);
        setTimeout(() => {
            NetInfo.fetch().then((state) => {
                setIsConnected(state.isConnected && state.isInternetReachable);
            });
        }, 2000)
    }

    if (isConnected === null) {
        <Loading />
    }

    return (
        <>
            <InternetContext.Provider value={isConnected}>
                {children}
            </InternetContext.Provider>

            {!isConnected && (
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
                            />
                            <Text style={{color: globalColor}} className="text-xl font-bold mb-2">
                                Sin conexión
                            </Text>
                            <Text className="text-base text-center text-gray-700 mb-4">
                                No tienes acceso a internet. Por favor revisa tu conexión.
                            </Text>
                            <CustomButtonPrimary rounded onPress={fetchInternet} title='Reintentar' />
                        </View>
                    </Modal>
                </View>
            )}
        </>
    );
};

export default InternetProvider;
