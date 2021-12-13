import React, { useState, useEffect } from 'react';
import { Image, View, Platform, TouchableOpacity, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { styles,imageUploaderStyles } from '../styleSheet';
import * as ImagePicker from 'expo-image-picker';


export default function UploadProfileImage(props) { 

  useEffect(() => {
    // checkForCameraRollPermission()
  }, []);

  const  checkForCameraRollPermission=async()=>{
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert("Please grant camera roll permissions inside your system's settings");
    }else{
      console.log('Media Permissions are granted')
   }
  }
  
  return (
    
    <View style={styles.container}>
      <View style={imageUploaderStyles.container}>
          <Image source={props.image ? {uri: props.image} : props.tempImage}
                      resizeMode="center" style={styles.image}/>
      {props.changeable &&
          <View style={imageUploaderStyles.uploadBtnContainer}>
              <TouchableOpacity onPress={props.onPress} style={imageUploaderStyles.uploadBtn} >
                  <Text >{ props.image ? 'Edit' : 'Upload'} Image</Text>
                  <AntDesign name="camera" size={17} color="black" />
              </TouchableOpacity>
          </View>}
      </View>
    </View>
   
  );
}