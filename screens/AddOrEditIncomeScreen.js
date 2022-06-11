import React, { useEffect, useState, useRef } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Text, View,Image,ScrollView, TouchableOpacity, Picker, LogBox, Modal, Alert, Platform} from 'react-native';
import * as firebase from '../firebase'
import * as cloudinary from '../Cloudinary'
import Input from '../components/Inputs';
import { styles, houseProfileStyles, docImageUploaderStyles,modelContent, TodoSheet } from '../styleSheet'
import * as ImagePicker from 'expo-image-picker';
import UploadDocumentImage from '../components/UploadDocumentImage';
import { ListItem, Avatar } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale'; 
import { Divider } from 'react-native-elements/dist/divider/Divider';
import { color } from 'react-native-reanimated';
import UploadProfileImage from '../components/UploadProfileImage';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons ,Entypo,FontAwesome,AntDesign ,FontAwesome5} from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import CustomNotifications from '../CustomNotifications'
import { async } from '@firebase/util';
import SeperatorSwitch from '../components/SeperatorSwitch';
import { deviceWidth } from '../SIZES';
import { Timestamp } from 'firebase/firestore';
// import * as CustomNotificationsFuncs from '../CustomNotifications'
LogBox.ignoreAllLogs(true)

//import LinearGradient from 'react-native-linear-gradient'; // Only if no expo

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state.',
   ]);

   Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      vibrate: true
    }),
  });

const AddOrEditIncomeScreen = ({route}) => {
    const navigation = useNavigation()
    const [user, setUser] = useState([]);

    const [descOpitional, setDescriptionOpitional] = useState('');
    const [amount, setAmount] = useState('');
    const [billingType, setBillingType] = useState("Billing type");
    const [isEvent, setIsEvent] = useState(false);
    const [isWithNotification, setIsWithNotification] = useState(false);
    const [isWithCustomDate, setIsWithCustomDate] = useState(false);

    const [showMainDetails, setShowMainDetails] = useState(false);

    const [mode, setMode] = useState('');
    const [show, setShow] = useState(false);
    const [dateText, setDateText] = useState('Empty');

    const [modeNotification, setModeNotification] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [dateTextNotification, setDateTextNotification] = useState('Empty');

    const [modeCustomDate, setModeCustomDate] = useState('');
    const [showCustomDate, setShowCustomDate] = useState(false);
    const [customDateText, setCustomDateText] = useState('Empty');
    
    const [eventDate, setEventDate] = useState('');
    const [notificationDate, setNotificationDate] = useState('');
    const [customDate, setCustomDate] = useState('');
    
    const income = route.params?.income;
    const hKey = route.params?.hKey;
    const [house, setHouse] = useState('');

    

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    const [notifications, setNotifications] = useState([]);

  
    useEffect(() => {
      registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
  
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });
  
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });
  
      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }, []);

    useEffect(() => {
        firebase.getByDocIdFromFirestore("users", firebase.auth.currentUser?.email).then( (us) => { setUser(us)} )    // before opening the page

        firebase.getByDocIdFromFirestore("houses",hKey).then((house)=> {setHouse(house); }).catch((e) =>{})
  
        if("income" in route.params){
            setBillingType(income.billingType)
            setAmount(income.amount)
            setDescriptionOpitional(income.descOpitional)
            setIsEvent(income.isEvent)
            if(income.isEvent)
                updateEventDateText(income.eventDate)
            if("notifications" in income && income.notifications.length != 0){
                setIsWithNotification(true)
                setNotifications(income.notifications)
                setDateTextNotification(income.notifications[0].dateText)
            if("isWithCustomDate" in income && income.isWithCustomDate){
              setIsWithCustomDate(true)
              setCustomDate(income.date)
              setCustomDateText(income.customDateText)
            }
        }
      }
    }, [])

    useEffect(() => {
        if(mode == 'date' && Platform.OS !== 'ios') showMode('time')
      }, [eventDate])

    useEffect(() => {
      if(modeNotification == 'date' && Platform.OS !== 'ios') showModeNotification('time')
    }, [notificationDate])

    useEffect(() => {
      if(modeCustomDate == 'date' && Platform.OS !== 'ios') showModeCustomDate('time')
    }, [customDate])

    const handleCreateIncome = async() => {
        if(billingType == "Billing type") alert("Sorry, Billing type is the title... ")
        else if (isNaN(amount)) alert("Sorry, Amount should be a number !" + amount)
        else if(amount){
                notficationHandling()
                .then((tempNotifications) => {
                    firebase.addIncomeToHouse(house.hName,house.cEmail,house.incomes, house.futureIncomes, {date: isWithCustomDate? customDate :(income ? income.date.toDate() : isEvent ? eventDate : new Date()),partner:user.email, amount: amount,
                       billingType: billingType, isEvent: isEvent, eventDate: eventDate, descOpitional, notifications: tempNotifications, isWithCustomDate, customDateText, isFuture: false})
                })
                navigation.goBack()
        }else alert("Sorry, you must fill in all the fields!")
    }

    const notficationHandling = async() => {
        let tempNotifications = []
        for(let i in notifications) {
            tempNotifications.push({
                identifier: await schedulePushNotification("The income event is approaching! 🕞 " + descOpitional,
                                                                    dateText,"data",new Date(notifications[i].notificationDate)), 
                dateTextNotification: notifications[i].dateTextNotification, 
                notificationDate: notifications[i].notificationDate
            })
        }
        return tempNotifications
    }

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || eventDate;
        setShow(Platform.OS === 'ios')
        setEventDate(currentDate)
        let tempDate = new Date(currentDate)
        let fDate = firebase.getStrDateAndTimeToViewFromSrtDate(tempDate).replace('.','/').replace('.','/').substring(0,10)
        let minutes = tempDate.getMinutes()
        if(parseInt(minutes) < 10)
            minutes = "0" + minutes
        let hours = tempDate.getHours()
        if(parseInt(hours) < 10)
            hours = "0" + hours
        let fTime =  hours + ":" + minutes
        setDateText(fTime + '  |  ' + fDate)
    }

    const showMode = (currentMode) => {
        setShow(true)
        setMode(currentMode)
      }

      const onDateChangeNotification = (event, selectedDate) => {
        const currentDate = selectedDate || notificationDate;
        setShowNotification(Platform.OS === 'ios')
        try{
          currentDate.setSeconds(0)
        }catch{}
        setNotificationDate(currentDate)
        let tempDate = new Date(currentDate)
        let fDate = firebase.getStrDateAndTimeToViewFromSrtDate(tempDate).replace('.','/').replace('.','/').substring(0,10)
        let minutes = tempDate.getMinutes()
        if(parseInt(minutes) < 10)
            minutes = "0" + minutes
        let hours = tempDate.getHours()
        if(parseInt(hours) < 10)
            hours = "0" + hours
        let fTime =  hours + ":" + minutes
        setDateTextNotification(fTime + '  |  ' + fDate)
        setNotifications([...notifications, {dateTextNotification: fTime + '  |  ' + fDate, notificationDate: currentDate}])
    }

    const showModeNotification = (currentMode) => {
        setShowNotification(true)
        setModeNotification(currentMode)
      }

      const onDateChangeCustomDate = (event, selectedDate) => {
        const currentDate = selectedDate || customDate;
        setShowCustomDate(Platform.OS === 'ios')
        setCustomDate(currentDate)
        let tempDate = new Date(currentDate)
        let fDate = firebase.getStrDateAndTimeToViewFromSrtDate(tempDate).replace('.','/').replace('.','/').substring(0,10)
        let minutes = tempDate.getMinutes()
        if(parseInt(minutes) < 10)
            minutes = "0" + minutes
        let hours = tempDate.getHours()
        if(parseInt(hours) < 10)
            hours = "0" + hours
        let fTime =  hours + ":" + minutes
        setCustomDateText(fTime + '  |  ' + fDate)
    }

    const showModeCustomDate= (currentMode) => {
      setShowCustomDate(true)
      setModeCustomDate(currentMode)
    }

    const updateEventDateText = (selectedDate) => {
      const currentDate = selectedDate || eventDate;
      let tempDate
      try{
        setEventDate(currentDate.toDate())
        tempDate = new Date(currentDate.toDate())
      }catch{
        setEventDate(new Timestamp(currentDate.seconds, currentDate.nanoseconds).toDate())
        tempDate = new Date(new Timestamp(currentDate.seconds, currentDate.nanoseconds).toDate())
      }
      let fDate = firebase.getStrDateAndTimeToViewFromSrtDate(tempDate).replace('.','/').replace('.','/').substring(0,10)
      let minutes = tempDate.getMinutes()
      if(parseInt(minutes) < 10)
          minutes = "0" + minutes
      let hours = tempDate.getHours()
      if(parseInt(hours) < 10)
          hours = "0" + hours
      let fTime =  hours + ":" + minutes
      setDateText(fDate + '  |  ' + fTime)
  }
      const handleDeleteIncome = () => {
        Alert.alert(
            "Are your sure?",
            "Are you sure you want to remove this income?",
            [
              // The "Yes" button
              {
                text: "Yes",
                onPress: () => {
                    if(income.billingType !== "One-time"){
                      Alert.alert(
                      "This income is defined as an income that will recur in the future.",
                      "would you like to delete future incomes as well? ?",
                      [
                          // The "Yes" button
                          {
                          text: "Yes",
                          onPress: () => {
                              firebase.removeIncomeFromHouse(house.hName,house.cEmail,house.incomes,income, house.futureIncomes, true).then(navigation.goBack())
                          },
                          },
                          // The "No" button
                          // Does nothing but dismiss the dialog when tapped
                          {
                          text: "No",
                          onPress: () => {
                            firebase.removeIncomeFromHouse(house.hName,house.cEmail,house.incomes,income, house.futureIncomes, false).then(navigation.goBack())
                          },
                          },
                      ]
                      );
                  }
                  else firebase.removeIncomeFromHouse(house.hName,house.cEmail,house.incomes,income, house.futureIncomes, false).then(navigation.goBack())
                },
              },
              // The "No" button
              // Does nothing but dismiss the dialog when tapped
              {
                text: "No",
              },
            ]
          );
    }
    return (
        <ScrollView style={{backgroundColor: 'white'}}>
            {income &&
            <View style={TodoSheet.trash}>
                <TouchableOpacity style={{margin:25} } onPress={handleDeleteIncome} >
                    <Icon name="trash"  type="ionicon" size={22}/>
                </TouchableOpacity>
            </View>}
            <View style={[styles.container]}>
                {income?
                <Text style={[styles.textTitle, {marginBottom:20}]}>Edit New Income</Text> 
                :<Text style={[styles.textTitle, {marginBottom:20}]}>Add New Income</Text> }
                <SeperatorSwitch isExpended={showMainDetails} setIsExpended={setShowMainDetails} title="Main Details *" bottomDevider={!showMainDetails} 
                  titleColor={ (amount && billingType != "Billing type") ? "green" : "red" }/>

            { showMainDetails &&
                <>
                  <Input name="Amount" icon="money" value={amount?amount:""} onChangeText={text => setAmount(text)} keyboardType="decimal-pad" />
                  <Input name="Description" icon="file-text" value={descOpitional?descOpitional:""} onChangeText={text => {setDescriptionOpitional(text); }} />

                  <View style={{ width: "55%",marginTop:70,alignItems:'center', marginLeft:10,marginRight:10,marginBottom:25,borderRadius:10,borderColor:'lightgrey', borderWidth:2}}>
                      <Picker
                          selectedValue={billingType}
                          style={{width: "100%",}}
                          onValueChange={(billingType, itemIndex) => { setBillingType(billingType) }}
                      >
                          <Picker.Item label="       - Billing type -" value="Billing type"/>
                          <Picker.Item label="       One-time" value="One-time"/>
                          <Picker.Item label="       Weekly" value="Weekly"/>
                          <Picker.Item label="       Fortnightly" value="Fortnightly"/>
                          <Picker.Item label="       Monthly" value="Monthly" />
                          <Picker.Item label="       Bi-monthly" value="Bi-monthly" />
                          <Picker.Item label="       Annual" value="Annual" />
                          <Picker.Item label="       Biennial" value="Biennial" />
                      </Picker>
                  </View>
                </>
                }
                { !isWithCustomDate && <View style={isEvent?{ width: "95%",alignItems:'center',borderRadius:10,borderColor:'lightgrey', borderBottomWidth: 1 ,  borderTopWidth: isEvent && showMainDetails || showMainDetails ? 1 : 0}:{}}>
                    <SeperatorSwitch isExpended={isEvent} setIsExpended={setIsEvent} title="Set as event" withCheckIcon={true} />
                    { isEvent &&
                    <>
                        <View style={styles.dateInputButton}>
                            <Icon name={'calendar'} size={22}
                                        color={show? '#0779e4':'grey'} style={{marginLeft:10}} />
                            <TouchableOpacity
                                    title="Birth Date"
                                    onPress={ () => showMode('date')}
                                    style={{ textAlign:'left', flex:1}}
                                    >
                                <Text style={{fontSize:18, fontWeight:'bold',marginHorizontal:10, marginVertical:10, textAlign:'left', flex:1,color:eventDate?'black':'grey' }}>{eventDate? dateText : "Event Date"}</Text> 
                            </TouchableOpacity>
                        </View>
                        {show &&
                                (<>
                                  <DateTimePicker 
                                    testID='dateTimePickeer'
                                    value = {eventDate? eventDate: new Date()}
                                    mode = {mode}
                                    is24Hour = {true}
                                    onChange={ onDateChange }
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    style={{width:deviceWidth}}
                                  />
                                  { Platform.OS ==='ios' && eventDate !=='' && <View style={[styles.container,{marginTop: 5}]}>
                                          <View style={styles.buttonContainer}>
                                              <TouchableOpacity
                                                  title={eventDate && mode==='date' ? "Set time" : "Set Date"}
                                                  onPress={ () => setMode(mode==='date' ? "time" : "date")}
                                                  style={styles.button}
                                                  >
                                                  <Text style={styles.buttonText}>{eventDate && mode==='date' ? "Set time" : "Set Date"}</Text>
                                              </TouchableOpacity>
                                          </View>
                                      </View>}
                                  </>)
                            }
                        { dateText != 'Empty' &&
                          <SeperatorSwitch isExpended={isWithNotification} setIsExpended={setIsWithNotification} title="Set notification" topDevider={true} width="85%" withCheckIcon={true}/>
                        }
                        { isWithNotification && 
                        <>
                        <View style={styles.dateInputButton}>
                            <Icon name={'calendar'} size={22}
                                        color={show? '#0779e4':'grey'} style={{marginLeft:10}}/>
                            <TouchableOpacity
                                    title="Notification Date"
                                    onPress={ () => {showModeNotification('date'); }}
                                    style={{ textAlign:'left', flex:1}}
                                    >
                                <Text style={{fontSize:18, fontWeight:'bold',marginHorizontal:10, marginVertical:10, textAlign:'left', flex:1,color:notificationDate?'black':'grey' }}>{notificationDate? (eventDate && notificationDate<eventDate? dateTextNotification:dateText): (eventDate? dateText : "Notification Date")}</Text> 
                            </TouchableOpacity>
                        </View>
                        {
                            notifications.map((val, index) => ( 
                                <>
                                {val && "dateTextNotification" in val && <ListItem key={index} bottomDivider topDivider Component={TouchableScale}
                                friction={90} //
                                tension={100} // These props are passed to the parent component (here TouchableScale)
                                activeScale={1}
                                onPress={() => {  }}
                                >
                                  <TouchableOpacity  style={docImageUploaderStyles.removeBtn} onPress={() => {let temp = [...notifications]; delete temp[index]; setNotifications(temp);}} >
                                      <AntDesign name="close" size={15} color="black" />
                                </TouchableOpacity> 
                                    <Text>{val.dateTextNotification}</Text>
                                    <ListItem.Content>
                                        <Text style={[styles.listTextItem,{alignSelf:'center'}]} >{}</Text>
                                    </ListItem.Content>
                                    <AntDesign name="clockcircleo" size={17} color="black" />

                                </ListItem>}
                                </>
                            ))
                        }
                    </>
                    }
                </>
                }
                </View>
              }
                { !isEvent && 
                    <View style={{ width: "95%",alignItems:'center',borderRadius:10,borderColor:'lightgrey', borderBottomWidth: 1 ,  borderTopWidth: !isWithCustomDate ? 1: 0}}>
                      <SeperatorSwitch isExpended={isWithCustomDate} setIsExpended={setIsWithCustomDate} title="Set retroactive income" withCheckIcon={true} />

                      {isWithCustomDate && 
                        <View style={styles.dateInputButton}>
                          <Icon name={'calendar'} size={22}
                                      color={show? '#0779e4':'grey'} style={{marginLeft:10}}/>
                          <TouchableOpacity
                                  title="Custom Date"
                                  onPress={ () => {showModeCustomDate('date'); }}
                                  style={{ textAlign:'left', flex:1}}
                                  >
                              <Text style={{fontSize:18, fontWeight:'bold',marginHorizontal:10, marginVertical:10, textAlign:'left', flex:1,color:customDate?'black':'grey' }}>
                                {customDate? customDateText : "Custom Date"}</Text> 
                          </TouchableOpacity>
                        </View>
                        }
                    </View>
                }
                {showNotification &&
                    (<>
                      <DateTimePicker 
                        testID='dateTimePickeerNotification'
                        value = {notificationDate? (eventDate && notificationDate<eventDate? notificationDate: (eventDate?eventDate: new Date())) : (eventDate? eventDate: new Date())}
                        mode = {modeNotification}
                        is24Hour = {true}
                        onChange={ onDateChangeNotification }
                        maximumDate={eventDate? eventDate:new Date()}
                        minimumDate={new Date()}
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        style={{width:deviceWidth}}
                        />
                      { Platform.OS ==='ios' && notificationDate !=='' && <View style={[styles.container,{marginTop: 5}]}>
                          <View style={styles.buttonContainer}>
                              <TouchableOpacity
                                  title={notificationDate && modeNotification==='date' ? "Set time" : "Set Date"}
                                  onPress={ () => setModeNotification( modeNotification==='date' ? "time" : "date")}
                                  style={styles.button}
                                  >
                                  <Text style={styles.buttonText}>{notificationDate && modeNotification==='date' ? "Set time" : "Set Date"}</Text>
                              </TouchableOpacity>
                          </View>
                      </View>}
                    </>)
                }
                
                {showCustomDate &&
                    (<>
                    <DateTimePicker 
                        testID='dateTimePickeerCustomDate'
                        value = {customDate? customDate: new Date()}
                        mode = {modeCustomDate}
                        is24Hour = {true}
                        onChange={ onDateChangeCustomDate }
                        maximumDate={new Date()}
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        style={{width:deviceWidth}}
                    />
                    { Platform.OS ==='ios' && customDate !=='' && <View style={[styles.container,{marginTop: 5}]}>
                      <View style={styles.buttonContainer}>
                          <TouchableOpacity
                              title={customDate && modeCustomDate==='date' ? "Set time" : "Set Date"}
                              onPress={ () => setModeCustomDate(modeCustomDate==='date' ? "time" : "date")}
                              style={styles.button}
                              >
                              <Text style={styles.buttonText}>{customDate && modeCustomDate==='date' ? "Set time" : "Set Date"}</Text>
                          </TouchableOpacity>
                      </View>
                  </View>}
                  </>)
                }
                </View>
            <View style={[styles.container,{marginTop: 5}]}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        title="Create"
                        onPress={handleCreateIncome}
                        style={styles.button}
                        >
                        {income ?
                            <Text style={styles.buttonText}>Update</Text>:
                            <Text style={styles.buttonText}>Create</Text>
                        }                    
                        </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}


async function schedulePushNotification(title,body,data,trigger) {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: { data: 'goes here' },
      },
    trigger
    //   trigger: { seconds: 2 },
    });
  }
  
  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }



export default AddOrEditIncomeScreen
