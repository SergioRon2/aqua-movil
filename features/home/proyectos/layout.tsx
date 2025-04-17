import { createStackNavigator } from "@react-navigation/stack";
import ProyectosScreen from "./main-screen/proyectos.screen";
import ProyectoScreen from "../proyecto/proyecto.screen";

const ProyectosLayout = () => {
    const Stack = createStackNavigator();


    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Proyectos' component={ProyectosScreen} />
            <Stack.Screen name='Proyecto' component={ProyectoScreen} />
        </Stack.Navigator>
    )
}

export default ProyectosLayout;