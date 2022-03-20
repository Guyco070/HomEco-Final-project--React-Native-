import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Text, View,Image,ScrollView, TouchableOpacity, Picker, LogBox, Alert,Modal} from 'react-native';
import * as firebase from '../firebase'
import * as cloudinary from '../Cloudinary'
import Input from '../components/Inputs';
import { styles, houseProfileStyles, docImageUploaderStyles, TodoSheet, modelContent } from '../styleSheet'
import * as ImagePicker from 'expo-image-picker';
import UploadDocumentImage from '../components/UploadDocumentImage';
import { ListItem, Avatar } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale'; 
import { Divider } from 'react-native-elements/dist/divider/Divider';
import { color } from 'react-native-reanimated';
import UploadProfileImage from '../components/UploadProfileImage';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons ,Entypo} from '@expo/vector-icons';
//import LinearGradient from 'react-native-linear-gradient'; // Only if no expo

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state.',
   ]);

const EditExpenditureScreen = ({route}) => {
    const navigation = useNavigation()
    const [user, setUser] = useState([]);

    const [modalOpen, setModalOpen] = useState(false)

    let [catchInvoImages, setInvoCatchImage] = useState([]);
    let [catchContractImages, setContractCatchImage] = useState([]);
    const [hImage, setImage] = useState('');

    const [company, setCompany] = useState('');
    const [desc, setDescription] = useState('');
    const [descIcon, setDescriptionIcon] = useState('home');
    const [amount, setAmount] = useState('');
    const [house, setHouse] = useState('');
    const [billingType, setBillingType] = useState("Billing type");

    const [isEvent, setIsEvent] = useState(false);

    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [dateText, setDateText] = useState('Empty');

    const [eventDate, setEventDate] = useState('');

    const exp = route.params.exp;
    const hKey = route.params.hKey;


    useEffect(() => {
        firebase.getByDocIdFromFirestore("users", firebase.auth.currentUser?.email).then( (us) => { setUser(us)} )    // before opening the page
        firebase.getByDocIdFromFirestore("houses",hKey).then((house)=> {setHouse(house); }).catch((e) =>{})
        setInvoCatchImage(exp.invoices)
        setContractCatchImage(exp.contracts)
        setBillingType(exp.billingType)
        setCompany(exp.company)
        setDescription(exp.desc)
        setAmount(exp.amount)
        setIsEvent(exp.isEvent)
        updateEventDateText(exp.eventDate)
      }, [])

    const addImage = async (from,index) => {
        let _image = await cloudinary.addDocImage()
          if (!_image.cancelled) {
            setImage(_image.uri);

            console.log("index = " + index)

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

    const handleAddButtonClick = () => {
        };

    const handleCreateExpend = () => {
        if(billingType == "Billing type") alert("Sorry, Billing type is the title... ")
        else if (isNaN(amount)) alert("Sorry, Amount should be a number !" + amount)
        else if(company && desc && amount){
            firebase.addExpendToHouse(house.hName,house.cEmail,house.expends , {date:("date" in exp)?exp.date.toDate():new Date(),partner:user.email,company: company, desc: desc, amount: amount, billingType: billingType, invoices: catchInvoImages, contracts: catchContractImages, isEvent: isEvent, eventDate: eventDate}).then(()=>{
            if(!("date" in exp)) 
                firebase.updateCollectAtFirestore("houses", hKey, "shoppingList", [])
            })
            navigation.replace("HouseProfile",{hKeyP:hKey})
        }else alert("Sorry, you must fill in all the fields!")
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

    const handleAddDescription = (desc) => {
        setModalOpen(false);
        setDescription(desc);
        };

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
        setDateText(fDate + '  |  ' + fTime)
        if(mode == 'date') showMode('time')
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


    return (
        <ScrollView style={{backgroundColor: 'white'}}>
            {("date" in exp) &&
            <View style={TodoSheet.trash}>
                <TouchableOpacity style={{margin:25} } onPress={handleDeleteExpenditure} >
                    <Icon name="trash"  type="ionicon" size={22}/>
                </TouchableOpacity>
            </View>}

            <View style={[styles.container,{backgroundColor: modalOpen?'rgba(52, 52, 52, 0.8)':'white'}]}>
            {/* <View style={[styles.container, {marginTop:200,marginHorizontal:15}]}> */}

                {("date" in exp) ? 
                <Text style={[styles.textTitle, {marginBottom:20}]}>Edit Expenditure</Text> 
                : <Text style={[styles.textTitle, {marginBottom:20}]}>Add Shopping List As Expenditure</Text> }
                <Input name="Company" icon="building" value={company?company:""} onChangeText={text => setCompany(text)} />
                <Input name="Amount" icon="money" value={amount?amount:""} onChangeText={text => setAmount(text)} keyboardType="decimal-pad" />
                
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
                <View style={{ width: "55%",marginTop:70,alignItems:'center', marginLeft:10,marginRight:10,marginBottom:25,borderRadius:10,borderColor:'grey', borderWidth:2}}>
                    <Picker
                        selectedValue={billingType}
                        style={{ width: "100%" }}
                        onValueChange={(billingType, itemIndex) => { setBillingType(billingType) }}
                        itemStyle={{ backgroundColor: "grey", color: "blue", fontFamily:"Ebrima", fontSize:17, textAlign:'center' }}
                    >
                        <Picker.Item label="Billing type" value="Billing type"/>
                        <Picker.Item label="One-time" value="One-time"/>
                        <Picker.Item label="Weekly" value="Weekly"/>
                        <Picker.Item label="Fortnightly" value="Fortnightly"/>
                        <Picker.Item label="Monthly" value="Monthly" />
                        <Picker.Item label="Bi-monthly" value="Bi-monthly" />
                        <Picker.Item label="Annual" value="Annual" />
                        <Picker.Item label="Biennial" value="Biennial" />
                    </Picker>
                </View>

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
                </>
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
                                        <Text style={{top:37,margin:1}}>Home Bills</Text>
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
                                        <Text style={{top:37,margin:1}}>Food</Text>
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
                                        <Text style={{top:37,margin:1}}>Car</Text>
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
                                        <Text style={{top:37,margin:1}}>Travel</Text>
                                    </TouchableOpacity>
                                    </View>

                                <View style={[modelContent.modalRowView,{margin:0, height:0}]}>
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
                                        <Text style={{top:37,margin:1}}>Home Bills</Text>
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
                                        <Text style={{top:37,margin:1}}>Food</Text>
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
                                        <Text style={{top:37,margin:1}}>Car</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        title="Other"
                                        onPress={() => {handleAddDescription("Other"); setDescriptionIcon("airplane")}}
                                        style={modelContent.button}
                                        >
                                            <Entypo 
                                                name={"aircraft"}
                                                size={20}
                                                color={'#0782F9'}
                                                style={{top:10}}
                                                />
                                        <Text style={{top:37,margin:1}}>Other</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                    </Modal>
                </View>
                <View style={{ marginTop: 32, height: 440 }}>
                    <Text style = {houseProfileStyles.textWithButDivider}>
                        <Text style={{ fontWeight: "400" }}>{"Invoices: "}</Text>
                    </Text>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={true} style={{height: 70}} >
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
                
                        { /* add button */ }
                        {/*  <View style={docImageUploaderStyles.mediaImageContainer} >
                            <TouchableOpacity style={{paddingVertical:75,alignItems:'center'}} onPress={() => handleAddButtonClick()} >
                                <Icon style={{alignSelf:'center',height:150}} name="add-outline"  type="ionicon" color={"grey"} size={60}/>
                            </TouchableOpacity>
                        </View> */}
                    </ScrollView>
                    {/* <View style={houseProfileStyles.mediaCount}>
                        <Text style={[houseProfileStyles.text, { fontSize: 24, color: "#DFD8C8", fontWeight: "300" }]}>70</Text>
                        <Text style={[houseProfileStyles.text, { fontSize: 12, color: "#DFD8C8", textTransform: "uppercase" }]}>Media</Text>
                    </View> */}

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
                        title="Update"
                        onPress={handleCreateExpend}
                        style={styles.button}
                        >
                        {("date" in exp)?
                            <Text style={styles.buttonText}>Update</Text>:
                            <Text style={styles.buttonText}>Create</Text>
                        }
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

export default EditExpenditureScreen