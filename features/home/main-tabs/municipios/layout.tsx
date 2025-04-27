import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Municipios from './main-screen/municipios.screen';
import UniqueMunicipioScreen from './[id]/uniqueMunicipio.screen';
import ProyectoScreen from '../proyecto/proyecto.screen';
import SearchScreen from '../../search-screen/main-screen/search-screen';
import ChatbotLayout from 'features/home/chatbot-screen/layout';

const Stack = createStackNavigator();

const MunicipiosLayout = () => {
    return (
        <Stack.Navigator initialRouteName="Municipios" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Municipios" component={Municipios} />
            <Stack.Screen name="UniqueMunicipio" component={UniqueMunicipioScreen} />
            <Stack.Screen name="Proyecto" component={ProyectoScreen} />
            <Stack.Screen name="SearchScreen" component={SearchScreen} />
            <Stack.Screen name="ChatbotLayout" component={ChatbotLayout} />
        </Stack.Navigator>
    );
};

export default MunicipiosLayout;