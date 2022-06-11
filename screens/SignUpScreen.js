import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import UploadProfileImage from '../components/UploadProfileImage';


import { styles } from '../styleSheet';

import Input from '../components/Inputs';
import * as firebase from '../firebase'
import * as cloudinary from '../Cloudinary'
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';

import RNPhoneCodeSelect from "react-native-phone-code-select";
import ImagePickerModal from '../components/ImagePickerModal';
import { deviceWidth } from '../SIZES';


const SignUpScreen = () => {
    const navigation = useNavigation()
    const [fName, setFName] = useState('');
    const [catchImage, setCatchImage] = useState('');
    const [uImage, setUImage] = useState('');
    const [lName, setLName] = useState('');
    const [bDate, setBDate] = useState('');
    const [phone, setPhone] = useState('');
    const [phoneAreaCode, setPhoneAreaCode] = useState('+972');
    const [selectedCountry, setSelectedCountry] = useState('Israel');
    const [phoneAreaCodeVisable, setPhoneAreaCodeVisable] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [dateText, setDateText] = useState('Empty');
    
    const [imageModalPickerVisable, setImageModalPickerVisable] = useState(false);

    // useEffect(() => {
    //     const unsubscribe = firebase.auth.onAuthStateChanged(user => {
    //         if(user){
    //             navigation.replace("Home")
    //         }
    //     })
    //     return unsubscribe
    // }, [])

    const addImage = async (openWith) => {
        let _image = openWith === "camera" ? await cloudinary.takePhotoFromCamera() : await cloudinary.addImageFromLibrary()
          if (!_image.cancelled) {
            setImageModalPickerVisable(false)
            setUImage(_image.uri);
            cloudinary.uploadImageToCloudinary("users",_image).then((url)=>{ setCatchImage(url); }).catch((e) => alert(e.message))
          }
        }

    const handleSignUp = () => {
        createUserWithEmailAndPassword(firebase.auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            firebase.addUserToFirestore(email.toLowerCase(),fName, lName, phoneAreaCode +"-"+ phone, bDate, catchImage )
            signInWithEmailAndPassword(firebase.auth, email, password)
        })
        .catch(error => alert(error.message, email, password));
    }

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || bDate;
        setShow(Platform.OS === 'ios')
        setBDate(currentDate)
        let tempDate = new Date(currentDate)
        let fDate = firebase.getStrDateAndTimeToViewFromSrtDate(tempDate).replace('.','/').replace('.','/').substring(0,10)
        let fTime = 'Hours: ' + tempDate.getHours() + " | Minutes: " + tempDate.getMinutes()
        setDateText(fDate)
    }

    const showMode = (currentMode) => {
        setShow(true)
        setMode(currentMode)
      }

    return (
        <ScrollView style={{backgroundColor: 'white'}}>
            {imageModalPickerVisable && <ImagePickerModal imageModalPickerVisable={imageModalPickerVisable} setImageModalPickerVisable={setImageModalPickerVisable} addImage={addImage}/> }
            <UploadProfileImage tempImage = {require('../assets/signup.png')} image = {uImage} onPress={()=>setImageModalPickerVisable(true)} changeable={true}/>
            <View style={styles.container}>
                <Text style={styles.textTitle}>Let's Get Started</Text>
                <Text style={[styles.textBody, {margin:10}]}>Create an account</Text>
                <Input name="First Name" icon="user" onChangeText={text => setFName(text)} />
                <Input name="Last Name" icon="user" onChangeText={text => setLName(text)} />
                <View style={{width:"90%", flexDirection:'row'}}>
                            <Input style={{width:"35%"}} name={phoneAreaCode} icon="phone" keyboardType="phone-pad" onPress={()=>{ setPhoneAreaCodeVisable(true)}} /> 
                            <RNPhoneCodeSelect
                                visible={phoneAreaCodeVisable}
                                onDismiss={() => setPhoneAreaCodeVisable(false)}
                                onCountryPress={(country) => {setSelectedCountry(country); setPhoneAreaCode(country.dial_code.replace(" ","")); setPhoneAreaCodeVisable(false);console.log(country)}}
                                primaryColor="#f04a4a"
                                secondaryColor="#000000"
                                buttonText="Ok"
                                />
                            <Input style={{width:"65%"}} name="Phone" keyboardType="phone-pad" onChangeText={text => setPhone(text)} /> 
                            </View>
                <View style={styles.dateInputButton}>
                    <Icon name={'birthday-cake'} size={22}
                                color={show? '#0779e4':'grey'} style={{marginLeft:10}}/>
                    <TouchableOpacity
                            title="Birth Date"
                            onPress={ () => showMode('date')}
                            style={{ textAlign:'left', flex:1}}
                            >
                        <Text style={{fontSize:18, fontWeight:'bold',marginHorizontal:10, marginVertical:10, textAlign:'left', flex:1,color:bDate?'black':'grey' }}>{bDate? dateText : "Birth Day"}</Text> 
                    </TouchableOpacity>
                </View>
                {show &&
                    (<DateTimePicker 
                        testID='dateTimePickeer'
                        value = {bDate? bDate: new Date()}
                        mode = {mode}
                        is24Hour = {true}
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={ onDateChange }
                        style={{width:deviceWidth}}
                    />)
                }
                <Input name="Email" icon="envelope" keyboardType="email-address" onChangeText={text => setEmail(text)} /> 
                <Input name="Password" icon="lock" pass={true} onChangeText={text => setPassword(text)} />
                <Input name="Confirm Password" icon="lock" pass={true} onChangeText={(text) => {}}/>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        title="Create"
                        onPress={handleSignUp}
                        style={styles.button}
                        >
                        <Text style={styles.buttonText}>Create</Text>
                    </TouchableOpacity>
                </View>
                <View style={{...styles.container, marginBottom: 30}}>
                    <Text style={styles.textBody}>Already have an account</Text>
                    <Text style={[styles.textBody , {color: 'blue'}]} onPress={() => navigation.replace('Login')}>Login here</Text>
                </View>
            </View>
        </ScrollView>
    )
};

export default SignUpScreen;
