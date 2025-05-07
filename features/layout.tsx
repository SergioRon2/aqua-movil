import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './login/login.screen';
import useAuthStore from 'store/auth/auth.store';
import { useEffect } from 'react';
import HomeNavigator from './home/layout';
import useStylesStore from 'store/styles/styles.store';

const Stack = createStackNavigator();

const MainStackNavigator = () => {
    const {globalColor} = useStylesStore();
    return ( 
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: globalColor,
                },
            }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Home" component={HomeNavigator} />
        </Stack.Navigator>
    );
};


export default MainStackNavigator;