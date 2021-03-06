import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Text, ScrollView } from 'react-native';
import * as firebase from '../firebase'
import * as cloudinary from '../Cloudinary'
import { houseProfileStyles, styles } from '../styleSheet'
import UploadProfileImage from '../components/UploadProfileImage';
import { ListItem, Avatar } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale'; 
import Loading from './Loading';

const UserHousesListView = (props) => {
    const navigation = useNavigation()
    const [housesList, sethousesList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { 
            firebase.getHousesByUserEmail(props.user["email"])
            .then((houses) => {sethousesList(houses); setLoading(false);})
            .catch((e)=>alert(e.massege))    // before opening the page
      },[props])

      useEffect(() => { 
        firebase.getHousesByUserEmail(props.user["email"])
        .then((houses) => {sethousesList(houses); setLoading(false);})
        .catch((e)=>alert(e.massege))    // before opening the page
  },[])
    const addImage = async () => {
        let _image = await cloudinary.addImageFromLibrary()
          if (!_image.cancelled) {
            setImage(_image.uri);
            cloudinary.uploadImageToCloudinary("houses",_image).then((url)=>{ setCatchImage(url); }).catch((e) => alert(e.message))
          }
        }

    return (
        loading?(<Loading/>) :
        (<ScrollView 
        style={{width:'80%',}}
        >

            {   (props?.viewImage) || !("viewImage" in props)  &&
                <TouchableScale
                onPress={() => {navigation.replace('UserProfileScreen')}}
                >
                    <UploadProfileImage tempImage = {require('../assets/signup.png')} image = {props.user.uImage} onPress={addImage} changeable={false} />
                </TouchableScale>
            }
            {housesList && props?.withDetails && <Text style={[houseProfileStyles.subText, houseProfileStyles.recent,{marginLeft:0}]}>My houses</Text>}

            {housesList && 
                    housesList 
                        .map((l, i) => 
                        (
                            <ListItem key={i} bottomDivider topDivider Component={TouchableScale}
                            friction={90} //
                            tension={100} // These props are passed to the parent component (here TouchableScale)
                            activeScale={0.95}
                            onPress={() => { navigation.navigate('HouseProfile',{hKeyP:firebase.getHouseKeyByNameAndCreatorEmail(l.hName,l.cEmail)});} }
                            >
                                <ListItem.Content>
                                <ListItem.Title style={styles.listTextItem} >{l.hName}</ListItem.Title>
                                {props?.withDetails && <ListItem.Subtitle style={styles.listSubtitleTextItem}>{"Created at: " + l.cDate}</ListItem.Subtitle>}
                                </ListItem.Content>
                                <Avatar source={{uri: l.hImage}} rounded/>
                            </ListItem>
                        ))
                    }
        </ScrollView>)
    )
}

export default UserHousesListView
