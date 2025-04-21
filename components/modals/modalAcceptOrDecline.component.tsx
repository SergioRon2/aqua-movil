import Modal from 'react-native-modal'
import { CustomButtonPrimary } from "components/buttons/mainButton.component";
import { View, Text } from "react-native";

interface Props {
    active: boolean;
    title: string;
    acceptButtonFunction: () => void;
    declineButtonFunction: () => void;
}

export const DecisionModal = ({ active, title, acceptButtonFunction, declineButtonFunction }: Props) => {
    return (
        <Modal
            isVisible={active}
            onBackdropPress={declineButtonFunction}
            useNativeDriver
            animationIn="zoomIn"
            animationOut="zoomOut"
        >
            <View className="flex-1 justify-center items-center">
                <View className="bg-white p-12 rounded-xl w-11/12 justify-center items-center">
                    <Text className="text-2xl font-bold mb-6 text-center">{title}</Text>
                    <View className='gap-3 w-full items-center'>
                        <CustomButtonPrimary rounded onPress={acceptButtonFunction} title="Aceptar" />
                        <CustomButtonPrimary backgroundWhite rounded onPress={declineButtonFunction} title="Cancelar" />
                    </View>
                </View>
            </View>
        </Modal>
    )
}