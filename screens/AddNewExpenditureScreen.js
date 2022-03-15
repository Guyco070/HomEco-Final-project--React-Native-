import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Text, View,Image,ScrollView, TouchableOpacity, Picker, LogBox, Modal, Pressable} from 'react-native';
import * as firebase from '../firebase'
import * as cloudinary from '../Cloudinary'
import Input from '../components/Inputs';
import { styles, houseProfileStyles, docImageUploaderStyles,modelContent } from '../styleSheet'
import * as ImagePicker from 'expo-image-picker';
import UploadDocumentImage from '../components/UploadDocumentImage';
import { ListItem, Avatar } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale'; 
import { Divider } from 'react-native-elements/dist/divider/Divider';
import { color } from 'react-native-reanimated';
import UploadProfileImage from '../components/UploadProfileImage';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { Ionicons ,Entypo} from '@expo/vector-icons';

//import LinearGradient from 'react-native-linear-gradient'; // Only if no expo

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state.',
   ]);

const AddNewExpenditureScreen = ({route}) => {
    const navigation = useNavigation()
    const [user, setUser] = useState([]);
    const [modalOpen, setModalOpen] = useState(false)
    let [catchInvoImages, setInvoCatchImage] = useState([]);
    let [catchContractImages, setContractCatchImage] = useState([]);
    const [hImage, setImage] = useState('');

    const [company, setCompany] = useState('');
    const [desc, setDescription] = useState('');
    const [descIcon, setDescriptionIcon] = useState('home');
    const [amount, setAmount] = useState('');
    const [billingType, setBillingType] = useState("Billing type");

    const house = route.params;


    useEffect(() => {
        firebase.getByDocIdFromFirestore("users", firebase.auth.currentUser?.email).then( (us) => { setUser(us)} )    // before opening the page
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
    const handleAddDescription = (desc) => {
        setModalOpen(false);
        setDescription(desc);
        console.log(desc);

        };
    const handleCreateExpend = () => {
        if(billingType == "Billing type") alert("Sorry, Billing type is the title... ")
        else if (isNaN(amount)) alert("Sorry, Amount should be a number !" + amount)
        else if(company && desc && amount){
            firebase.addExpendToHouse(house.hName,house.cEmail,house.expends , {date: new Date(),partner:user.email,company: company, desc: desc, amount: amount, billingType: billingType, invoices: catchInvoImages, contracts: catchContractImages})
            navigation.replace("HouseProfile",{hKeyP: firebase.getHouseKeyByNameAndCreatorEmail(house.hName,house.cEmail)})
        }else alert("Sorry, you must fill in all the fields!")
    }

    return (
        <ScrollView style={{backgroundColor: 'white'}}>
            {/* <UploadProfileImage tempImage = {require('../assets/add_house.png')} image = {hImage} onPress={addImage} changeable={true}/> */}

            <View style={[styles.container,{backgroundColor: modalOpen?'rgba(52, 52, 52, 0.8)':'white'}]}>
            {/* <View style={[styles.container, {marginTop:200,marginHorizontal:15}]}> */}
                <Text style={[styles.textTitle, {marginBottom:20}]}>Add New Expenditure</Text> 
                <Input name="Company" icon="building" onChangeText={text => setCompany(text)} />
                <Input name="Amount" icon="money" onChangeText={text => setAmount(text)} keyboardType="decimal-pad" />
           
                        <TouchableOpacity
                                    title="Home"
                                    leftIcon="Home"
                                    onPress={() => setModalOpen(true)}
                                    style={[modelContent.button,{marginBottom:0}]}
                                    >
                                        <Ionicons 
                                            name={descIcon}
                                            size={20}
                                            color={'#0782F9'}
                                            style={{top:10}}
                                            />
                                    <Text style={{top:37,margin:1}}>{desc}</Text>
                                </TouchableOpacity>
   
                <Picker
                    selectedValue={billingType}
                    style={{ height: 130, width: "50%",marginTop:10}}
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
                <View style = {modelContent.centeredView}> 
                    <Modal visible={modalOpen}
                            animationType="slide"
                            transparent={true}
                            >
                            <View style = {modelContent.modalView}>
                                <View style={[modelContent.modalRowView,{paddingTop:40,}]}>
                                    <TouchableOpacity
                                        title="Home"
                                        leftIcon="Home"
                                        onPress={() => {handleAddDescription("Home"); setDescriptionIcon("home")}}
                                        style={modelContent.button}
                                        >
                                            <Ionicons 
                                                name={"home"}
                                                size={20}
                                                color={'#0782F9'}
                                                style={{top:10}}
                                                />
                                        <Text style={{top:37,margin:1}}>Home</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        title="Food"
                                        onPress={() => {handleAddDescription("Food"); setDescriptionIcon("md-fast-food")}}
                                        style={modelContent.button}
                                        >
                                            <Ionicons 
                                                name="md-fast-food"
                                                size={20}
                                                color={'#0782F9'}
                                                style={{top:10}}
                                                />
                                        <Text style={{top:37,margin:1}}>Food</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        title="Car"
                                        onPress={() => {handleAddDescription("Car"); setDescriptionIcon("car")}}
                                        style={modelContent.button}
                                        >
                                            <Ionicons 
                                                name={"car"}
                                                size={20}
                                                color={'#0782F9'}  
                                                style={{top:10}}
                                                />
                                        <Text style={{top:37,margin:1}}>Car</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        title="Travel"
                                        onPress={() => {handleAddDescription("Travel"); setDescriptionIcon("aircraft")}}
                                        style={modelContent.button}
                                        >
                                            <Entypo 
                                                name={"aircraft"}
                                                size={20}
                                                color={'#0782F9'}
                                                style={{top:10}}
                                                />
                                        <Text style={{top:37,margin:1}}>Travel</Text>
                                    </TouchableOpacity>
                                    </View>

                                <View style={[modelContent.modalRowView,{margin:0, height:0}]}>
                                    <TouchableOpacity
                                        title="Home"
                                        leftIcon="Home"
                                        onPress={() => {handleAddDescription("Home"); setDescriptionIcon("home")}}
                                        style={modelContent.button}
                                        >
                                            <Ionicons 
                                                name={"home"}
                                                size={20}
                                                color={'#0782F9'}
                                                style={{top:10}}
                                                />
                                        <Text style={{top:37,margin:1}}>Home</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        title="Food"
                                        onPress={() => {handleAddDescription("Food"); setDescriptionIcon("md-fast-food")}}
                                        style={modelContent.button}
                                        >
                                            <Ionicons 
                                                name="md-fast-food"
                                                size={20}
                                                color={'#0782F9'}
                                                style={{top:10}}
                                                />
                                        <Text style={{top:37,margin:1}}>Food</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        title="Car"
                                        onPress={() => {handleAddDescription("Car"); setDescriptionIcon("car")}}
                                        style={modelContent.button}
                                        >
                                            <Ionicons 
                                                name={"car"}
                                                size={20}
                                                color={'#0782F9'}  
                                                style={{top:10}}
                                                />
                                        <Text style={{top:37,margin:1}}>Car</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        title="Travel"
                                        onPress={() => {handleAddDescription("Travel"); setDescriptionIcon("aircraft")}}
                                        style={modelContent.button}
                                        >
                                            <Entypo 
                                                name={"aircraft"}
                                                size={20}
                                                color={'#0782F9'}
                                                style={{top:10}}
                                                />
                                        <Text style={{top:37,margin:1}}>Other</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                    </Modal>
                </View>
                <View style={{ marginTop: 100, height: 440 }}>
                    <Text style = {houseProfileStyles.textWithButDivider}>
                        <Text style={{ fontWeight: "400" }}>{"Invoices: "}</Text>
                    </Text>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{height: 70}} >
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
                    
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{height: 30}}>
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
            <View style={[styles.container,{marginTop: 5}]}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        title="Create"
                        onPress={handleCreateExpend}
                        style={styles.button}
                        >
                        <Text style={styles.buttonText}>Create</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

export default AddNewExpenditureScreen