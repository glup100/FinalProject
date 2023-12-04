import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignIn from '../screens/SignInScreen/SignIn';
import SignUp from '../screens/SignUpScreen/SignUp';
import Home from '../screens/HomeScreen';
import EventCard from '../screens/EventCardScreen/EventCard';
import AccessCode from '../screens/AccessCodeScreen/AccessCode';
import Responses from '../screens/ResponsesScreen/Responses'



const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="EventCard" component={EventCard} />
        <Stack.Screen name="AccessCode" component={AccessCode} />
        <Stack.Screen name="Responses" component={Responses} />
        
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation;


