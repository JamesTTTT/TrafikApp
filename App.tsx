import { StatusBar } from 'expo-status-bar';
import { RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Delay from './components/Delay';
import DelayMap from './components/Maps';
import Auth from './components/Auth/Auth';
import Favourite from './components/Favourite';
import authModel from './models/auth';

import { Base } from './styles';

const Tab = createBottomTabNavigator();
const routeIcons = {
  "Delays": "ios-time-outline",
  "Map": "map",
  "Logga in": "key"
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<Boolean>(false);

  useEffect(async () => {
    setIsLoggedIn(await authModel.loggedIn())
  }, []);

  return (
    <SafeAreaView style={Base.container}>
    <NavigationContainer>
      <Tab.Navigator screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
          let iconName = routeIcons[route.name] || "alert";
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'light-gray',
      })}
      >
        <Tab.Screen name ="Delays">
          {() => <Delay/>}
        </Tab.Screen>
        <Tab.Screen name ="Map">
          {() => <DelayMap/>}
        </Tab.Screen>
      {isLoggedIn ?
      <Tab.Screen name="Favorites">
        {() => <Favourite setIsLoggedIn={setIsLoggedIn}/>}
      </Tab.Screen> :
      <Tab.Screen name="Logga in">
        {() => <Auth setIsLoggedIn={setIsLoggedIn} />}
      </Tab.Screen>
    }
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
    </SafeAreaView>
  );
}

