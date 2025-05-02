import { useRef, useState } from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import useStylesStore from "store/styles/styles.store";

interface Props {
    onPress?: () => void;
    title: string;
    rounded?: boolean
    backgroundWhite?: boolean;
}

export const CustomButtonPrimary = ({ onPress, title, rounded, backgroundWhite }: Props) => {
    const { globalColor } = useStylesStore()
    const [loading, setLoading] = useState<boolean>(false);

    const handlePress = () => {
        setLoading(true)
        setTimeout(() => {
            if (onPress) {
                onPress();
            }
            setLoading(false)
        }, 1000)
    }


    return <Pressable
        className="shadow-lg"
        style={[
            { borderRadius: rounded ? 25 : 0, width: '95%', padding: 12 },
            backgroundWhite ? { backgroundColor: '#fff', borderWidth: 1, borderColor: globalColor } : { backgroundColor: globalColor, borderWidth: 0 },
        ]}
        onPress={handlePress}
    >
        {() =>
            loading ? (
                <ActivityIndicator size={25} color={backgroundWhite ? globalColor : '#fff'} />
            ) : (
                <Text style={{ color: backgroundWhite ? globalColor : '#fff', fontWeight: 'bold', textAlign: 'center' }}>
                    {title}
                </Text>
            )
        }
    </Pressable>
} 