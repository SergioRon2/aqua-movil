import { useNavigation } from "@react-navigation/native"
import { Pressable } from "react-native";
import {Ionicons} from '@expo/vector-icons'

export const BackButton = () => {
    const navigation = useNavigation();

    const handleBackNavigation = () => {
        navigation.goBack();
    }

    return (
        <Pressable className="p-4 w-16 h-16 rounded-full justify-center items-center bg-pink-600 animate-fade-in" onPress={handleBackNavigation}>
            <Ionicons color={'#fff'} size={22} name='arrow-back-outline'  />
        </Pressable>
    )
}