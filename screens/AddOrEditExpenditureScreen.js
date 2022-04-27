import React, { useEffect, useState, useRef } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Text, View,Image,ScrollView, TouchableOpacity, Picker, LogBox, Modal, Alert} from 'react-native';
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
import { Icon } from 'react-native-elements'
import { Ionicons ,Entypo,FontAwesome,AntDesign ,FontAwesome5, MaterialCommunityIcons} from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import CustomNotifications from '../CustomNotifications'
import { async } from '@firebase/util';
import Loading from '../components/Loading';
import ImagePickerModal from '../components/ImagePickerModal';
import { Colors } from '../Colors';

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

const AddOrEditExpenditureScreen = ({route}) => {
    const navigation = useNavigation()
    const [user, setUser] = useState([]);
    const [modalOpen, setModalOpen] = useState(false)
    const [catchInvoImages, setInvoCatchImage] = useState([]);
    const [catchContractImages, setContractCatchImage] = useState([]);
    const [hImage, setImage] = useState('');

    const [imageModalPickerVisable, setImageModalPickerVisable] = useState(false);

    const [company, setCompany] = useState('');
    const [desc, setDescription] = useState('Type');
    const [descOpitional, setDescriptionOpitional] = useState('');
    const [descIcon, setDescriptionIcon] = useState('timer-sand-empty');
    const [amount, setAmount] = useState('');
    const [billingType, setBillingType] = useState("Billing type");
    const [payments, setPayments] = useState("");
    const [totalPayments, setTotalPayments] = useState("");

    const [isEvent, setIsEvent] = useState(false);
    const [isWithNotification, setIsWithNotification] = useState(false);
    const [isWithCustomDate, setIsWithCustomDate] = useState(false);

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

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const [invoiceImageLoading, setInvoiceImageLoading] = useState(false);
    const [contractImageLoading, setContractImageLoading] = useState(false);

    const notificationListener = useRef();
    const responseListener = useRef();

    const [notifications, setNotifications] = useState([]);
    const [notificationsToRemove, setNotificationsToRemove] = useState([]);

    const [indexOfImage, setIndexOfImage] = useState(-2);
    const [fromToImagePicker, setFromToImagePicker] = useState("");

    const [house, setHouse] = useState('');
    const exp = route.params?.exp;
    const hKey = route.params?.hKey;


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
        if(hKey)
            firebase.getByDocIdFromFirestore("houses",hKey).then((house)=> {setHouse(house); }).catch((e) =>{})
        if(exp){
            setInvoCatchImage(exp.invoices)
            setContractCatchImage(exp.contracts)
            setBillingType(exp.billingType)
            setCompany(exp.company)
            setDescription(exp.desc)
            setDescriptionIcon(exp.descIcon)
            setAmount(exp.amount)
            setDescriptionOpitional(exp.descOpitional)
            setIsEvent(exp.isEvent)
            setPayments(exp.payments)
            setTotalPayments(exp.totalPayments)
            if(exp.isEvent)
                updateEventDateText(exp.eventDate)
            if("notifications" in exp && exp.notifications.length != 0){
                setIsWithNotification(true)
                setNotifications(exp.notifications)
                setDateTextNotification(exp.notifications[0].dateText)
            }
            if("isWithCustomDate" in exp) {setIsWithCustomDate(exp.isWithCustomDate); setCustomDate(exp.date.toDate()); setCustomDateText(exp.customDateText)}
        }
      }, [])

      useEffect(() => {
        if(indexOfImage !== -2 && fromToImagePicker != '')
            setImageModalPickerVisable(true)
      }, [indexOfImage,fromToImagePicker])

      useEffect(() => {
      if(!imageModalPickerVisable && indexOfImage !== -2){ setIndexOfImage(-2); setFromToImagePicker('')}
    }, [imageModalPickerVisable])

    useEffect(() => {
        if(descOpitional!=''){
            firebase.getExpenditureTypeAutoByOptionalDescription(descOpitional).then((type) => {
                if(type && type != '')
                    setDescription(type)
            })
        }else{
            firebase.getExpenditureTypeAutoByCompany(company).then((type) => {
                if(type && type != '')
                    setDescription(type)
            })
        }
      }, [descOpitional])
    
      useEffect(() => {
        if(descOpitional!=''){
            firebase.getExpenditureTypeAutoByOptionalDescription(descOpitional).then((type) => {
                if(type && type != '')
                    setDescription(type)
                else{
                    firebase.getExpenditureTypeAutoByCompany(company).then((type) => {
                        if(type && type != '')
                            setDescription(type)
                    })
                }
            })
        }else{
            firebase.getExpenditureTypeAutoByCompany(company).then((type) => {
                if(type && type != '')
                    setDescription(type)
            })
        }
      }, [company])

    useEffect(() => {
        if(mode == 'date') showMode('time')
      }, [eventDate])

      useEffect(() => {
        if(modeNotification == 'date') showModeNotification('time')
      }, [notificationDate])

      useEffect(() => {
        if(modeCustomDate == 'date') showModeCustomDate('time')
      }, [customDate])

      useEffect(() => {
        setInvoiceImageLoading(false)
      }, [catchInvoImages])

      useEffect(() => {
        setContractImageLoading(false)
      }, [catchContractImages])

    const addImage = async (openWith,from,index) => {
        let _image = openWith === "camera" ? await  cloudinary.takeDocPhotoFromCamera() : await cloudinary.addDocImageFromLibrary()
          if (!_image.cancelled) {
            setImage(_image.uri);
            setImageModalPickerVisable(false)
            if(index==-1){
                if(from == 'invoice')
                {
                    setInvoiceImageLoading(true)
                    cloudinary.uploadImageToCloudinary("invoice",_image).then((url)=>{ setInvoCatchImage([...catchInvoImages, url]); }).catch((e) => alert(e.message))
                }
                else if(from == 'contract')
                {
                    setContractImageLoading(true)
                    cloudinary.uploadImageToCloudinary("contract",_image).then((url)=>{ setContractCatchImage([...catchContractImages, url]); }).catch((e) => alert(e.message))
                }
            }
            else{
                if(from == 'invoice')
                    cloudinary.uploadImageToCloudinary("invoice",_image).then((url)=>{  catchInvoImages[index] = url; setInvoCatchImage([...catchInvoImages]); }).catch((e) => alert(e.message))
                else if(from == 'contract')
                    cloudinary.uploadImageToCloudinary("contract",_image).then((url)=>{ catchContractImages[index] = url; setContractCatchImage([...catchContractImages]); }).catch((e) => alert(e.message))
            }
        }
    }

    const handleAddDescription = (desc) => {
        setModalOpen(false);
        setDescription(desc);
        };

        const onRemove = async (from,index) => {
            const tempCatchImages = []
            let i = 0
            let toChange = []
            if(from == 'invoice')
                toChange = catchInvoImages
            else if(from == 'contract')
                toChange = catchContractImages
            for(let key in toChange) {
                if(index != key) {
                    tempCatchImages[i] = toChange[key]
                }
            }
            if(from == 'invoice')
                setInvoCatchImage([...tempCatchImages])
            else if(from == 'contract')
                setContractCatchImage([...tempCatchImages])
        } 
    
    const handleCreateExpend = async() => {
        if(billingType == "Billing type") alert("Sorry, Billing type is the title... ")
        else if (isNaN(amount)) alert("Sorry, Amount should be a number !" + amount)
        else if(company && desc != "Type" && amount){
            removeNotficationHandling()
            notficationHandling().then((tempNotifications) => {
            firebase.addExpendToHouse(house.hName, house.cEmail, house.expends, house.futureExpendes, {date: isWithCustomDate? customDate : ((exp && "date" in exp) ? exp.date.toDate() : new Date()),partner:user.email,company, 
                                    desc, amount: totalPayments !== "" ? parseInt(amount)/parseInt(totalPayments) : amount, billingType, invoices: catchInvoImages, contracts: catchContractImages, isEvent,
                                        eventDate, descOpitional, notifications: tempNotifications, isWithCustomDate, customDateText, 
                                        payments: payments === "" && totalPayments !== "" ? 1 : payments, totalPayments: totalPayments,
                                        totalAmount: totalPayments !== "" ? amount : ""}).then(()=>{
                                            if(!("date" in exp)) 
                                                firebase.updateCollectAtFirestore("houses", hKey, "shoppingList", [])
                                            })
                                    })

            navigation.replace("HouseProfile",{hKeyP: hKey, menuBarIndex: 0})
        }else alert("Sorry, you must fill in all the fields!")
    }

    const notficationHandling = async() => {
        let tempNotifications = []
        for(let i in notifications) {
            if(!("identifier" in notifications[i]))
                tempNotifications.push({
                    identifier: await schedulePushNotification("The event is approaching! 🕞 " + descOpitional? descOpitional:company,
                                                                            notifications[i].dateTextNotification,"data",new Date(notifications[i].notificationDate)), 
                    dateTextNotification: notifications[i].dateTextNotification, 
                    notificationDate: notifications[i].notificationDate
                })
            else tempNotifications.push(notifications[i])
        }
        return tempNotifications
    }

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || eventDate;
        setShow(Platform.OS === 'ios')
        setEventDate(currentDate)
        let tempDate = new Date(currentDate)
        let fDate = firebase.getSrtDateAndTimeToViewFromSrtDate(tempDate).replace('.','/').replace('.','/').substring(0,10)
        let minutes = tempDate.getMinutes()
        if(parseInt(minutes) < 10)
            minutes = "0" + minutes
        let hours = tempDate.getHours()
        if(parseInt(hours) < 10)
            hours = "0" + hours
        let fTime =  hours + ":" + minutes
        setDateText(fTime + '  |  ' + fDate)
    }

    const removeNotficationHandling = async() => {
        for(let i in notificationsToRemove) {
            await Notifications.cancelScheduledNotificationAsync(notificationsToRemove[i].identifier);
        }
    }

    const handleDeleteExpenditure = () => {
        Alert.alert(
            "Are your sure?",
            "Are you sure you want to remove this beautiful box?",
            [
              // The "Yes" button
              {
                text: "Yes",
                onPress: () => {
                    firebase.removeExpendFromHouse(house.hName,house.cEmail,house.expends,exp).then(navigation.replace("HouseProfile",{hKeyP:hKey}))
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

    const updateEventDateText = (selectedDate) => {
        const currentDate = selectedDate || eventDate;
        setEventDate(currentDate.toDate())
        let tempDate = new Date(currentDate.toDate())
        let fDate = firebase.getSrtDateAndTimeToViewFromSrtDate(tempDate).replace('.','/').replace('.','/').substring(0,10)
        let minutes = tempDate.getMinutes()
        if(parseInt(minutes) < 10)
            minutes = "0" + minutes
        let hours = tempDate.getHours()
        if(parseInt(hours) < 10)
            hours = "0" + hours
        let fTime =  hours + ":" + minutes
        setDateText(fDate + '  |  ' + fTime)
    }

    const showMode = (currentMode) => {
        setShow(true)
        setMode(currentMode)
      }

      const onDateChangeNotification = (event, selectedDate) => {
        const currentDate = selectedDate || notificationDate;
        setShowNotification(Platform.OS === 'ios')
        setNotificationDate(currentDate)
        let tempDate = new Date(currentDate)
        let fDate = firebase.getSrtDateAndTimeToViewFromSrtDate(tempDate).replace('.','/').replace('.','/').substring(0,10)
        let minutes = tempDate.getMinutes()
        if(parseInt(minutes) < 10)
            minutes = "0" + minutes
        let hours = tempDate.getHours()
        if(parseInt(hours) < 10)
            hours = "0" + hours
        let fTime =  hours + ":" + minutes
        setDateTextNotification(fTime + '  |  ' + fDate)

        setNotifications([...notifications, {dateTextNotification: fTime + '  |  ' + fDate, notificationDate: notificationDate.setSeconds(0)}])
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
        let fDate = firebase.getSrtDateAndTimeToViewFromSrtDate(tempDate).replace('.','/').replace('.','/').substring(0,10)
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

    return (
        <ScrollView style={{backgroundColor: 'white'}}>
            {/* <UploadProfileImage tempImage = {require('../assets/add_house.png')} image = {hImage} onPress={addImage} changeable={true}/> */}
            {imageModalPickerVisable && <ImagePickerModal imageModalPickerVisable={imageModalPickerVisable} setImageModalPickerVisable={setImageModalPickerVisable} addImage={addImage} index={indexOfImage} from={fromToImagePicker}/> }

            {(exp && "date" in exp) &&
            <View style={TodoSheet.trash}>
                <TouchableOpacity style={{margin:25} } onPress={handleDeleteExpenditure} >
                    <Icon name="trash"  type="ionicon" size={22}/>
                </TouchableOpacity>
            </View>}

            <View style={[styles.container,{backgroundColor: modalOpen?'rgba(52, 52, 52, 0.8)':'white'}]}>
            {/* <View style={[styles.container, {marginTop:200,marginHorizontal:15}]}> */}
                { !exp ? <Text style={[styles.textTitle, {marginBottom:20}]}>Add New Expenditure</Text> 
                :
                ("date" in exp) ? 
                <Text style={[styles.textTitle, {marginBottom:20}]}>Edit Expenditure</Text> 
                : <Text style={[styles.textTitle, {marginBottom:20}]}>Add Shopping List As Expenditure</Text> 
                } 
                <Input name="Company" icon="building" value={company?company:""} onChangeText={text => setCompany(text)} />
                <Input name="Amount" icon="money" value={amount?amount:""} onChangeText={text => setAmount(text)} keyboardType="decimal-pad" />
                <Input name="Description" icon="file-text" value={descOpitional?descOpitional:""} onChangeText={text => {setDescriptionOpitional(text); }} />
           
                <TouchableOpacity
                    title="Home"
                    leftIcon="Home"
                    onPress={() => setModalOpen(true)}
                    style={[modelContent.button,{marginBottom:0}]}
                    >
                        <Icon 
                            name={descIcon}
                            size={25}
                            color={'#0782F9'}
                            style={{top:10}}
                            type={"material-community"}
                            />
                        <Text style={{top:10,margin:1}}></Text>
                </TouchableOpacity>
                <Text style={{top:10,margin:1}}>{desc}</Text>

                <View style={{ width: "55%",marginTop:70,alignItems:'center', marginLeft:10,marginRight:10,marginBottom:25,borderRadius:10,borderColor:'lightgrey', borderWidth:2}}>
                    <Picker
                        selectedValue={billingType}
                        style={{width: "100%",}}
                        onValueChange={(billingType, itemIndex) => { setBillingType(billingType); }}
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
                    { (billingType !== "Billing type" && billingType !== "One-time") && 
                        <>
                            <Input name="Payments" keyboardType="phone-pad" value={totalPayments} onChangeText={(text)=>{ setTotalPayments(text.replace(/[^0-9]/g, '')) ; }} />
                            { totalPayments == '' && <Text style={{fontSize:10}}>Payment will be taken until updated.</Text>}
                        </>
                    }
                </View>
                <View style={isEvent?{ width: "95%",alignItems:'center',borderRadius:10,borderColor:'lightgrey', borderWidth:2}:{}}>
                <ListItem.CheckBox
                                        center
                                        title="Set as event"
                                        checkedIcon="dot-circle-o"
                                        uncheckedIcon="circle-o"
                                        checked={isEvent}
                                        onPress={() => setIsEvent(!isEvent)}
                                        containerStyle={{marginLeft:10,marginRight:10,marginTop:15,marginBottom:10,borderRadius:10}}
                                        wrapperStyle = {{marginLeft:5,marginRight:5,marginTop:10,marginBottom:10,}}
                                    />
                { isEvent &&
                <>
                    <View style={[styles.dateInputButton, { borderColor: eventDate?Colors.main:Colors.lightGrey}]}>
                        <Icon name={'calendar'} size={22}
                                    color={show? Colors.main:'grey'} style={{marginLeft:10}} type='font-awesome'/>
                        <TouchableOpacity
                                title="Birth Date"
                                onPress={ () => showMode('date')}
                                style={{ textAlign:'left', flex:1,}}
                                >
                            <Text style={{fontSize:18, fontWeight:'bold',marginHorizontal:10, marginVertical:10, textAlign:'left', flex:1,color:eventDate?'black':'grey' }}>{eventDate? dateText : "Event Date"}</Text> 
                        </TouchableOpacity>
                    </View>
                    { dateText != 'Empty' &&
                     <ListItem.CheckBox
                                        center
                                        title="Set notification"
                                        checkedIcon="dot-circle-o"
                                        uncheckedIcon="circle-o"
                                        checked={isWithNotification}
                                        onPress={() => setIsWithNotification(!isWithNotification) }
                                        containerStyle={{marginLeft:10,marginRight:10,marginTop:15,marginBottom:10,borderRadius:10}}
                                        wrapperStyle = {{marginLeft:5,marginRight:5,marginTop:10,marginBottom:10,}}
                                    />}
                    { isWithNotification && 
                    <>
                    <View style={[styles.dateInputButton, { borderColor: notificationDate? Colors.main : Colors.lightGrey}]}>
                        <Icon name={'calendar'} size={22}
                                    color={show? Colors.main:'grey'} style={{marginLeft:10}} type='font-awesome'/>
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
                                <TouchableOpacity  style={docImageUploaderStyles.removeBtn} onPress={() => {
                                                    setNotificationsToRemove([...notificationsToRemove, notifications[index]]); 
                                                    let temp = []; 
                                                    for(const i in notifications) if(i!=index) temp.push(notifications[i])
                                                    setNotifications(temp);
                                                }
                                            } >
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
                <ListItem.CheckBox
                                        center
                                        title="Set retroactive income"
                                        checkedIcon="dot-circle-o"
                                        uncheckedIcon="circle-o"
                                        checked={isWithCustomDate}
                                        onPress={() => setIsWithCustomDate(!isWithCustomDate) }
                                        containerStyle={{marginLeft:10,marginRight:10,marginTop:15,marginBottom:10,borderRadius:10}}
                                        wrapperStyle = {{marginLeft:5,marginRight:5,marginTop:10,marginBottom:10,}}
                                    />
                {isWithCustomDate && 
                  <View style={styles.dateInputButton}>
                    <Icon name={'calendar'} size={22}
                                color={show? Colors.main:'grey'} style={{marginLeft:10}} type='font-awesome'/>
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
                {showNotification &&
                    (<DateTimePicker 
                    testID='dateTimePickeerNotification'
                    value = {notificationDate? (eventDate && notificationDate<eventDate? notificationDate: (eventDate?eventDate: new Date())) : (eventDate? eventDate: new Date())}
                    mode = {modeNotification}
                    is24Hour = {true}
                    display='default'
                    onChange={ onDateChangeNotification }
                    maximumDate={eventDate? eventDate:new Date()}
                    minimumDate={new Date()}
                    />)
                }
                {show &&
                    (<DateTimePicker 
                    testID='dateTimePickeer'
                    value = {eventDate? eventDate: new Date()}
                    mode = {mode}
                    is24Hour = {true}
                    display='default'
                    onChange={ onDateChange }
                    />)
                }
                {showCustomDate &&
                    (<DateTimePicker 
                    testID='dateTimePickeerCustomDate'
                    value = {customDate? customDate: new Date()}
                    mode = {modeCustomDate}
                    is24Hour = {true}
                    display='default'
                    onChange={ onDateChangeCustomDate }
                    maximumDate={new Date()}
                    />)
                }
                <View style = {modelContent.centeredView}> 
                    <Modal visible={modalOpen}
                            animationType="slide"
                            transparent={true}
                            >
                            <View style = {modelContent.modalView}>
                                <View style={[modelContent.modalRowView,{paddingTop:40,}]}>
                                    <TouchableOpacity
                                        title="Home"
                                        leftIcon="Home"
                                        onPress={() => {handleAddDescription("Home"); setDescriptionIcon("home")}}
                                        style={modelContent.button}
                                        >
                                            <Ionicons 
                                                name={"home"}
                                                size={20}
                                                color={'#0782F9'}
                                                style={{top:10}}
                                                />
                                        <Text style={{top:37,margin:1,fontSize:12}}>Home</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        title="Food"
                                        onPress={() => {handleAddDescription("Food"); setDescriptionIcon("food")}}
                                        style={modelContent.button}
                                        >
                                            <Ionicons 
                                                name="md-fast-food"
                                                size={20}
                                                color={'#0782F9'}
                                                style={{top:10}}
                                                />
                                        <Text style={{top:37,margin:1,fontSize:12}}>Food</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        title="Car"
                                        onPress={() => {handleAddDescription("Car"); setDescriptionIcon("car")}}
                                        style={modelContent.button}
                                        >
                                            <Ionicons 
                                                name={"car"}
                                                size={20}
                                                color={'#0782F9'}  
                                                style={{top:10}}
                                                />
                                        <Text style={{top:37,margin:1,fontSize:12}}>Car</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        title="Travel"
                                        onPress={() => {handleAddDescription("Travel"); setDescriptionIcon("airplane")}}
                                        style={modelContent.button}
                                        >
                                            <Entypo 
                                                name={"aircraft"}
                                                size={20}
                                                color={'#0782F9'}
                                                style={{top:10}}
                                                />
                                        <Text style={{top:37,margin:1,fontSize:12}}>Travel</Text>
                                    </TouchableOpacity>
                                    </View>

                                <View style={[modelContent.modalRowView,{margin:0, height:0}]}>
                                    <TouchableOpacity
                                        title="Shopping"
                                        onPress={() => {handleAddDescription("Shopping"); setDescriptionIcon("basket")}}
                                        style={modelContent.button}
                                        >
                                            <FontAwesome 
                                                name="shopping-bag"
                                                size={20}
                                                color={'#0782F9'}
                                                style={{top:10}}
                                            />
                                        <Text style={{top:37,margin:1,fontSize:12}}>Shopping</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        title="Bills"
                                        onPress={() => {handleAddDescription("Bills"); setDescriptionIcon("credit-card-settings-outline")}}
                                        style={modelContent.button}
                                        >
                                            <FontAwesome5
                                                name="money-check-alt"
                                                size={20}
                                                color={'#0782F9'}
                                                style={{top:10}}
                                                />
                                        <Text style={{top:37,margin:1,fontSize:12}}>Bills</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        title="Education"
                                        onPress={() => {handleAddDescription("Education"); setDescriptionIcon("school")}}
                                        style={modelContent.button}
                                        >
                                            <FontAwesome
                                                name={"graduation-cap"}
                                                size={20}
                                                color={'#0782F9'}  
                                                style={{top:10}}
                                                />
                                        <Text style={{top:37,margin:1,fontSize:12}}>Education</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        title="Other"
                                        onPress={() => {handleAddDescription("Other"); setDescriptionIcon("help-outline")}}
                                        style={modelContent.button}
                                        >
                                            <AntDesign 
                                                name={"help-outline"}
                                                size={20}
                                                color={'#0782F9'}
                                                style={{top:10}}
                                                />
                                        <Text style={{top:37,margin:1,fontSize:12}}>Other</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                    </Modal>
                </View>
                <View style={{ marginTop: 32, height: 440 }}>
                    <Text style = {houseProfileStyles.textWithButDivider}>
                        <Text style={{ fontWeight: "400" }}>{"Invoices: "}</Text>
                    </Text>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{height: 70}} >
                    { invoiceImageLoading ? <Loading/> :<>
                    
                        {catchInvoImages.map((val, index) => ( 
                            <View style={docImageUploaderStyles.mediaImageContainer}>
                                <UploadDocumentImage tempImage = {require('../assets/invoicing_icon.png')} image={val} onPress={() => {setFromToImagePicker('invoice'); setIndexOfImage(index);}} onRemove={() => onRemove('invoice',index)} changeable={true} navigation={navigation}/>
                            </View>
                            ))}</>}
                            
                        <View style={docImageUploaderStyles.mediaImageContainer}>    
                            <UploadDocumentImage tempImage = {require('../assets/invoicing_icon.png')} onPress={() => {setFromToImagePicker('invoice'); setIndexOfImage(-1);}} onRemove={-1} changeable={true} navigation={navigation}/>
                        </View>
                        
                    </ScrollView>
                   
                    <Text style = {houseProfileStyles.textWithButDivider}>
                        <Text style={{ fontWeight: "400" }}>{"Warranty / contract: "}</Text>
                    </Text>
                    
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{height: 30}}>
                        { contractImageLoading ? <Loading/> : <>
                        {catchContractImages.map((val, index) => ( 
                            <View style={docImageUploaderStyles.mediaImageContainer}>
                                <UploadDocumentImage tempImage = {require('../assets/contract_icon.png')} image={val} onPress={() => {setFromToImagePicker('contract'); setIndexOfImage(index);}} onRemove={() => onRemove('contract',index)} changeable={true} navigation={navigation}/>
                            </View>
                            ))
                        }</>}
                        <View style={docImageUploaderStyles.mediaImageContainer}>    
                            <UploadDocumentImage tempImage = {require('../assets/contract_icon.png')} onPress={() => {setFromToImagePicker('contract'); setIndexOfImage(-1);}}  onRemove={-1} changeable={true} navigation={navigation}/>
                        </View>

                    </ScrollView>
                    {/* <View style={houseProfileStyles.mediaCount}>
                        <Text style={[houseProfileStyles.text, { fontSize: 24, color: "#DFD8C8", fontWeight: "300" }]}>70</Text>
                        <Text style={[houseProfileStyles.text, { fontSize: 12, color: "#DFD8C8", textTransform: "uppercase" }]}>Media</Text>
                    </View> */}
                </View> 

                </View>
            <View style={[styles.container,{marginTop: 5}]}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        title={exp ? "Update":"Create"}
                        onPress={handleCreateExpend}
                        style={styles.button}
                        >
                        <Text style={styles.buttonText}>{exp ? "Update":"Create"}</Text>
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



export default AddOrEditExpenditureScreen
