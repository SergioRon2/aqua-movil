import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Municipios from './main-screen/municipios.screen';
import UniqueMunicipioScreen from './[id]/uniqueMunicipio.screen';
import ProyectoScreen from '../proyecto/proyecto.screen';

const Stack = createStackNavigator();

const MunicipiosLayout = () => {
    return (
        <Stack.Navigator initialRouteName="Municipios" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Municipios" component={Municipios} />
            <Stack.Screen name="UniqueMunicipio" component={UniqueMunicipioScreen} />
            <Stack.Screen name="Proyecto" component={ProyectoScreen} />
        </Stack.Navigator>
    );
};

export default MunicipiosLayout;