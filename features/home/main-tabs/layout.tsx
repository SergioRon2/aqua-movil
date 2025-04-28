import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import IAButton from 'components/buttons/IAButton.component';
import { Navbar } from 'components/navigators/navbar.component';
import DashboardLayout from './dashboard/layout';
import SectorialesLayout from './sectoriales/layout';
import MunicipiosLayout from './municipios/layout';
import ProyectosLayout from './proyectos/layout';
import SettingsScreen from './settings/settings.screen';

const Tab = createBottomTabNavigator();

// Tab Navigator
const MainTabNavigator = () => {
    return (
        <View style={{ flex: 1 }}>
            <Navbar />
            <IAButton />
            <Tab.Navigator
                initialRouteName="Home"
                screenOptions={{
                    tabBarActiveTintColor: '#db2777',
                    tabBarInactiveTintColor: 'gray',
                    headerShown: false,
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={DashboardLayout}
                    options={{
                        tabBarLabel: 'Dashboard',
                        tabBarIcon: ({ focused, color, size }: any) => (
                            <Ionicons
                                name={focused ? 'home' : 'home-outline'}
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />
                <Tab.Screen
                    name="SectorialesLayout"
                    component={SectorialesLayout}
                    options={{
                        tabBarLabel: 'Sectoriales',
                        tabBarIcon: ({ focused, color, size }: any) => (
                            <Ionicons
                                name={focused ? 'stats-chart' : 'stats-chart-outline'}
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />
                <Tab.Screen
                    name="MunicipiosLayout"
                    component={MunicipiosLayout}
                    options={{
                        tabBarLabel: 'Municipios',
                        tabBarIcon: ({ focused, color, size }: any) => (
                            <Ionicons
                                name={focused ? 'trail-sign' : 'trail-sign-outline'}
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />
                <Tab.Screen
                    name="ProyectosLayout"
                    component={ProyectosLayout}
                    options={{
                        tabBarLabel: 'Proyectos',
                        tabBarIcon: ({ focused, color, size }: any) => (
                            <Ionicons
                                name={focused ? 'accessibility' : 'accessibility-outline'}
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{
                        tabBarLabel: 'Configuración',
                        tabBarIcon: ({ focused, color, size }: any) => (
                            <Ionicons
                                name={focused ? 'settings' : 'settings-outline'}
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />
            </Tab.Navigator>
        </View>
    );
};

export default MainTabNavigator;