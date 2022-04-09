import { SafeAreaView,StyleSheet, Text, View, Image} from 'react-native'
import React, { useEffect, useState } from 'react'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import Loading from './Loading';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import * as firebase from '../firebase'
import * as cloudinary from '../Cloudinary'
import { docImageUploaderStyles } from '../styleSheet';
import { AntDesign } from '@expo/vector-icons';

const HouseGalleryViewer = (props) => {
    const [catchHouseImages, setHouseCatchImages] = useState([]);
    const [catchHouseImageLoading, setCatchHouseImageLoading] = useState(true);
    const [user, setUser] = useState([]);
    const [house, setHouse] = useState('');

    const hKey = props?.hKey;

    useEffect(() => {
      firebase.getByDocIdFromFirestore("users", firebase.auth.currentUser?.email).then( (us) => { setUser(us)} )    // before opening the page
      if(hKey)
          firebase.getByDocIdFromFirestore("houses",hKey).then((house)=> {setHouse(house); setHouseCatchImages(house.gallery); }).catch((e) =>{})
    }, [])

    useEffect(() => {
      if(house != ''){
        firebase.updateCollectAtFirestore("houses", hKey, "gallery", catchHouseImages)
        setCatchHouseImageLoading(false)
        props.scrollHandler();
      }
    }, [catchHouseImages])

    const addImage = async () => {
      let _image = await cloudinary.addDocImage()
      setCatchHouseImageLoading(true)
      if (!_image.cancelled) {
          cloudinary.uploadImageToCloudinary("Gallery",_image).then((url)=>{
              const image = { url, creator: user.email, date: new Date()}
             setHouseCatchImages([image, ...catchHouseImages]);
            }).catch((e) => alert(e.message))
      }else setCatchHouseImageLoading(false)
  }

  const onRemove = async (index) => {
    const tempCatchImages = []
    let i = 0

    for(let key in catchHouseImages) {
        if(index != key) {
          tempCatchImages[i] = catchHouseImages[key]
        }else i++
    }
    setHouseCatchImages(tempCatchImages)
} 

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={{marginTop:0, marginBottom:10, flexDirection:'row', alignSelf:'center'} } onPress={()=>{addImage()}} >
          <Icon  name="add"  type="icon" color={"grey"} size={19}/>
          <Text style={{color:'grey', fontSize:13}}> Add new photo</Text>

      </TouchableOpacity>
      {catchHouseImageLoading ? <Loading/> : 
      catchHouseImages && <FlatList 
        data={ catchHouseImages } 
        numColumns={3}
        keyExtractor={(item, index) => index}
        renderItem={({ item,index }) => (
            <View style={{ flex: 1, flexDirection: 'column', margin: 3, }}>
              
              <TouchableOpacity onPress={() => {props.navigation.navigate('ImageViewer',{ uri: item.url , navigation: props.navigation, images: catchHouseImages, index});}} disabled={item.url ? false : true }>
              <Image style={styles.imageThumbnail} source={{ uri: item.url }} />
              </TouchableOpacity>

              {  ((catchHouseImageLoading) && (user?.email == item.creator || house.partners[user.email].permissions.changeGallery)) && <View style={docImageUploaderStyles.removeBtnContainer}>
                <TouchableOpacity  style={[docImageUploaderStyles.removeBtn,]} onPress={() => onRemove(index)} >
                  <AntDesign name="close" size={17} color="black" />
                </TouchableOpacity>
              </View>}
            </View>
          )}
      />}
    </SafeAreaView>
  )
}

export default HouseGalleryViewer

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    marginTop:10,
    marginHorizontal:3
  },
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 125,
  },
});