import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from './dashboard/dashboard.screen';
import SettingsScreen from './settings/settings.screen';
import Sectoriales from './sectoriales/sectoriales.screen';
import Municipios from './municipios/municipios.screen';
import IAButton from 'components/buttons/IAButton.component';
import {Navbar} from 'components/navigators/navbar.component';

const Tab = createBottomTabNavigator();

// Tab Navigator
const HomeTabNavigator = () => {
    return (
        <View style={{ flex: 1 }} className="mt-8">
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
                    name="Sectoriales"
                    component={Sectoriales}
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
                    name="Home"
                    component={DashboardScreen}
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
                    name="Municipios"
                    component={Municipios}
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

export default HomeTabNavigator;