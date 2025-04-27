import { createStackNavigator } from "@react-navigation/stack";
import ChatbotScreen from "./main-screen/chatbot-screen";


const ChatbotLayout = () => {
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Chatbot" component={ChatbotScreen} />
        </Stack.Navigator>
    )
}

export default ChatbotLayout;