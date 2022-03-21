import React, { useEffect, useState, useRef } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Text, View,Image,ScrollView, TouchableOpacity, Picker, LogBox, Modal} from 'react-native';
import * as firebase from '../firebase'
import * as cloudinary from '../Cloudinary'
import Input from '../components/Inputs';
import { styles, houseProfileStyles, docImageUploaderStyles,modelContent } from '../styleSheet'
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
// import * as CustomNotificationsFuncs from '../CustomNotifications'


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

const AddNewExpenditureScreen = ({route}) => {
    const navigation = useNavigation()
    const [user, setUser] = useState([]);
    const [modalOpen, setModalOpen] = useState(false)
    let [catchInvoImages, setInvoCatchImage] = useState([]);
    let [catchContractImages, setContractCatchImage] = useState([]);
    const [hImage, setImage] = useState('');

    const [company, setCompany] = useState('');
    const [desc, setDescription] = useState('Home');
    const [descIcon, setDescriptionIcon] = useState('home');
    const [amount, setAmount] = useState('');
    const [billingType, setBillingType] = useState("Billing type");
    const [isEvent, setIsEvent] = useState(false);
    const [isWithNotification, setIsWithNotification] = useState(false);

    const [mode, setMode] = useState('');
    const [show, setShow] = useState(false);
    const [dateText, setDateText] = useState('Empty');

    const [modeNotification, setModeNotification] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [dateTextNotification, setDateTextNotification] = useState('Empty');
    
    const [eventDate, setEventDate] = useState('');
    const [notificationDate, setNotificationDate] = useState('');


    const house = route.params;
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
  
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
      }, [])
      
    useEffect(() => {
        if(mode == 'date') showMode('time')
      }, [eventDate])
      useEffect(() => {
        if(modeNotification == 'date') showModeNotification('time')
      }, [notificationDate])
    const addImage = async (from,index) => {
        let _image = await cloudinary.addDocImage()
          if (!_image.cancelled) {
            setImage(_image.uri);

            if(index==-1){
                if(from == 'invoice')
                    cloudinary.uploadImageToCloudinary("invoice",_image).then((url)=>{ setInvoCatchImage([...catchInvoImages, url]); }).catch((e) => alert(e.message))
                else if(from == 'contract')
                    cloudinary.uploadImageToCloudinary("contract",_image).then((url)=>{ setContractCatchImage([...catchContractImages, url]); }).catch((e) => alert(e.message))
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
        else if(company && desc && amount){
            firebase.addExpendToHouse(house.hName,house.cEmail,house.expends , {date: new Date(),partner:user.email,company: company, desc: desc, amount: amount, billingType: billingType, invoices: catchInvoImages, contracts: catchContractImages, isEvent: isEvent, eventDate: eventDate})
            navigation.replace("HouseProfile",{hKeyP: firebase.getHouseKeyByNameAndCreatorEmail(house.hName,house.cEmail)})
            if(isWithNotification) { await schedulePushNotification("The event is approaching! 🕞",dateText,"data",new Date(notificationDate.setSeconds(0)))}; 
        }else alert("Sorry, you must fill in all the fields!")
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
    }

    const showModeNotification = (currentMode) => {
        setShowNotification(true)
        setModeNotification(currentMode)
      }
    return (
        <ScrollView style={{backgroundColor: 'white'}}>
            {/* <UploadProfileImage tempImage = {require('../assets/add_house.png')} image = {hImage} onPress={addImage} changeable={true}/> */}

            <View style={[styles.container,{backgroundColor: modalOpen?'rgba(52, 52, 52, 0.8)':'white'}]}>
            {/* <View style={[styles.container, {marginTop:200,marginHorizontal:15}]}> */}
                <Text style={[styles.textTitle, {marginBottom:20}]}>Add New Expenditure</Text> 
                <Input name="Company" icon="building" onChangeText={text => setCompany(text)} />
                <Input name="Amount" icon="money" onChangeText={text => setAmount(text)} keyboardType="decimal-pad" />
           
                <TouchableOpacity
                    title="Home"
                    leftIcon="Home"
                    onPress={() => setModalOpen(true)}
                    style={[modelContent.button,{marginBottom:0}]}
                    >
                        <Ionicons 
                            name={descIcon}
                            size={20}
                            color={'#0782F9'}
                            style={{top:10}}
                            />
                    <Text style={{top:37,margin:1}}>{desc}</Text>
                </TouchableOpacity>
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
                     <View style={styles.dateInputButton}>
                        <Icon name={'calendar'} size={22}
                                    color={show? '#0779e4':'grey'} style={{marginLeft:10}}/>
                        <TouchableOpacity
                                title="Birth Date"
                                onPress={ () => showMode('date')}
                                style={{ textAlign:'left', flex:1}}
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
                    </>
                    }
                </>
                }
                </View>
                {showNotification &&
                    (<DateTimePicker 
                    testID='dateTimePickeerNotification'
                    value = {notificationDate? (eventDate && notificationDate<eventDate? notificationDate: (eventDate?eventDate: new Date())) : (eventDate? eventDate: new Date())}
                    mode = {modeNotification}
                    is24Hour = {true}
                    display='default'
                    onChange={ onDateChangeNotification }
                    maximumDate={eventDate? eventDate:new Date()}
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
                                        onPress={() => {handleAddDescription("Food"); setDescriptionIcon("md-fast-food")}}
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
                                        onPress={() => {handleAddDescription("Shopping"); setDescriptionIcon("shopping-bag")}}
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
                                        onPress={() => {handleAddDescription("Bills"); setDescriptionIcon("money-check-alt")}}
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
                                        onPress={() => {handleAddDescription("Education"); setDescriptionIcon("graduation-cap")}}
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
                                        onPress={() => {handleAddDescription("Other"); setDescriptionIcon("question")}}
                                        style={modelContent.button}
                                        >
                                            <AntDesign 
                                                name={"question"}
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
                    {
                        catchInvoImages.map((val, index) => ( 
                            <View style={docImageUploaderStyles.mediaImageContainer}>
                                <UploadDocumentImage tempImage = {require('../assets/invoicing_icon.png')} image={val} onPress={() => addImage('invoice',index)} onRemove={() => onRemove('invoice',index)} changeable={true} navigation={navigation}/>
                                {console.log(index)}
                            </View>
                            ))
                        }
                        <View style={docImageUploaderStyles.mediaImageContainer}>    
                            <UploadDocumentImage tempImage = {require('../assets/invoicing_icon.png')} onPress={() => addImage('invoice',-1)} onRemove={-1} changeable={true} navigation={navigation}/>
                        </View>
                
                    </ScrollView>
                   
                    <Text style = {houseProfileStyles.textWithButDivider}>
                        <Text style={{ fontWeight: "400" }}>{"Warranty / contract: "}</Text>
                    </Text>
                    
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{height: 30}}>
                        {catchContractImages.map((val, index) => ( 
                            <View style={docImageUploaderStyles.mediaImageContainer}>
                                <UploadDocumentImage tempImage = {require('../assets/contract_icon.png')} image={val} onPress={() => addImage('contract',index)} onRemove={() => onRemove('contract',index)} changeable={true} navigation={navigation}/>
                            </View>
                            ))
                        }
                        <View style={docImageUploaderStyles.mediaImageContainer}>    
                            <UploadDocumentImage tempImage = {require('../assets/contract_icon.png')} onPress={() => addImage('contract',-1)}  onRemove={-1} changeable={true} navigation={navigation}/>
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
                        title="Create"
                        onPress={handleCreateExpend}
                        style={styles.button}
                        >
                        <Text style={styles.buttonText}>Create</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}


async function schedulePushNotification(title,body,data,trigger) {
    await Notifications.scheduleNotificationAsync({
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



export default AddNewExpenditureScreen
