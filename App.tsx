import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import './global.css';
import MainStackNavigator from 'features/layout';
import { AuthProvider } from 'providers/auth-provider/auth-provider';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: '#fff',
            },
          }}
        >
          <Stack.Screen name="Layout" component={MainStackNavigator} />
        </Stack.Navigator>
      </AuthProvider>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
