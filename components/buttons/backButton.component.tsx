import { useNavigation } from "@react-navigation/native"
import { Pressable } from "react-native";
import {Ionicons} from '@expo/vector-icons'
import useStylesStore from "store/styles/styles.store";

export const BackButton = () => {
    const {globalColor} = useStylesStore()
    const navigation = useNavigation();

    const handleBackNavigation = () => {
        navigation.goBack();
    }

    return (
        <Pressable style={{backgroundColor: globalColor}} className="p-4 w-16 h-16 rounded-full justify-center items-center" onPress={handleBackNavigation}>
            <Ionicons color={'#fff'} size={22} name='arrow-back-outline'  />
        </Pressable>
    )
}