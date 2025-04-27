import { createStackNavigator } from "@react-navigation/stack"
import SearchScreen from "./main-screen/search-screen";
import ProyectoScreen from "../main-tabs/proyecto/proyecto.screen";
import { View } from "react-native";
import { Navbar } from "components/navigators/navbar.component";
import IAButton from "components/buttons/IAButton.component";


const SearchLayout = () => {
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='SearchScreen' component={SearchScreen} />
            <Stack.Screen
                name='Proyecto'
                children={() => (
                    <View className="flex-1">
                        <Navbar />
                        <ProyectoScreen />
                    </View>
                )}
            />
        </Stack.Navigator>
    )
}

export default SearchLayout;