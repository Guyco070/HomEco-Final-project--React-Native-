
import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import UploadProfileImage from '../components/UploadProfileImage';
import { StyleSheet, Text, TouchableOpacity, View,SafeAreaView, ScrollView } from 'react-native';
import Input from '../components/Inputs';
import * as cloudinary from '../Cloudinary';
import * as firebase from '../firebase';
import {FontAwesome5} from "@expo/vector-icons";
import { styles } from '../styleSheet';
import '@firebase/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";


const EditProfile = () => {
    const [user, setUser] = useState([]);
    const [hImage, setImage] = useState('');
    const [fName, setFName] = useState('');
    const [lName, setLName] = useState('');
    const [bDate, setBDate] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        firebase.getByDocIdFromFirestore("users", firebase.auth.currentUser?.email).then( (us) => { setUser(us)})    // before opening the page

      }, [])

    const capitalize = (text) => {
        if (text == '') return ''
        return text[0].toUpperCase() + text.substr(1).toLowerCase()
      }
    const addImage = async () => {
        let _image = await cloudinary.addImage()
          if (!_image.cancelled) {
            setImage(_image.uri);
            cloudinary.uploadImageToCloudinary("houses",_image).then((url)=>{ setCatchImage(url); }).catch((e) => alert(e.message))
          }
        }
    const handleEditProfile = () => {
        if(fName!=""){
            firebase.updateCollectAtFirestore("users",user["email"],"fName",capitalize(fName))
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
        <ScrollView>
            <UploadProfileImage tempImage = {require('../assets/add_house.png')} image = {hImage} onPress={addImage} changeable={true}/>
            <Input name={user["fName"]} text={user["fName"]} icon="user" onChangeText={text => setFName(text)} />
            <Input name={user["lName"]} icon="user" onChangeText={text => setLName(text)} />
            <Input name={user["phone"]} icon="phone" keyboardType="phone-pad" onChangeText={text => setPhone(text)} /> 
            <Input name={user["bDate"]} icon= 'birthday-cake' onChangeText={text => setBDate(text)} /> 

            <TouchableOpacity
                        title="Submit"
                        onPress={handleEditProfile}
                        style={styles.button}
                        >
                        <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </ScrollView>
    )
};

export default EditProfile;
