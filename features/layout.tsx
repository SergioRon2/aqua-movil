import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './login/login.screen';
import useAuthStore from 'store/auth/auth.store';
import { useEffect } from 'react';
import HomeNavigator from './home/layout';

const Stack = createStackNavigator();

const MainStackNavigator = () => {

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: '#fff',
                },
            }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Home" component={HomeNavigator} />
        </Stack.Navigator>
    );
};


export default MainStackNavigator;