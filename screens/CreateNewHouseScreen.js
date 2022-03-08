import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Text, View,Image,ScrollView, TouchableOpacity,KeyboardAvoidingView } from 'react-native';
import * as firebase from '../firebase'
import * as cloudinary from '../Cloudinary'
import Input from '../components/Inputs';
import { styles } from '../styleSheet'
import * as ImagePicker from 'expo-image-picker';
import UploadProfileImage from '../components/UploadProfileImage';
import { ListItem, Avatar } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale'; 
import { Divider } from 'react-native-elements/dist/divider/Divider';
//import LinearGradient from 'react-native-linear-gradient'; // Only if no expo



const CreateNewHouseScreen = () => {
    const navigation = useNavigation()
    
    const [user, setUser] = useState([]);

    const [searchVal, setSearch] = useState('');

    const [catchImage, setCatchImage] = useState('');
    const [hImage, setImage] = useState('');
    const [hName, setHName] = useState('');
    const [hPartners, setPartners] = useState([]);
    const [partnersList, setPartnersList] = useState([]);
    const [desc, setDesc] = useState('');

    useEffect(() => {
        firebase.getByDocIdFromFirestore("users", firebase.auth.currentUser?.email).then( (us) => { setUser(us)} )    // before opening the page
      }, [])

      const addImage = async () => {
        let _image = await cloudinary.addImage()
          if (!_image.cancelled) {
            setImage(_image.uri);
            cloudinary.uploadImageToCloudinary("houses",_image).then((url)=>{ setCatchImage(url); }).catch((e) => alert(e.message))
          }
        }

    const handleCreateHouse = () => {
        if(hName == '')
            alert("Sorry, can't create house without name")
        else{
            firebase.getByDocIdFromFirestore("houses",firebase.getHouseKeyByNameAndCreatorEmail(hName,user["email"]))
            .then((house) => {
                if(house)
                    alert("You have already created a house named \"" + hName + "\".\nPlease select another name.\nThanks!")
                else {
                    firebase.addHouseToFirestore(hName, user["email"] ,[user,...hPartners], catchImage, desc)
                    .then((creattedHouse) =>{
                        navigation.replace("HouseProfile",{hKeyP:firebase.getHouseKeyByNameAndCreatorEmail(creattedHouse.hName,creattedHouse.cEmail)})
                    }
                    ).catch(error => alert(error.message));
                }
            }).catch(error => alert(error.message))
        }
    }

    const handlePartnersSearch = (search) => {
        setSearch(search)
        if(search != ''){
            search = search.toLowerCase()
            firebase.getCollectionFromFirestoreByKeySubString("users",search)
            .then((partnersList) => { 
                if(partnersList.length != 0){
                    setPartnersList(partnersList.filter((doc) => {if(doc.email != user.email && !(hPartners.includes(doc))) return doc} )) /*(doc.fName + " " + doc.lName + " - " + doc.email)}*/
                }
                else {
                    search = firebase.capitalize(search)
                    firebase.getUCollectionFromFirestoreByUserNameSubString("users",search)
                    .then((partnersList) => setPartnersList(partnersList.filter((doc) => {if(doc.email != user.email && !(hPartners.includes(doc))) return doc} ))) /*(doc.fName + " " + doc.lName + " - " + doc.email)}*/
                    .catch(error => alert(error.message))
                }
            }).catch(error => alert(error.message))
        }else setPartnersList([])
    }

    return (
        <ScrollView style={{backgroundColor: 'white'}}>
            <UploadProfileImage tempImage = {require('../assets/add_house.png')} image = {hImage} onPress={addImage} changeable={true}/>

            <View style={[styles.container, {marginTop:30,marginHorizontal:30}]}>
                <Text style={styles.textTitle}>Let's Get Started</Text>
                <Text style={[styles.textBody, {margin:10}]}>Create a house to manage</Text>
                <Input name="House name" icon="user" onChangeText={text => setHName(text)} />
                <Input name="Description" icon="comment" onChangeText={text => setDesc(text)} />
                </View>
            <KeyboardAvoidingView style={[styles.container, {marginHorizontal:30}]}>
                <Input name="Search partners here..."  icon = "search" onChangeText={handlePartnersSearch} />
            </KeyboardAvoidingView>
            <View>
            {partnersList &&
                    partnersList
                    .slice(0, 5)
                        //.map((item) =>
                        .map((l, i) => 
                        (
                            <ListItem key={i} bottomDivider topDivider Component={TouchableScale}
                            friction={90} //
                            tension={100} // These props are passed to the parent component (here TouchableScale)
                            activeScale={0.95}
                            onPress={() => {setPartners([...hPartners,l]); setPartnersList(firebase.arrayRemove(partnersList,l))}}
                            >
                                <ListItem.Content>
                                <ListItem.Title style={styles.listTextItem} >{l.fName + " " + l.lName}</ListItem.Title>
                                <ListItem.Subtitle style={styles.listSubtitleTextItem}>{l.email}</ListItem.Subtitle>
                                </ListItem.Content>
                                <Avatar source={{uri: l.uImage}} rounded/>
                            </ListItem>
                        ))
                        // <Item key={item.guy} item={item}/>)
                    }
            </View>
            { hPartners.length != 0 &&
                <View>
                   <Divider  orientation="horizontal" width={1} style={{color: 'lightgrey' }}/>
                   <Text style={{alignSelf:'center', marginVertical:10, fontSize: 16}}>Your house partners are: </Text>
                </View>
            }
            <View>
            {hPartners &&
                    hPartners
                        .map((l, i) => 
                        (
                            <ListItem key={i} topDivider bottomDivider  Component={TouchableScale}
                            friction={90} //
                            tension={100} // These props are passed to the parent component (here TouchableScale)
                            activeScale={0.95}
                            onPress={() => {setPartners(firebase.arrayRemove(hPartners,l)); handlePartnersSearch(searchVal)}}
                            >
                                <ListItem.Content>
                                <ListItem.Title style={styles.listTextItem} >{l.fName + " " + l.lName}</ListItem.Title>
                                <ListItem.Subtitle style={styles.listSubtitleTextItem}>{l.email}</ListItem.Subtitle>
                                </ListItem.Content>
                                <Avatar source={{uri: l.uImage}} rounded />
                            </ListItem>
                        ))
                    }
            </View>
            { hPartners.length != 0 &&
                <View>
                    <Text style={{alignSelf:'center', marginVertical:10 }}>Press each partner to remove</Text>
                    <Divider  orientation="horizontal" width={1} style={{color: 'lightgrey' }}/>
                </View>
            }
            <View style={styles.container}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        title="Create"
                        onPress={handleCreateHouse}
                        style={styles.button}
                        >
                        <Text style={styles.buttonText}>Create</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

export default CreateNewHouseScreen