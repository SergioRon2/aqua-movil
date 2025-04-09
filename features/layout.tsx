import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './login/login.screen';
import HomeTabNavigator from './home/layout';
import useAuthStore from 'store/auth/auth.store';
import { useEffect } from 'react';

const Stack = createStackNavigator();

const MainStackNavigator = () => {
    const { isAuthenticated } = useAuthStore();

    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: '#fff',
                },
            }}>
            {!isAuthenticated ? (
                <Stack.Screen name="Login" component={LoginScreen} />
            ) :
                <Stack.Screen name="Home" component={HomeTabNavigator} />
            }

        </Stack.Navigator>
    );
};


export default MainStackNavigator;