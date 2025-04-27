import LottieView from "lottie-react-native";
import { View } from "react-native"


export const Loading = () => {

    return (
        <View className="flex-1 justify-center items-center bg-white animate-fade-in">
            <LottieView
                source={require('../../assets/lottie/loading.json')}
                autoPlay
                loop
                style={{ width: 200, height: 200 }}
            />
        </View>
    )
}