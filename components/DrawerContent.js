import { StyleSheet, TouchableOpacity, View, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { 
  Avatar,
  Title,
  Caption,
  Drawer,
  Text,
  TouchableRipple,
  Switch
} from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import * as firebase from '../firebase'
import { useNavigation } from '@react-navigation/native';
import { signOut } from '@firebase/auth'
import UserHousesListView from './UserHousesListView'
import { StackActions } from '@react-navigation/native';
import { deviceHeight } from '../SIZES'
import Toast from 'react-native-toast-message';

const DrawerContent = (props) => {
  const [user, setUser] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isWithTips, setIsWithTips] = useState(false);
  const [showHouses, setShowHouses] = useState(false);
  const navigation = useNavigation()

  useEffect(() => {
    firebase.getByDocIdFromFirestore("users", firebase.auth.currentUser?.email).then( (us) => { 
      setUser(us); 
      firebase.getByDocIdFromFirestore('users',us.email).then( user => 'isGetTips' in user && setIsWithTips(user.isGetTips))
    })    // before opening the page
  }, [firebase.auth.currentUser?.email])

  const handleSignOut = () => {
    signOut(firebase.auth)
    .then(() => {
      setUser(false)
      navigation.dispatch(StackActions.replace("Login"))
    })
    .catch(error => alert(error.message)
    );
}

const toggleTheme = () => {
  setIsDarkTheme(!isDarkTheme)
}

const toggleTips = () => {
  if(!isWithTips) 
    Toast .show({
      type: 'success',
      text1: 'Tips,',
      text2: "Get tips for managing your\nhome economy once a day!" ,
      })
  firebase.updateCollectAtFirestore("users", user.email, 'isGetTips', !isWithTips)
  setIsWithTips(!isWithTips)
}
  return (
    <View style={{flex:1,}}>
      { user && 
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
          {user?.fName &&
            <View style={{flexDirection:'row',marginTop:15}}>
              <Avatar.Image 
                source={{
                  uri: user.uImage
                }}
              />
              <View  style={{marginLeft:15,flexDirection:'column'}}>
                <Title style={styles.title}>{user.fName + " " + user.lName}</Title>
                <Caption  style={styles.caption}>{user.email}</Caption>
              </View>
            </View>
          }
          </View>

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem 
              icon={({color,size}) => (
                <Icon 
                  name='home-outline'
                  color={color}
                  size={size}
                />
              )}
              label="Houses"
              onPress={() => {setShowHouses(!showHouses)}}
            />
            {user && showHouses &&
            <>
              <View style={{marginLeft:40 }}>
                  <UserHousesListView user={user} viewImage={false} withDetails={false}/>
                    <TouchableOpacity
                          onPress={() => {
                            navigation.navigate("CreateNewHouse",user)
                        }}
                          style={styles.button}
                          email = {user["email"]}
                          >
                          <Text style={styles.buttonText}>Create New House</Text>
                  </TouchableOpacity>
                </View>
                <Drawer.Section />
              </>
              }
            <DrawerItem 
              icon={({color,size}) => (
                <Icon 
                  name='account-outline'
                  color={color}
                  size={size}
                />
              )}
              label="Profile"
              onPress={() => {navigation.dispatch(StackActions.replace('UserProfileScreen'))}}
            />
            {/* <DrawerItem 
              icon={({color,size}) => (
                <Icon 
                  name='bookmark-outline'
                  color={color}
                  size={size}
                />
              )}
              label="Bookmark"
              onPress={() => {}}
            />
            <DrawerItem 
              icon={({color,size}) => (
                <Icon 
                  name='chart-bar'
                  color={color}
                  size={size}
                />
              )}
              label="Graphs"
              onPress={() => {}}
            />
            <DrawerItem 
              icon={({color,size}) => (
                <Icon 
                  name='cog-outline'
                  color={color}
                  size={size}
                />
              )}
              label="Settings"
              onPress={() => {}}
            /> */}
            <DrawerItem 
              icon={({color,size}) => (
                <Icon 
                  name='calculator'
                  color={color}
                  size={size}
                />
              )}
              label="Currency Converter"
              onPress={() => {navigation.dispatch(StackActions.replace("CurrencyConverter"))}}
            />
            <DrawerItem 
              icon={({color,size}) => (
                <Icon 
                  name='account-check-outline'
                  color={color}
                  size={size}
                />
              )}
              label="Support"
              onPress={() => {navigation.dispatch(StackActions.replace("Support"))}}
            />
          </Drawer.Section>
          <Drawer.Section title='Preferences'>
                {/* <TouchableRipple onPress={()=>{toggleTheme()}}>
                  <View style={styles.preference}>
                    <Text>Dark Theme</Text>
                    <View pointerEvents='none'>
                      <Switch value={isDarkTheme}/>
                    </View>
                  </View>
                </TouchableRipple> */}

                <TouchableRipple onPress={()=>{toggleTips()}}>
                  <View style={styles.preference}>
                    <Text>Tips</Text>
                    <View pointerEvents='none'>
                      <Switch value={isWithTips}/>
                    </View>
                  </View>
                </TouchableRipple>
          </Drawer.Section>
          <View style={styles.toastContainer}>
            <Toast  position='bottom'/>
          </View>
        </View>
      </DrawerContentScrollView>}
      { user ? <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem 
          icon={({color,size}) => (
            <Icon 
              name='exit-to-app'
              color={color}
              size={size}
            />
          )}
          label="Sign Out"
          onPress={() => {handleSignOut()}}
        />
      </Drawer.Section> :
      <Drawer.Section style={[styles.bottomDrawerSection, { top: deviceHeight-deviceHeight*0.07 } ]} title="Please login first"/>}
    </View>
  )
}

export default DrawerContent

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
      marginBottom: 15,
      borderTopColor: '#f4f4f4',
      borderTopWidth: 1
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 16,
  },
  toastContainer: {
    alignItems: 'center',
    height: 70,
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '80%',
    padding: 7,
    borderRadius: 100,
    alignItems: 'center',
    marginVertical: 25,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'center',
    alignSelf:'center'
  },
});