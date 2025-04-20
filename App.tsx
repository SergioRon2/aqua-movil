import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import './global.css';
import MainStackNavigator from 'features/layout';
import { AuthProvider } from 'providers/auth-provider/auth-provider';
import { customTheme } from 'config/styles/custom-theme';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <ApplicationProvider {...eva} theme={customTheme}>
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
        </ApplicationProvider>
      </AuthProvider>
      <StatusBar style="auto" />
    </NavigationContainer >
  );
}
