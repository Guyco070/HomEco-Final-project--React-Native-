import React, { useEffect, useState,useRef } from 'react'
import { Animated, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// Tab ICons...
import home from '../assets/home.png';
import search from '../assets/search.png';
import notifications from '../assets/bell.png';
import settings from '../assets/settings.png';
import logout from '../assets/logout.png';
// Menu
import menu from '../assets/menu.png';
import close from '../assets/close.png';
// Photo
import * as firebase from '../firebase'
import { styles } from '../styleSheet'
import { signOut,auth } from '@firebase/auth'
import UserHousesListView from '../components/UserHousesListView'
import readProductsFromEXCL, * as s from "../barcodeScripts/productsFileScript.js"
import SheetJSApp from '../barcodeScripts/productsFileScript.js';
import TodoList from '../components/TodoList/TodoList';
import Loading from '../components/Loading';
import ShoppingApi from '../barcodeScripts/ShoppingApi';
import * as shufersal from '../barcodeScripts/ShufersalScraping';



export default function App() {
  const [currentTab, setCurrentTab] = useState("Home");
  // To get the curretn Status of menu ...
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);


  

  // Animated Properties...

  const offsetValue = useRef(new Animated.Value(0)).current;
  // Scale Intially must be One...
  const scaleValue = useRef(new Animated.Value(1)).current;
  const closeButtonOffset = useRef(new Animated.Value(0)).current;

  
useEffect(() => {
  console.log(firebase.auth.currentUser?.email)
  firebase.getByDocIdFromFirestore("users", firebase.auth.currentUser?.email).then( (us) => { setUser(us); })    // before opening the page

}, [])

useEffect(() => {
  if(user['email'] != undefined)
      setLoading(false); 
}, [user])
const createNewHouseScreen = () => {
  navigation.navigate("CreateNewHouse",user)
}
const SideBar = () => {
  navigation.navigate("Sidebar",user)
}

const handleSignOut = () => {
  signOut(firebase.auth)
  .then(() => {
      console.log("Logout")
      navigation.replace("Login")
  })
  .catch(error => alert(error.message)
  );
}

  return (
    <SafeAreaView style={styless.container}>

      <View style={{ justifyContent: 'flex-start', padding: 15 }}>
        <Image source={user.uImage} style={{
          width: 60,
          height: 60,
          borderRadius: 10,
          marginTop: 8
        }}></Image>

        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: 'white',
          marginTop: 20
        }}>{user.fName +" "+ user.lName}</Text>

        <TouchableOpacity>
          <Text style={{
            marginTop: 6,
            color: 'white'
          }}>View Profile</Text>
        </TouchableOpacity>

        <View style={{ flexGrow: 1, marginTop: 50 }}>
          {
            // Tab Bar Buttons....
          }

          {TabButton(currentTab, setCurrentTab, "Home", home,navigation)}
          {TabButton(currentTab, setCurrentTab, "Search", search,navigation)}
          {TabButton(currentTab, setCurrentTab, "Notifications", notifications,navigation)}
          {TabButton(currentTab, setCurrentTab, "Settings", settings,navigation)}

        </View>

        <View>
          {TabButton(currentTab, setCurrentTab, "LogOut", logout,navigation)}
        </View>

      </View>

      {
        // Over lay View...
      }

      <Animated.View style={{
        flexGrow: 1,
        backgroundColor: 'white',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 15,
        paddingVertical: 20,
        borderRadius: showMenu ? 15 : 0,
        // Transforming View...
        transform: [
          { scale: scaleValue },
          { translateX: offsetValue }
        ]
      }}>

        {
          // Menu Button...
        }

        <Animated.View style={{
          transform: [{
            translateY: closeButtonOffset
          }]
        }}>
          <TouchableOpacity onPress={() => {
            // Do Actions Here....
            // Scaling the view...
            Animated.timing(scaleValue, {
              toValue: showMenu ? 1 : 0.88,
              duration: 300,
              useNativeDriver: true
            })
              .start()

            Animated.timing(offsetValue, {
              // YOur Random Value...
              toValue: showMenu ? 0 : 230,
              duration: 300,
              useNativeDriver: true
            })
              .start()

            Animated.timing(closeButtonOffset, {
              // YOur Random Value...
              toValue: !showMenu ? -30 : 0,
              duration: 300,
              useNativeDriver: true
            })
              .start()

            setShowMenu(!showMenu);
          }}>

            <Image source={showMenu ? close : menu} style={{
              width: 20,
              height: 20,
              tintColor: 'black',
              marginTop: 40,

            }}></Image>

          </TouchableOpacity>
          <Text style={{
            fontSize: 30,
            fontWeight: 'bold',
            color: 'black',
            paddingTop: 20
          }}>{currentTab}</Text>
          {
            <View style={[styles.container]}>
              {loading ?    <Loading/>:<><Text style={styles.textBody}>{ user["fName"] == undefined? "" : user["fName"]+ " " + user["lName"] } </Text>
              <Text style={styles.textBody}>{user["fName"] == undefined? "" : "Email: " + user["email"] } </Text>
              <UserHousesListView user={user}/>
               {/*uploade products drom excel*/ }
              {/* <SheetJSApp/> */}
              {/* <ShoppingApi/> */}
              <TouchableOpacity
                      onPress={() => shufersal.getDescriptionByUPC("7290010066582") }
                      style={styles.button}
                      email = {user["email"]}
                      >
                      <Text style={styles.buttonText}>Shufersal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                      onPress={createNewHouseScreen}
                      style={styles.button}
                      email = {user["email"]}
                      >
                      <Text style={styles.buttonText}>Createddddddddddddddddddddddddd New House</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText} onPress={SideBar} >Go To Side Bar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText} onPress={handleSignOut} >Sign out</Text>
              </TouchableOpacity></>}
  
  
            </View>
          }
            
        </Animated.View>

      </Animated.View>

    </SafeAreaView>
  );
}
const handleSignOut = () => {
  signOut(firebase.auth)
  .then(() => {
      console.log("Logout")
      navigation.replace("Login")
  })
  .catch(error => alert(error.message)
  );
}
// For multiple Buttons...
const TabButton = (currentTab, setCurrentTab, title, image,navigation) => {
  return (
    
    <TouchableOpacity onPress={() => {

      if (title == "LogOut") {
        {handleSignOut}
      } else {
        navigation.navigate('Home')
        setCurrentTab(title)
      }
    }}>
      <View style={{
        flexDirection: "row",
        alignItems: 'center',
        paddingVertical: 8,
        backgroundColor: currentTab == title ? 'white' : 'transparent',
        paddingLeft: 13,
        paddingRight: 35,
        borderRadius: 8,
        marginTop: 15
      }}>

        <Image source={image} style={{
          width: 25, height: 25,
          tintColor: currentTab == title ? "#5359D1" : "white"
        }}></Image>

        <Text style={{
          fontSize: 15,
          fontWeight: 'bold',
          paddingLeft: 15,
          color: currentTab == title ? "#5359D1" : "white"
        }}>{title}</Text>

      </View>
    </TouchableOpacity>
  );
}

const styless = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0782F9',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});