import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Text, View,Image,ScrollView, TouchableOpacity, Picker, LogBox,Modal } from 'react-native';
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
import { Ionicons ,Foundation,FontAwesome5,FontAwesome} from '@expo/vector-icons';
//import LinearGradient from 'react-native-linear-gradient'; // Only if no expo

LogBox.ignoreAllLogs(true)
LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state.',
   ]);

const AddNewSelfIncomeScreen = () => {
    const navigation = useNavigation()
    const [user, setUser] = useState([]);
    const [modalOpen, setModalOpen] = useState(false)
    let [catchPayslipsImages, setPayslipsCatchImage] = useState([]);
    const [descIcon, setDescriptionIcon] = useState('money-bill-wave');
    const [hImage, setImage] = useState('');
    const [company, setCompany] = useState('');
    const [desc, setDescription] = useState('Salary');
    const [amount, setAmount] = useState('');
    const [incomeType, setIncomeType] = useState("Income type");


    useEffect(() => {
        firebase.getByDocIdFromFirestore("users", firebase.auth.currentUser?.email).then( (us) => { setUser(us)} )    // before opening the page 
    }, [])

    const addImage = async (from,index) => {
        let _image = await cloudinary.addDocImageFromLibrary()
          if (!_image.cancelled) {
            setImage(_image.uri);

            if(index==-1){
                if(from == 'payslip')
                    cloudinary.uploadImageToCloudinary("payslip",_image).then((url)=>{ setPayslipsCatchImage([...catchPayslipsImages, url]); }).catch((e) => alert(e.message))
            }
            else{
                if(from == 'payslip')
                    cloudinary.uploadImageToCloudinary("payslip",_image).then((url)=>{  catchPayslipsImages[index] = url; setPayslipsCatchImage([...catchPayslipsImages]); }).catch((e) => alert(e.message))
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

    const handleCreateIncome = () => {
        if(incomeType == "Icome type") alert("Sorry, Billing type is the title... ")
        else if (isNaN(amount)) alert("Sorry, Amount should be a number !" + amount)
        else if(company && desc && amount){
            firebase.addUserSelfIncome(user.email,user.incomes , {date: new Date(),partner:user.email,company: company, desc: desc, amount: amount, incomeType: incomeType, payslips: catchPayslipsImages})
            navigation.replace("UserProfileScreen")
        }else alert("Sorry, you must fill in all the fields!")
    }

    return (
        <ScrollView style={{backgroundColor: 'white'}}>
            {/* <UploadProfileImage tempImage = {require('../assets/add_house.png')} image = {hImage} onPress={addImage} changeable={true}/> */}

            <View style={[styles.container]}>
            {/* <View style={[styles.container, {marginTop:200,marginHorizontal:15}]}> */}
                <Text style={[styles.textTitle, {marginBottom:20}]}>Add New Self Income</Text> 
                <Input name="Company" icon="building" onChangeText={text => setCompany(text)} />
                <Input name="Amount" icon="money" onChangeText={text => setAmount(text)} keyboardType="decimal-pad" />
                <TouchableOpacity
                    title="Home"
                    leftIcon="Home"
                    onPress={() => setModalOpen(true)}
                    style={[modelContent.button,{marginBottom:0}]}
                    >
                        <FontAwesome5 
                            name={descIcon}
                            size={20}
                            color={'#0782F9'}
                            style={{top:10}}
                            />
                    <Text style={{top:37,margin:1,fontSize:12}}>{desc}</Text>
                </TouchableOpacity>
                <Picker
                    selectedValue={incomeType}
                    style={{ height: 50, width: 150}}
                    onValueChange={(incomeType, itemIndex) => { setIncomeType(incomeType) }}
                >
                    <Picker.Item label="Icome type" value="Icome type"/>
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
                                                title="Gift"
                                                leftIcon="Gift"
                                                onPress={() => {handleAddDescription("Gift"); setDescriptionIcon("gift-sharpft")}}
                                                style={modelContent.button}
                                                >
                                                    <Ionicons 
                                                        name={"gift-sharp"}
                                                        size={20}
                                                        color={'#0782F9'}
                                                        style={{top:10}}
                                                        />
                                                <Text style={{top:37,margin:1,fontSize:12}}>Gift</Text>
                                            </TouchableOpacity>
                                        <TouchableOpacity
                                            title="Business"
                                            leftIcon="Business"
                                            onPress={() => {handleAddDescription("Business"); setDescriptionIcon("torso-business")}}
                                            style={modelContent.button}
                                            >
                                                <Foundation 
                                                    name={"torso-business"}
                                                    size={20}
                                                    color={'#0782F9'}
                                                    style={{top:10}}
                                                    />
                                            <Text style={{top:37,margin:1,fontSize:12}}>Business</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            title="Loan"
                                            leftIcon="Loan"
                                            onPress={() => {handleAddDescription("Loan"); setDescriptionIcon("bank")}}
                                            style={modelContent.button}
                                            >
                                                <FontAwesome 
                                                    name={"bank"}
                                                    size={20}
                                                    color={'#0782F9'}
                                                    style={{top:10}}
                                                    />
                                            <Text style={{top:37,margin:1,fontSize:12}}>Loan</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            title="ExtraIncome"
                                            leftIcon="ExtraIncome"
                                            onPress={() => {handleAddDescription("Salary"); setDescriptionIcon("money-bill-wave")}}
                                            style={modelContent.button}
                                            >
                                                <FontAwesome5
                                                    name={"money-bill-wave"}
                                                    size={20}
                                                    color={'#0782F9'}
                                                    style={{top:10}}
                                                    />
                                            <Text style={{top:37,margin:1,fontSize:12}}>Salary</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                    </Modal>
                </View>
                <View style={{ marginTop: 32, height: 220 }}>
                    <Text style = {houseProfileStyles.textWithButDivider}>
                        <Text style={{ fontWeight: "400" }}>{"Payslips: "}</Text>
                    </Text>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{height: 0}} >
                    {
                        catchPayslipsImages.map((val, index) => ( 
                            <View style={docImageUploaderStyles.mediaImageContainer}>
                                <UploadDocumentImage tempImage = {require('../assets/invoicing_icon.png')} image={val} onPress={() => addImage('payslip',index)} changeable={true} navigation={navigation}/>
                            </View>
                            ))
                        }
                        <View style={docImageUploaderStyles.mediaImageContainer}>    
                            <UploadDocumentImage tempImage = {require('../assets/invoicing_icon.png')} onPress={() => addImage('payslip',-1)} changeable={true} navigation={navigation}/>
                        </View>

                    </ScrollView>
                </View> 
            </View>
            <View style={[styles.container]}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        title="Create"
                        onPress={handleCreateIncome}
                        style={styles.button}
                        >
                        <Text style={styles.buttonText}>Create</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

export default AddNewSelfIncomeScreen