import { createStackNavigator } from "@react-navigation/stack";
import ProyectosScreen from "./main-screen/proyectos.screen";
import ProyectoScreen from "../proyecto/proyecto.screen";
import SearchScreen from "../../search-screen/main-screen/search-screen";
import ChatbotLayout from "features/home/chatbot-screen/layout";
import SubProyectoScreen from "../subproyecto/subproyecto.screen";

const ProyectosLayout = () => {
    const Stack = createStackNavigator();


    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Proyectos' component={ProyectosScreen} />
            <Stack.Screen name='Proyecto' component={ProyectoScreen} />
            <Stack.Screen name='SubProyecto' component={SubProyectoScreen} />
            <Stack.Screen name="SearchScreen" component={SearchScreen} />
            <Stack.Screen name="ChatbotLayout" component={ChatbotLayout} />
        </Stack.Navigator>
    )
}

export default ProyectosLayout;