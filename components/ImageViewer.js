import React, {useEffect, useState, } from 'react'
import { Dimensions, View, ImageBackground,Text,Share, Platform } from 'react-native'
import ImageView from "react-native-image-viewing";
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { deviceHeight, deviceWidth } from '../SIZES';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const ImageViewer = (props) => {
  const navigation = useNavigation()
  const [visible, setIsVisible] = useState(true);

  const [images, setImages] = useState([]);

  useEffect(() => {
    setImages("images" in props.route.params ? 
      getImagesToView()
      : 
      [
        {
          uri: props.route.params.uri,
          title: ' ',
          width: deviceHeight,
          height: deviceWidth,
        },
      ])
  }, [props])

  const getImagesToView = () => {
    let tempImages = []

    for(let i in props.route.params.images){
      let imageDate =props.route.params.images[i].date
      if("toDate" in imageDate)
        imageDate = imageDate.toDate()
      else imageDate = new Date(imageDate)
      tempImages.push({
        creator: props.route.params.images[i].creator,
        title: imageDate.getTimezoneOffset(),
        title: "Upload date: " + imageDate.toLocaleDateString() + " " + imageDate.toLocaleTimeString()
        ,
        uri: props.route.params.images[i].url,
      })
    }
    return tempImages
  }; 

  useEffect(() => {
    if(visible == false)
      props.route.params.navigation.goBack()
  },[visible])
  let shareOnWhatsApp = async (image) => {
    
      try {
        axios({
          method: 'get',
          url: `https://ulvis.net/api.php?url=${image.uri}&private=1`,
        }).then(async(response) => {
          const result = await Share.share({
            message:
            response.data,
            url:
            response.data
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
          console.log();
        });
      } catch (error) {
        alert(error.message);
      }
    };
    // Linking.openURL('whatsapp://send?text=' + images[index].uri)

  return (
    <View>
      {/* <ImageBackground source={{uri: props.route.params.uri}} style={{height: deviceHeight ,width:deviceWidth}}/> */}
      <ImageView
      images={images}
      imageIndex={"index" in props.route.params ? props.route.params.index: 0}
      visible={visible}
      onRequestClose={() => {Platform.OS === 'ios' ? setIsVisible(false) : props.route.params.navigation.goBack()}}
      presentationStyle={'fullScreen'}
      onLongPress={(currentImage)=>{ shareOnWhatsApp(currentImage)}}
      
      FooterComponent	={(currentImage) => (
      <>
      {images.length != 0 && "creator" in images[currentImage.imageIndex] && <Text style={{color:'white', alignSelf:'center' ,fontSize:12}}>{"Uploaded by: " + images[currentImage.imageIndex].creator}</Text>}  
     {images.length != 0 && "title" in images[currentImage.imageIndex] && <Text style={{color:'white', alignSelf:'center' ,fontSize:11}}>{images[currentImage.imageIndex].title}</Text>}  
        <View style={{backgroundColor:'grey', alignSelf:'center',flexDirection:"row", marginBottom:5,marginTop:3, borderRadius:10,width:290, justifyContent:'center'}} >
          <Text style={{color:'white', fontSize:10 }}>Long click on the image to share on WhatsApp  </Text>
          <Icon name={'whatsapp'} color={'white'} size={16}/>
        </View>
        </>)
        }
    />
    
    </View>
  )
}


export default ImageViewer