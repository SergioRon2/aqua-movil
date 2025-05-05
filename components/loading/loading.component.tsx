import LottieView from "lottie-react-native";
import { ActivityIndicator, View } from "react-native"
import useStylesStore from "store/styles/styles.store";


export const Loading = () => {
    const {globalColor} = useStylesStore()
    return (
        <View className="flex-1 justify-center items-center bg-white animate-fade-in">
            <LottieView
                colorFilters={[
                    {
                        keypath: 'Shape Layer 1',
                        color: globalColor,
                    },
                    {
                        keypath: 'Shape Layer 2',
                        color: globalColor,
                    },
                    {
                        keypath: 'Shape Layer 3',
                        color: globalColor,
                    },
                    {
                        keypath: 'Shape Layer 4',
                        color: globalColor,
                    },
                    {
                        keypath: 'Shape Layer 5',
                        color: globalColor,
                    },
                ]}
                source={require('../../assets/lottie/loading.json')}
                autoPlay
                loop
                style={{ width: 200, height: 200 }}
            />
        </View>
    )
}