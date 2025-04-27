import { createStackNavigator } from "@react-navigation/stack";
import MainTabNavigator from "./main-tabs/layout";
import SearchLayout from "./search-screen/layout";
import ChatbotLayout from "./chatbot-screen/layout";

const HomeNavigator = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen name="SearchScreen" component={SearchLayout} />
            <Stack.Screen name="ChatbotScreen" component={ChatbotLayout} />
        </Stack.Navigator>
    );
};

export default HomeNavigator;