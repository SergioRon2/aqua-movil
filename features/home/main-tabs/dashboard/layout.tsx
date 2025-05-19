import { createStackNavigator } from "@react-navigation/stack";
import DashboardScreen from "./main-screen/dashboard.screen";
import ProyectosScreen from "../proyectos/main-screen/proyectos.screen";
import ProyectoScreen from "../proyecto/proyecto.screen";
import SearchScreen from "../../search-screen/main-screen/search-screen";
import ChatbotLayout from "features/home/chatbot-screen/layout";
import SubProyectoScreen from "../subproyecto/subproyecto.screen";


const DashboardLayout = () => {
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator
            initialRouteName="Dashboard"
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: "#fff",
                },
            }}
        >
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Proyectos" component={ProyectosScreen} />
            <Stack.Screen name="Proyecto" component={ProyectoScreen} />
            <Stack.Screen name="SubProyecto" component={SubProyectoScreen} />
            {/* <Stack.Screen name="Proyecto-Dashboard-Sectoriales" component={ProyectoDashboardSectorialesScreen} /> */}
            <Stack.Screen name="SearchScreen" component={SearchScreen} />
            <Stack.Screen name="ChatbotLayout" component={ChatbotLayout} />
        </Stack.Navigator>
    );
}

export default DashboardLayout;