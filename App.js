import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View ,dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {createAppContainer} from "react-navigation"
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import SignUpScreen from './screens/SignUpScreen';
import GraphHomeScreen from './screens/GraphHomeScreen';
import EditUserProfileScreen from './screens/EditUserProfileScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CreateNewHouseScreen from './screens/CreateNewHouseScreen';
import HouseProfileScreen from './screens/HouseProfileScreen';
import EditHouseProfileScreen from './screens/EditHouseProfileScreen';
import General from './screens/General';
import AddOrEditExpenditureScreen from './screens/AddOrEditExpenditureScreen';
import AddOrEditIncomeScreen from './screens/AddOrEditIncomeScreen';
import AddOrEditSelfIncomeScreen from './screens/AddOrEditSelfIncomeScreen';
import BarcodeScanner from './components/BarcodeScanner';
import ImageViewer from './components/ImageViewer';
import { I18nManager } from 'react-native'
import UserProfileScreen from './screens/UserProfileScreen';
import EditExpenditureScreen from './screens/EditExpenditureScreen';
import EditSelfIncomeScreen from './screens/EditSelfIncomeScreen';
import LoadUserScreen from './screens/LoadUserScreen';

import * as Notifications from 'expo-notifications';
import { LogBox } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

import DrawerContent from './components/DrawerContent'
import BarMenu from './components/BarMenu';
LogBox.ignoreAllLogs(true)
// I18nManager.forceRTL(false);
// I18nManager.allowRTL(false);
// I18nManager.swapLeftAndRightInRTL(false);

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator()

export default function App() {
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  
  React.useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.notification.request.content.data['someDataToCheck'] &&
      lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      // navigate to your desired screen
    }
  }, [lastNotificationResponse]);

  const HomeStackScreen = ({navigation}) => {
    return <Stack.Navigator  screenOptions={{headerShown:false,}}>
      <Stack.Screen name="LoadUserScreen" component={LoadUserScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="EditUserProfile" component={EditUserProfileScreen} options={{ title: 'Edit User Profile'}}/>
      <Stack.Screen name="CreateNewHouse" component={CreateNewHouseScreen} options={{ title: 'Create New House Screen'}}/>
      <Stack.Screen name="HouseProfile" component={HouseProfileScreen} options={{ title: 'House Profile Screen'}}/>
      <Stack.Screen name="EditHouseProfile" component={EditHouseProfileScreen} options={{ title: 'Edit House Profile Screen'}}/>
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Forgot Password Screen'}}/>
      <Stack.Screen name="AddOrEditExpenditure" component={AddOrEditExpenditureScreen} options={{ title: 'Add New Expenditure Screen'}}/>
      <Stack.Screen name="AddOrEditIncome" component={AddOrEditIncomeScreen} options={{ title: 'Add Or Edit Income Screen'}}/>
      <Stack.Screen name="AddOrEditSelfIncome" component={AddOrEditSelfIncomeScreen} options={{ title: 'Add New Self Income Screen'}}/>
      <Stack.Screen name="BarcodeScanner" component={BarcodeScanner} options={{ title:'Barcode Scanner'}}/>
      <Stack.Screen name="Sidebar" component={General} />
      <Stack.Screen name="ImageViewer" component={ImageViewer} options={{headerShown: false}} />
      <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} options={{ title: 'User Profile Screen'}}/>
      <Stack.Screen name="EditExpenditureScreen" component={EditExpenditureScreen} options={{ title: 'Edit Expenditure Screen'}}/>
      <Stack.Screen name="EditSelfIncome" component={EditSelfIncomeScreen} options={{ title: 'Edit SelfIncome Screen'}}/>
      <Stack.Screen name="GraphScreen" component={GraphHomeScreen} options={{ title: 'Graph Home Screen'}}/>
    </Stack.Navigator>
  }
  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={props => <DrawerContent {...props}/>} screenOptions={{
      // headerLeft: ()=>{
      //   <Icon.Button name="menu" size={25} backgroundColor="#0779ef" onPress={() => navigation.OpenDrawer()} />
      // },
      headerStyle:{
        backgroundColor: '#0779ef',
      },
      headerTitleAlign: 'center',    
      headerTintColor:'#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      }
    }}>
        <Drawer.Screen name={"Home"} component={HomeStackScreen} />
      </Drawer.Navigator>
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
