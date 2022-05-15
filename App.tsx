import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Delay from './components/Delay';
import DelayMap from './components/Maps';

import { Base } from './styles';

const Tab = createBottomTabNavigator();
const routeIcons = {
  "Delays": "ios-time-outline",
  "DelayMap": "map",
};

export default function App() {
  return (
    <SafeAreaView style={Base.container}>
    <NavigationContainer>
      <Tab.Navigator screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
          let iconName = routeIcons[route.name] || "alert";
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3C6478',
        tabBarInactiveTintColor: 'gray',
      })}
      >
        <Tab.Screen name ="Delays">
          {() => <Delay/>}
        </Tab.Screen>
        <Tab.Screen name ="DelayMap">
          {() => <DelayMap/>}
        </Tab.Screen>
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
    </SafeAreaView>
  );
}

