import React, { useEffect } from 'react';
import { Image, View, TouchableOpacity, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { styles,docImageUploaderStyles } from '../styleSheet';
import * as ImagePicker from 'expo-image-picker';


export default function UploadDocumentImage(props) {
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
      <TouchableOpacity onPress={() => {props.navigation.navigate('ImageViewer',{ uri: props.image , navigation: props.navigation});}} disabled={props.image ? false : true }>
      <View style={docImageUploaderStyles.container}>
        
          <Image source={props.image ? {uri: props.image} : props.tempImage}
                      resizeMode="center" style={styles.image}/>
      {props.changeable &&
      <>
          <View style={docImageUploaderStyles.uploadBtnContainer}>
            <TouchableOpacity onPress={props.onPress} style={docImageUploaderStyles.uploadBtn}  >
                  <Text >{ props.image ? 'Edit' : 'Upload'} Image</Text>
                  <AntDesign name="camera" size={17} color="black" />
              </TouchableOpacity>
          </View>
          <View style={docImageUploaderStyles.removeBtnContainer}>
        
          {props.onRemove != -1 && 
          <TouchableOpacity  style={docImageUploaderStyles.removeBtn} onPress={props.onRemove}>
                  <AntDesign name="close" size={17} color="black" />
          </TouchableOpacity>}
        </View>
        </>}
      </View>
      </TouchableOpacity>
    </View>
   
  );
}