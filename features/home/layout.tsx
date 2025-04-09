import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from './dashboard/dashboard.screen';
import SettingsScreen from './settings/settings.screen';

const Tab = createBottomTabNavigator();

const Municipios = () => (
    <View className='mt-7 flex-1 bg-yellow-300 justify-center items-center'>
        <Text className='animate-fade-in'>Municipios Screen</Text>
    </View>
);

const Sectoriales = () => (
    <View className='mt-7 flex-1 bg-red-300 justify-center items-center'>
        <Text className='animate-fade-in'>Sectoriales Screen</Text>
    </View>
);

// Tab Navigator
const HomeTabNavigator = () => {
    return (
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
    );
};


export default HomeTabNavigator;