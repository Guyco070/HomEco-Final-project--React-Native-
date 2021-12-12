import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View ,dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {createAppContainer} from "react-navigation"
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import SignUpScreen from './screens/SignUpScreen';
import EditProfile from './screens/EditProfile';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CreateNewHouseScreen from './screens/CreateNewHouseScreen';
import HouseProfileScreen from './screens/HouseProfileScreen';
import {Feather} from "@expo/vector-icons";
import General from './screens/General';


const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="CreateNewHouse" component={CreateNewHouseScreen} />
        <Stack.Screen name="HouseProfile" component={HouseProfileScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="General" component={General} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
