import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import ProyectoScreen from '../proyecto/proyecto.screen';
import Sectoriales from './main-screen/sectoriales.screen';
import UniqueSectorialScreen from './[id]/uniqueSectorial.screen';

const Stack = createStackNavigator();

const SectorialesLayout = () => {
    return (
        <Stack.Navigator initialRouteName="Sectoriales" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Sectoriales" component={Sectoriales} />
            <Stack.Screen name="UniqueSectorial" component={UniqueSectorialScreen} />
            <Stack.Screen name="Proyecto" component={ProyectoScreen} />
        </Stack.Navigator>
    );
};

export default SectorialesLayout;