import { createStackNavigator } from "@react-navigation/stack"
import SearchScreen from "./main-screen/search-screen";
import ProyectoScreen from "../main-tabs/proyecto/proyecto.screen";
import { View } from "react-native";
import { Navbar } from "components/navigators/navbar.component";
import SubProyectoScreen from "../main-tabs/subproyecto/subproyecto.screen";


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
            <Stack.Screen
                name='SubProyecto'
                children={() => (
                    <View className="flex-1">
                        <Navbar />
                        <SubProyectoScreen />
                    </View>
                )}
            />
        </Stack.Navigator>
    )
}

export default SearchLayout;