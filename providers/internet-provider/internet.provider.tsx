import React, { useEffect, useState, ReactNode } from 'react';
import NetInfo from '@react-native-community/netinfo';
import Modal from 'react-native-modal';
import { View, Text, Pressable } from 'react-native';
import { CustomButtonPrimary } from 'components/buttons/mainButton.component';
import { Loading } from 'components/loading/loading.component';

type Props = {
    children: ReactNode;
};

const InternetProvider = ({ children }: Props) => {
    const [isConnected, setIsConnected] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState<boolean>(false)

    const fetchInternet = () => {
        setModalVisible(false)
        setLoading(true)
        setTimeout(() => {
            setLoading(false);
            NetInfo.addEventListener(state => {
                const connected = state.isConnected ?? false;
                setIsConnected(connected);
                setModalVisible(!connected);
            });
        }, 3000)
    }

    useEffect(() => console.log(isConnected), [isConnected])

    if (loading) {
        <Loading /> 
    }

    return (
        <>
            {children}

            <Modal
                isVisible={modalVisible}
                animationIn="zoomInDown"
                animationOut="zoomOutUp"
                backdropOpacity={0.6}
                useNativeDriver
                onBackdropPress={() => { }}
                onBackButtonPress={() => { }}
            >
                <View className="bg-white rounded-2xl p-6 items-center shadow-xl">
                    <Text className="text-xl font-bold text-pink-600 mb-2">
                        Sin conexión
                    </Text>
                    <Text className="text-base text-center text-gray-700 mb-4">
                        No tienes acceso a internet. Por favor revisa tu conexión.
                    </Text>
                    <CustomButtonPrimary onPress={fetchInternet} title='Reintentar' />
                </View>
            </Modal>
        </>
    );
};

export default InternetProvider;
