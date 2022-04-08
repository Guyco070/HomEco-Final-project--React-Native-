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
    const [catchHouseImageLoading, setCatchHouseImageLoading] = useState(false);
    const [user, setUser] = useState([]);
    const [house, setHouse] = useState('');

    const hKey = props?.hKey;

    useEffect(() => {
      firebase.getByDocIdFromFirestore("users", firebase.auth.currentUser?.email).then( (us) => { setUser(us)} )    // before opening the page
      if(hKey)
          firebase.getByDocIdFromFirestore("houses",hKey).then((house)=> {setHouse(house); setHouseCatchImages(house.gallery); }).catch((e) =>{})
    }, [])

    useEffect(() => {
      
    }, [])

  useEffect(() => {
    firebase.updateCollectAtFirestore("houses", hKey, "gallery", catchHouseImages)
  },[props,catchHouseImages])

    const addImage = async () => {
      let _image = await cloudinary.addDocImage()
      
      if (!_image.cancelled) {
          cloudinary.uploadImageToCloudinary("Gallery",_image).then((url)=>{
              const image = { url, creator: user.email, date: new Date()}
             setHouseCatchImages([image, ...catchHouseImages]);
            }).catch((e) => alert(e.message))
      }
  }

  const onRemove = async (index) => {
    const tempCatchImages = []
    let i = 0

    for(let key in catchHouseImages) {
        if(index != key) {
          tempCatchImages[i] = catchHouseImages[key]
        }
    }
    setHouseCatchImages([...tempCatchImages])
} 

  return (
    <SafeAreaView style={styles.container}>
      {catchHouseImageLoading ? <Loading/> : 
      <FlatList 
        data={ catchHouseImages } 
        numColumns={3}
        keyExtractor={(item, index) => index}
        renderItem={({ item,index }) => (
            <View style={{ flex: 1, flexDirection: 'column', margin: 3, }}>
              
              <TouchableOpacity onPress={() => {props.navigation.navigate('ImageViewer',{ uri: item.url , navigation: props.navigation});}} disabled={item.url ? false : true }>
              <Image style={styles.imageThumbnail} source={{ uri: item.url }} />
              </TouchableOpacity>

              {  (user?.email == item.creator || house?.partners[user?.email].permissions.changeGallery) && <View style={docImageUploaderStyles.removeBtnContainer}>
                <TouchableOpacity  style={[docImageUploaderStyles.removeBtn,]} onPress={() => onRemove(index)} >
                  <AntDesign name="close" size={17} color="black" />
                </TouchableOpacity>
              </View>}
            </View>
          )}
      />}
      <TouchableOpacity style={{margin:25,marginBottom:0} } onPress={()=>{addImage()}} >
          <Icon  name="add"  type="icon" color={"grey"} />
      </TouchableOpacity>
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