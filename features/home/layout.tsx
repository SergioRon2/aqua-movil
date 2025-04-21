import { createStackNavigator } from "@react-navigation/stack";
import MainTabNavigator from "./main-tabs/layout";
import SearchLayout from "./search-screen/layout";

const HomeNavigator = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen name="SearchScreen" component={SearchLayout} />
        </Stack.Navigator>
    );
};

export default HomeNavigator;