import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View ,dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {createAppContainer} from "react-navigation"
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import SignUpScreen from './screens/SignUpScreen';
import EditUserProfileScreen from './screens/EditUserProfileScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CreateNewHouseScreen from './screens/CreateNewHouseScreen';
import HouseProfileScreen from './screens/HouseProfileScreen';
import EditHouseProfileScreen from './screens/EditHouseProfileScreen';
import General from './screens/General';
import AddNewExpenditureScreen from './screens/AddNewExpenditureScreen';
import AddNewSelfIncomeScreen from './screens/AddNewSelfIncomeScreen';
import BarcodeScanner from './components/BarcodeScanner';
import ImageViewer from './components/ImageViewer';
import { I18nManager } from 'react-native'
import UserProfileScreen from './screens/UserProfileScreen';
import EditExpenditureScreen from './screens/EditExpenditureScreen';
import EditSelfIncomeScreen from './screens/EditSelfIncomeScreen';

console.disableYellowBox = true;

const Stack = createNativeStackNavigator();
// I18nManager.forceRTL(false);
// I18nManager.allowRTL(false);
// I18nManager.swapLeftAndRightInRTL(false);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="EditUserProfile" component={EditUserProfileScreen} />
        <Stack.Screen name="CreateNewHouse" component={CreateNewHouseScreen} />
        <Stack.Screen name="HouseProfile" component={HouseProfileScreen} />
        <Stack.Screen name="EditHouseProfile" component={EditHouseProfileScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="AddNewExpenditure" component={AddNewExpenditureScreen} />
        <Stack.Screen name="AddNewSelfIncome" component={AddNewSelfIncomeScreen} />
        <Stack.Screen name="BarcodeScanner" component={BarcodeScanner} />
        <Stack.Screen name="General" component={General} />
        <Stack.Screen name="ImageViewer" component={ImageViewer} options={{headerShown: false}}/>
        <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
        <Stack.Screen name="EditExpenditureScreen" component={EditExpenditureScreen} />
        <Stack.Screen name="EditSelfIncome" component={EditSelfIncomeScreen} />
        
        
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
