import { createStackNavigator } from "@react-navigation/stack";
import DashboardScreen from "./main-screen/dashboard.screen";
import ProyectosScreen from "../proyectos/main-screen/proyectos.screen";
import ProyectoScreen from "../proyecto/proyecto.screen";


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
        </Stack.Navigator>
    );
}

export default DashboardLayout;