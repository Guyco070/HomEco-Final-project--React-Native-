import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Text, View,Image,ScrollView, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native';
import * as firebase from '../firebase'
import * as cloudinary from '../Cloudinary'
import Input from '../components/Inputs';
import { styles, TodoSheet } from '../styleSheet'
import * as ImagePicker from 'expo-image-picker';
import UploadProfileImage from '../components/UploadProfileImage';
import { ListItem, Avatar } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale'; 
import { Divider } from 'react-native-elements/dist/divider/Divider';
import { set } from 'react-native-reanimated';
import Loading from '../components/Loading';
import { Icon } from 'react-native-elements/dist/icons/Icon';


//import LinearGradient from 'react-native-linear-gradient'; // Only if no expo



const EditHouseProfileScreen =({route}) => {
    const navigation = useNavigation()
    const [user, setUser] = useState([]);

    const [searchVal, setSearch] = useState('');

    const [catchImage, setCatchImage] = useState('');
    const [hImage, setImage] = useState('');
    const [hName, setHName] = useState('');
    const [newHName, setNewHName] = useState('');
    const [hPartners, setPartners] = useState([]);
    const [oldHPartners, setOldHPartners] = useState([]);
    const [partnersList, setPartnersList] = useState([]);
    const [desc, setDesc] = useState('');
    const [hKey, setHKey] = useState('');

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        firebase.getByDocIdFromFirestore("users", firebase.auth.currentUser?.email).then( (us) => { setUser(us)} )    // before opening the page
      }, [])

      useEffect(() => {
        const house = route.params
        setImage(house.hImage)
        setHName(house.hName)
        setNewHName(house.hName)
        setDesc(house.description)
        setHKey(firebase.getHouseKeyByNameAndCreatorEmail(house.hName,house.cEmail))
        firebase.getUserArrayFromPartnersDict(route.params["partners"])
        .then(arr => {setPartners(arr); setOldHPartners(arr)})
    }, [route])

    

    useEffect(() =>
    {
        setLoading(false)
    },[partnersList] )

      const addImage = async () => {
        let _image = await cloudinary.addImage()
          if (!_image.cancelled) {
            setImage(_image.uri);
            cloudinary.uploadImageToCloudinary("houses",_image).then((url)=>{ setCatchImage(url); }).catch((e) => alert(e.message))
          }
        }
    
    const handleDeleteHouse = () => {
        Alert.alert(
            "Are your sure?",
            "Are you sure you want to remove this beautiful box?",
            [
              // The "Yes" button
              {
                text: "Yes",
                onPress: () => {
                    firebase.deleteRowFromFirestore("houses", hKey).then(navigation.replace("Home"))
                },
              },
              // The "No" button
              // Does nothing but dismiss the dialog when tapped
              {
                text: "No",
              },
            ]
          );
    }

    const handleUpdateHouse = () => {
        // TODO: for hName upddate the key need to change and we need to set permisions has they ware for partners whose already been ther and set default to new partners (using oldHPartners)
        if(newHName != '' && newHName != hName)
        {
           handleUpdateHouseName() 
           setHKey(firebase.getHouseKeyByNameAndCreatorEmail(newHName,route.params["cEmail"]))
        }
        else{
            firebase.updateDocAllColsAtFirestore("houses",hKey,{hImage:catchImage, description: desc, partners: firebase.updateHousePartners(hPartners, oldHPartners)})
        }
        navigation.replace("HouseProfile",{hKeyP: hKey})
    }

    const handleUpdateHouseName = () => {
        firebase.getByDocIdFromFirestore("houses",firebase.getHouseKeyByNameAndCreatorEmail(newHName,user["email"]))
        .then((house) => {
            if(house)
                alert("You have already created a house named \"" + newHName + "\".\nPlease select another name.\nThanks!")
            else {
                firebase.getByDocIdFromFirestore("houses",hKey)
                .then((house) => {
                    firebase.replaceUpdatedHouseToFirestore(house ,newHName , hPartners, catchImage, desc)
                    .then((createdHouse) =>{
                        firebase.deleteRowFromFirestore("houses",hKey)
                        navigation.replace("HouseProfile",{hKeyP:firebase.getHouseKeyByNameAndCreatorEmail(newHName,house.cEmail)})
                    }
                    ).catch(error => alert(error.message));
                }).catch(error => alert(error.message))
                .catch(error => alert(error.message))
            }
        })
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
            <View style={TodoSheet.trash}>
                <TouchableOpacity style={{marginHorizontal:25} } onPress={handleDeleteHouse} >
                    <Icon name="trash"  type="ionicon"/>
                </TouchableOpacity>
            </View>
            {loading? <Loading/> : <View>
            <UploadProfileImage tempImage = {require('../assets/add_house.png')} image = {hImage} onPress={addImage} changeable={true}/>

            <View style={[styles.container, {marginTop:30,marginHorizontal:30}]}>
                <Text style={styles.textTitle}>Let's Get Started</Text>
                <Text style={[styles.textBody, {margin:10}]}>Create a house to manage</Text>
                <Input name="House name" value={hName?newHName:""} icon="user" onChangeText={text => {setNewHName(text);}} />
                <Input name={"Description"} value={desc?desc:""} icon="comment" onChangeText={text => setDesc(text)} />
                </View>
            <KeyboardAvoidingView style={[styles.container, {marginHorizontal:30,marginTop:20}]}>
                <Input name="Search partners here..."  icon = "search" onChangeText={handlePartnersSearch} />
            </KeyboardAvoidingView>
            <View>
            {partnersList &&
                    partnersList
                    .slice(0, 5)
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
                        .map((l,i) => 
                        (
                            l.email != user["email"] &&
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
                        title="Save"
                        onPress={handleUpdateHouse}
                        style={styles.button}
                        >
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
            </View>
            }
        </ScrollView>
    )
}

export default EditHouseProfileScreen