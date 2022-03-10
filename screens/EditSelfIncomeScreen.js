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

const EditSelfIncomeScreen = ({route}) => {
    const navigation = useNavigation()
    const [user, setUser] = useState([]);

    let [catchPayslipsImages, setPayslipsCatchImage] = useState([]);
    const [hImage, setImage] = useState('');

    const [company, setCompany] = useState('');
    const [desc, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [incomeType, setIncomeType] = useState("Income type");


    const income = route.params.income;

    useEffect(() => {
        firebase.getByDocIdFromFirestore("users", firebase.auth.currentUser?.email).then( (us) => { setUser(us)} )    // before opening the page
        setPayslipsCatchImage(income.payslips)
        setIncomeType(income.incomeType)
        setCompany(income.company)
        setDescription(income.desc)
        setAmount(income.amount)
        if(!("date" in income))
            alert(income.desc)
      }, [])

    const addImage = async (from,index) => {
        let _image = await cloudinary.addDocImage()
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

    const handleCreateIncome = () => {
        if(incomeType == "Icome type") alert("Sorry, Billing type is the title... ")
        else if (isNaN(amount)) alert("Sorry, Amount should be a number !" + amount)
        else if(company && desc && amount){
            firebase.addUserSelfIncome(user.email,user.incomes , {date:("date" in income)?income.date.toDate():new Date(),partner:user.email,company: company, desc: desc, amount: amount, incomeType: incomeType, payslips: catchPayslipsImages}).then(()=>{
            if(!("date" in income)) 
                firebase.updateCollectAtFirestore("houses", hKey, "shoppingList", [])
            })
            navigation.replace("UserProfileScreen")
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
                    firebase.removeUserSelfIncome(user.email,user.incomes,income).then(navigation.replace("UserProfileScreen"))
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
            {("date" in income) && 
            <View style={TodoSheet.trash}>
                <TouchableOpacity style={{margin:25} } onPress={handleDeleteExpenditure} >
                    <Icon name="trash"  type="ionicon"/>
                </TouchableOpacity>
            </View>}

            {/* <UploadProfileImage tempImage = {require('../assets/add_house.png')} image = {hImage} onPress={addImage} changeable={true}/> */}

            <View style={[styles.container]}>
            {/* <View style={[styles.container, {marginTop:200,marginHorizontal:15}]}> */}

                {("date" in income) ? 
                <Text style={[styles.textTitle, {marginBottom:20}]}>Edit Self Income</Text> 
                : <Text style={[styles.textTitle, {marginBottom:20}]}>Add Shopping List As Expenditure</Text> }
                <Input name="Company" icon="building" value={company?company:""} onChangeText={text => setCompany(text)} />
                <Input name="Description" icon="comment" value={desc?desc:""} onChangeText={text => setDescription(text)} />
                <Input name="Amount" icon="money" value={amount?amount:""} onChangeText={text => setAmount(text)} keyboardType="decimal-pad" />
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
                        title="Update"
                        onPress={handleCreateIncome}
                        style={styles.button}
                        >
                        <Text style={styles.buttonText}>Update</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

export default EditSelfIncomeScreen