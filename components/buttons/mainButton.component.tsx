import { Button } from "@ui-kitten/components";
import { useRef, useState } from "react";
import { ActivityIndicator, Text } from "react-native";

interface Props {
    onPress?: () => void;
    title: string;
    rounded?: boolean
    backgroundWhite?: boolean;
}

export const CustomButtonPrimary = ({ onPress, title, rounded, backgroundWhite }: Props) => {
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


    return <Button 
            style={[
                {borderRadius: rounded ? 25 : 0, width: '95%'}, 
                backgroundWhite && {backgroundColor: '#fff', borderWidth: 1}
            ]} 
            onPress={handlePress}
        >
            {() =>
                loading ? (
                    <ActivityIndicator size={25} color={backgroundWhite ? '#db2777' : '#fff'} />
                ) : (
                    <Text style={{ color: backgroundWhite ? '#db2777' : '#fff', fontWeight: 'bold' }}>
                        {title}
                    </Text>
                )
            }
        </Button>
} 