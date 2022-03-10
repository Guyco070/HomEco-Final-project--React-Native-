import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Text, View,Image,ScrollView, TouchableOpacity, Picker, LogBox, Alert } from 'react-native';
import * as firebase from '../firebase'
import * as cloudinary from '../Cloudinary'
import Input from '../components/Inputs';
import { styles, houseProfileStyles, docImageUploaderStyles, TodoSheet } from '../styleSheet'
import * as ImagePicker from 'expo-image-picker';
import UploadDocumentImage from '../components/UploadDocumentImage';
import { ListItem, Avatar } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale'; 
import { Divider } from 'react-native-elements/dist/divider/Divider';
import { color } from 'react-native-reanimated';
import UploadProfileImage from '../components/UploadProfileImage';
import { Icon } from 'react-native-elements/dist/icons/Icon';

//import LinearGradient from 'react-native-linear-gradient'; // Only if no expo

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state.',
   ]);

const EditExpenditureScreen = ({route}) => {
    const navigation = useNavigation()
    const [user, setUser] = useState([]);

    let [catchInvoImages, setInvoCatchImage] = useState([]);
    let [catchContractImages, setContractCatchImage] = useState([]);
    const [hImage, setImage] = useState('');

    const [company, setCompany] = useState('');
    const [desc, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [house, setHouse] = useState('');
    const [billingType, setBillingType] = useState("Billing type");


    const exp = route.params.exp;
    const hKey = route.params.hKey;


    useEffect(() => {
        firebase.getByDocIdFromFirestore("users", firebase.auth.currentUser?.email).then( (us) => { setUser(us)} )    // before opening the page
        firebase.getByDocIdFromFirestore("houses",hKey).then((house)=> {setHouse(house); }).catch((e) =>{})
        setInvoCatchImage(exp.invoices)
        setContractCatchImage(exp.contracts)
        setBillingType(exp.billingType)
        setCompany(exp.company)
        setDescription(exp.desc)
        setAmount(exp.amount)
        if(!("date" in exp))
            alert(exp.desc)
      }, [])

    const addImage = async (from,index) => {
        let _image = await cloudinary.addDocImage()
          if (!_image.cancelled) {
            setImage(_image.uri);

            console.log("index = " + index)

            if(index==-1){
                if(from == 'invoice')
                    cloudinary.uploadImageToCloudinary("invoice",_image).then((url)=>{ setInvoCatchImage([...catchInvoImages, url]); }).catch((e) => alert(e.message))
                else if(from == 'contract')
                    cloudinary.uploadImageToCloudinary("contract",_image).then((url)=>{ setContractCatchImage([...catchContractImages, url]); }).catch((e) => alert(e.message))
            }
            else{
                if(from == 'invoice')
                    cloudinary.uploadImageToCloudinary("invoice",_image).then((url)=>{  catchInvoImages[index] = url; setInvoCatchImage([...catchInvoImages]); }).catch((e) => alert(e.message))
                else if(from == 'contract')
                    cloudinary.uploadImageToCloudinary("contract",_image).then((url)=>{ catchContractImages[index] = url; setContractCatchImage([...catchContractImages]); }).catch((e) => alert(e.message))
            }
        }
    }

    const handleAddButtonClick = () => {
        };

    const handleCreateExpend = () => {
        if(billingType == "Billing type") alert("Sorry, Billing type is the title... ")
        else if (isNaN(amount)) alert("Sorry, Amount should be a number !" + amount)
        else if(company && desc && amount){
            firebase.addExpendToHouse(house.hName,house.cEmail,house.expends , {date:("date" in exp)?exp.date.toDate():new Date(),partner:user.email,company: company, desc: desc, amount: amount, billingType: billingType, invoices: catchInvoImages, contracts: catchContractImages}).then(()=>{
            if(!("date" in exp)) 
                firebase.updateCollectAtFirestore("houses", hKey, "shoppingList", [])
            })
            navigation.replace("HouseProfile",{hKeyP:hKey})
        }else alert("Sorry, you must fill in all the fields!")
    }

    const handleDeleteExpenditure = () => {
        Alert.alert(
            "Are your sure?",
            "Are you sure you want to remove this beautiful box?",
            [
              // The "Yes" button
              {
                text: "Yes",
                onPress: () => {
                    firebase.removeExpendFromHouse(house.hName,house.cEmail,house.expends,exp).then(navigation.replace("HouseProfile",{hKeyP:hKey}))
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

    return (
        <ScrollView style={{backgroundColor: 'white'}}>
            {("date" in exp) &&
            <View style={TodoSheet.trash}>
                <TouchableOpacity style={{margin:25} } onPress={handleDeleteExpenditure} >
                    <Icon name="trash"  type="ionicon"/>
                </TouchableOpacity>
            </View>}

            {/* <UploadProfileImage tempImage = {require('../assets/add_house.png')} image = {hImage} onPress={addImage} changeable={true}/> */}

            <View style={[styles.container]}>
            {/* <View style={[styles.container, {marginTop:200,marginHorizontal:15}]}> */}

                {/* \n alowed to insert vakue to company input but make big deviding between invoices and contracts - fix*/}
                {("date" in exp) ? 
                <Text style={[styles.textTitle, {marginBottom:20}]}>{"\n\n\n\n\n\n\n\n\n\n\n\n\n"}Edit Expenditure</Text> 
                : <Text style={[styles.textTitle, {marginBottom:20}]}>{"\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"}Add Shopping List As Expenditure</Text> }
                <Input name="Company" icon="building" value={company?company:""} onChangeText={text => setCompany(text)} />
                <Input name="Description" icon="comment" value={desc?desc:""} onChangeText={text => setDescription(text)} />
                <Input name="Amount" icon="money" value={amount?amount:""} onChangeText={text => setAmount(text)} keyboardType="decimal-pad" />
                <Picker
                    selectedValue={billingType}
                    style={{ height: 50, width: 150}}
                    onValueChange={(billingType, itemIndex) => { setBillingType(billingType) }}
                >
                    <Picker.Item label="Billing type" value="Billing type"/>
                    <Picker.Item label="One-time" value="One-time"/>
                    <Picker.Item label="Weekly" value="Weekly"/>
                    <Picker.Item label="Fortnightly" value="Fortnightly"/>
                    <Picker.Item label="Monthly" value="Monthly" />
                    <Picker.Item label="Bi-monthly" value="Bi-monthly" />
                    <Picker.Item label="Annual" value="Annual" />
                    <Picker.Item label="Biennial" value="Biennial" />
                </Picker>

                <View style={{ marginTop: 32 }}>
                    <Text style = {houseProfileStyles.textWithButDivider}>
                        <Text style={{ fontWeight: "400" }}>{"Invoices: "}</Text>
                    </Text>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{height: 20}} >
                    {
                        catchInvoImages.map((val, index) => ( 
                            <View style={docImageUploaderStyles.mediaImageContainer}>
                                <UploadDocumentImage tempImage = {require('../assets/invoicing_icon.png')} image={val} onPress={() => addImage('invoice',index)} changeable={true} navigation={navigation}/>
                                {console.log(index)}
                            </View>
                            ))
                        }
                        <View style={docImageUploaderStyles.mediaImageContainer}>    
                            <UploadDocumentImage tempImage = {require('../assets/invoicing_icon.png')} onPress={() => addImage('invoice',-1)} changeable={true} navigation={navigation}/>
                        </View>
                
                        { /* add button */ }
                        {/*  <View style={docImageUploaderStyles.mediaImageContainer} >
                            <TouchableOpacity style={{paddingVertical:75,alignItems:'center'}} onPress={() => handleAddButtonClick()} >
                                <Icon style={{alignSelf:'center',height:150}} name="add-outline"  type="ionicon" color={"grey"} size={60}/>
                            </TouchableOpacity>
                        </View> */}
                    </ScrollView>
                    {/* <View style={houseProfileStyles.mediaCount}>
                        <Text style={[houseProfileStyles.text, { fontSize: 24, color: "#DFD8C8", fontWeight: "300" }]}>70</Text>
                        <Text style={[houseProfileStyles.text, { fontSize: 12, color: "#DFD8C8", textTransform: "uppercase" }]}>Media</Text>
                    </View> */}

                    <Text style = {houseProfileStyles.textWithButDivider}>
                        <Text style={{ fontWeight: "400" }}>{"Warranty / contract: "}</Text>
                    </Text>
                    
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{height: 150}}>
                        {catchContractImages.map((val, index) => ( 
                            <View style={docImageUploaderStyles.mediaImageContainer}>
                                <UploadDocumentImage tempImage = {require('../assets/contract_icon.png')} image={val} onPress={() => addImage('contract',index)} changeable={true} navigation={navigation}/>
                            </View>
                            ))
                        }
                        <View style={docImageUploaderStyles.mediaImageContainer}>    
                            <UploadDocumentImage tempImage = {require('../assets/contract_icon.png')} onPress={() => addImage('contract',-1)} changeable={true} navigation={navigation}/>
                        </View>

                    </ScrollView>
                    {/* <View style={houseProfileStyles.mediaCount}>
                        <Text style={[houseProfileStyles.text, { fontSize: 24, color: "#DFD8C8", fontWeight: "300" }]}>70</Text>
                        <Text style={[houseProfileStyles.text, { fontSize: 12, color: "#DFD8C8", textTransform: "uppercase" }]}>Media</Text>
                    </View> */}
                </View> 

                </View>
            <View style={[styles.container,{marginTop: 55}]}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        title="Update"
                        onPress={handleCreateExpend}
                        style={styles.button}
                        >
                        {("date" in exp)?
                            <Text style={styles.buttonText}>Update</Text>:
                            <Text style={styles.buttonText}>Create</Text>
                        }
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

export default EditExpenditureScreen