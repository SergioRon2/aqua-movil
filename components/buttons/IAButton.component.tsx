import { Pressable, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useStylesStore from 'store/styles/styles.store';


const IAButton = () => {
    const {globalColor} = useStylesStore()
    const navigation = useNavigation();

    const onPress = () => {
        navigation.navigate('ChatbotScreen');
    };

    return (
        <>
            <Pressable style={{backgroundColor: globalColor}} className="p-4 rounded-full w-16 h-16 absolute bottom-20 right-4 z-50 flex items-center justify-center active:opacity-50" onPress={onPress}>
                <Text className='text-2xl font-bold text-white'>IA</Text>
            </Pressable>
        </>
    );
};

export default IAButton;