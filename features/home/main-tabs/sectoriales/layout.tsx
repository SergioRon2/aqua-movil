import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProyectoScreen from '../proyecto/proyecto.screen';
import Sectoriales from './main-screen/sectoriales.screen';
import UniqueSectorialScreen from './[id]/uniqueSectorial.screen';
import SearchScreen from '../../search-screen/main-screen/search-screen';
import ChatbotLayout from 'features/home/chatbot-screen/layout';
import SubProyectoScreen from '../subproyecto/subproyecto.screen';

const Stack = createStackNavigator();

const SectorialesLayout = () => {
    return (
        <Stack.Navigator initialRouteName="Sectoriales" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Sectoriales" component={Sectoriales} />
            <Stack.Screen name="UniqueSectorial" component={UniqueSectorialScreen} />
            <Stack.Screen name="Proyecto" component={ProyectoScreen} />
            <Stack.Screen name="SubProyecto" component={SubProyectoScreen} />
            <Stack.Screen name="SearchScreen" component={SearchScreen} />
            <Stack.Screen name="ChatbotLayout" component={ChatbotLayout} />
        </Stack.Navigator>
    );
};

export default SectorialesLayout;