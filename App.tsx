import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import './global.css';
import MainStackNavigator from 'features/layout';
import { AuthProvider } from 'providers/auth-provider/auth.provider';
import { customTheme } from 'config/styles/custom-theme';
import InternetProvider from 'providers/internet-provider/internet.provider';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import useStylesStore from 'store/styles/styles.store';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

export default function App() {
  const { setGlobalColor, globalColor } = useStylesStore();
  
  useEffect(() => {
    const loadColor = async () => {
      try {
        const savedColor = await AsyncStorage.getItem('@primary_color');
        if (savedColor) {
          setGlobalColor(savedColor);
        }
      } catch (error) {
        console.error('Error al cargar el color:', error);
      }
    };
    
    loadColor(); // Llamar la función para cargar el color cuando la app se inicie
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1, backgroundColor: globalColor}} edges={['top', 'left', 'right']}>
        <NavigationContainer>
          <ApplicationProvider {...eva} theme={{ ...customTheme, 'text-font-family': 'Manrope_400Regular' }}>
            <InternetProvider>
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
            </InternetProvider>
          </ApplicationProvider>
          <StatusBar style="auto" />
        </NavigationContainer >
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
