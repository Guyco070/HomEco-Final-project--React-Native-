
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import UploadProfileImage from '../components/UploadProfileImage';
import { StyleSheet, Text, TouchableOpacity, View,SafeAreaView, ScrollView, Platform } from 'react-native';
import Input from '../components/Inputs';
import * as cloudinary from '../Cloudinary';
import * as firebase from '../firebase';
import {FontAwesome5} from "@expo/vector-icons";
import { styles } from '../styleSheet';
import '@firebase/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import Loading from '../components/Loading';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import LoginScreen from './LoginScreen';


const EditUserProfileScreen = () => {
    const navigation = useNavigation()

    const [user, setUser] = useState([]);
    const [uImage, setImage] = useState('');
    const [fName, setFName] = useState('');
    const [lName, setLName] = useState('');
    const [bDate, setBDate] = useState('');
    const [phone, setPhone] = useState('');
    const [catchImage, setCatchImage] = useState('');

    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [dateText, setDateText] = useState('Empty');

    useEffect(() => {
        firebase.getByDocIdFromFirestore("users", firebase.auth.currentUser?.email).then( (us) => { setUser(us)})    // before opening the page
      }, [])

    useEffect(()=>{
        setImage(user.uImage)
        setFName(user.fName)
        setLName(user.lName)
        if(typeof(user.bDate) === 'string'){
            let tempDate = user.bDate.trim().split('/')
            if(tempDate[0][0] !== '0' && parseInt(tempDate[0]) < 10) tempDate[0] = "0" + tempDate[0]
            if(tempDate[1][0] !== '0' && parseInt(tempDate[1]) < 10) tempDate[1] = "0" + tempDate[1]
            let tempText = tempDate[0] + '/' + tempDate[1] + '/' + tempDate[2]
            tempDate = tempDate[1] + '/' + tempDate[0] + '/' + tempDate[2]
            setBDate(new Date(tempDate))
            setDateText(tempText)
        }
        setPhone(user.phone)
    },[user])

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || bDate;
        setShow(Platform.OS === 'ios')
        setBDate(currentDate)
        let tempDate = new Date(currentDate)
        let fDate = firebase.getSrtDateAndTimeToViewFromSrtDate(tempDate).replace('.','/').replace('.','/').substring(0,10)
        let fTime = 'Hours: ' + tempDate.getHours() + " | Minutes: " + tempDate.getMinutes()
        setDateText(fDate)
    }

    const showMode = (currentMode) => {
        setShow(true)
        setMode(currentMode)
      }

    const capitalize = (text) => {
        if (text == '') return ''
        return text[0].toUpperCase() + text.substr(1).toLowerCase()
      }

    const addImage = async () => {
        let _image = await cloudinary.addImage()
          if (!_image.cancelled) {
            setImage(_image.uri);
            cloudinary.uploadImageToCloudinary("houses",_image).then((url)=>{ setCatchImage(url); }).catch((e) => alert(e.message))
            navigation.replace("Home")
          }
        }

    const handleEditProfile = () => {
        if(fName!=""){
            firebase.updateCollectAtFirestore("users",user["email"],"fName",capitalize(fName))
        }
        if(catchImage){
            firebase.updateCollectAtFirestore("users",user["email"],"uImage",catchImage)
        }
        if(lName!=""){
            firebase.updateCollectAtFirestore("users",user["email"],"lName",capitalize(lName))
        }
        if(bDate!=""){
            firebase.updateCollectAtFirestore("users",user["email"],"bDate",bDate)
        }
        if(phone!=""){
            firebase.updateCollectAtFirestore("users",user["email"],"phone",phone)
        }
    }
    

    return (
        <ScrollView style = {{backgroundColor: "white"}}>
            <View  style={styles.container}>
            <UploadProfileImage tempImage = {require('../assets/signup.png')} image = {uImage} onPress={addImage} changeable={true}/>
            <Text style={{textAlign: "left"}} >First Name *</Text>
            <Input name={user["fName"] ? user["fName"] : ""} icon="user" value={fName?fName : ""} onChangeText={text => setFName(text)} />
            <Text style={{textAlign: "left"}} >Last Name *</Text>
            <Input name={user["lName"] ? user["lName"] : ""} icon="user" value={lName?lName : ""} onChangeText={text => setLName(text)} />
            <Text style={{textAlign: "left"}} >Phone *</Text>
            <Input name={user["phone"] ? user["phone"] : ""} icon="phone" value={phone? phone : ""} keyboardType="phone-pad" onChangeText={text => setPhone(text)} /> 
            <Text style={{textAlign: "left"}} >Birth Day *</Text>
            
            <View style={styles.dateInputButton}>
                <Icon name={'birthday-cake'} size={22}
                            color={show? '#0779e4':'grey'} style={{marginLeft:10}}/>
                <TouchableOpacity
                        title="Birth Date"
                        onPress={ () => showMode('date')}
                        style={{ textAlign:'left', flex:1}}
                        >
                    <Text style={{fontSize:18, fontWeight:'bold',marginHorizontal:10, marginVertical:10, textAlign:'left', flex:1 }}>{bDate? dateText : ""}</Text> 
                </TouchableOpacity>
            </View>
            

            {show &&
                (<DateTimePicker 
                testID='dateTimePickeer'
                value = {bDate}
                mode = {mode}
                is24Hour = {true}
                display='default'
                onChange={ onDateChange }
                />)
            }
            <TouchableOpacity
                        title="Save"
                        onPress={handleEditProfile}
                        style={styles.button}
                        >
                        <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            </View>

        </ScrollView>
    )
};

export default EditUserProfileScreen;
