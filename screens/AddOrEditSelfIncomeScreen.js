import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Text, View,Image,ScrollView, TouchableOpacity, Picker, LogBox,Modal, Alert } from 'react-native';
import * as firebase from '../firebase'
import * as cloudinary from '../Cloudinary'
import Input from '../components/Inputs';
import { styles, houseProfileStyles, docImageUploaderStyles,modelContent, TodoSheet } from '../styleSheet'
import * as ImagePicker from 'expo-image-picker';
import UploadDocumentImage from '../components/UploadDocumentImage';
import { ListItem, Avatar } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale'; 
import { Divider } from 'react-native-elements/dist/divider/Divider';
import { color } from 'react-native-reanimated';
import UploadProfileImage from '../components/UploadProfileImage';
import { Icon } from 'react-native-elements'
import { Ionicons ,Foundation,FontAwesome5,FontAwesome} from '@expo/vector-icons';
import ImagePickerModal from '../components/ImagePickerModal';
//import LinearGradient from 'react-native-linear-gradient'; // Only if no expo

LogBox.ignoreAllLogs(true)
LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state.',
   ]);

const AddOrEditSelfIncomeScreen = ({route}) => {
    const navigation = useNavigation()
    const [user, setUser] = useState([]);
    const [modalOpen, setModalOpen] = useState(false)
    
    let [catchPayslipsImages, setPayslipsCatchImage] = useState([]);

    const [descIcon, setDescriptionIcon] = useState('cash-outline');
    const [hImage, setImage] = useState('');
    const [company, setCompany] = useState('');
    const [desc, setDescription] = useState('Salary');
    const [descOptional, setDescriptionOptional] = useState('');
    const [amount, setAmount] = useState('');
    const [incomeType, setIncomeType] = useState("Income type");

    const [indexOfImage, setIndexOfImage] = useState(-2);
    const [imageModalPickerVisable, setImageModalPickerVisable] = useState(false);

    const income = route ? route?.params?.income : undefined

    useEffect(() => {
        firebase.getByDocIdFromFirestore("users", firebase.auth.currentUser?.email).then( (us) => { setUser(us)} )    // before opening the page 
        if(income){
            setPayslipsCatchImage(income.payslips)
            setIncomeType(income.incomeType)
            setCompany(income.company)
            setDescription(income.desc)
            setAmount(income.amount)
            setDescriptionOptional(income?.descOptional)
            if(!("date" in income))
                alert(income.desc)
        }
    }, [])

    useEffect(() => {
        if(indexOfImage !== -2)
            setImageModalPickerVisable(true)
      }, [indexOfImage])

      useEffect(() => {
        if(!imageModalPickerVisable && indexOfImage !== -2){ setIndexOfImage(-2); }
      }, [imageModalPickerVisable])

    const addImage = async (openWith,from,index) => {
        let _image = openWith === "camera" ? await  cloudinary.takeDocPhotoFromCamera() : await cloudinary.addDocImageFromLibrary()
          if (!_image.cancelled) {
            setImageModalPickerVisable(false)
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

    const onRemove = async (index) => {
        const tempCatchPayslipsImages = []
        let i = 0
        for(let key in catchPayslipsImages) {
            if(index != key) {
                tempCatchPayslipsImages[i] = catchPayslipsImages[key]
            }
        }
        setPayslipsCatchImage([...tempCatchPayslipsImages])
    } 
    
    const handleAddDescription = (desc) => {
        setModalOpen(false);
        setDescription(desc);
    };

    const handleCreateIncome = () => {
        if(incomeType == "Income type") alert("Sorry, Income type is the title... ")
        else if (isNaN(amount)) alert("Sorry, Amount should be a number !" + amount)
        else if(company && desc && amount){
            console.log("income", income)
            firebase.addUserSelfIncome(user.email,user.incomes , {date: (income && ("date" in income))?income.date.toDate():new Date(),partner:user.email,company: company, desc: desc, amount: amount, incomeType: incomeType, payslips: catchPayslipsImages, descOptional})
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
            {imageModalPickerVisable && <ImagePickerModal imageModalPickerVisable={imageModalPickerVisable} setImageModalPickerVisable={setImageModalPickerVisable} addImage={addImage} index={indexOfImage} from={'payslip'}/> }
            {/* <UploadProfileImage tempImage = {require('../assets/add_house.png')} image = {hImage} onPress={addImage} changeable={true}/> */}
            { (income && ("date" in income)) && 
            <View style={TodoSheet.trash}>
                <TouchableOpacity style={{margin:25} } onPress={handleDeleteExpenditure} >
                    <Icon name="trash"  type="ionicon"/>
                </TouchableOpacity>
            </View>
            }
            <View style={[styles.container]}>
            {/* <View style={[styles.container, {marginTop:200,marginHorizontal:15}]}> */}
                { !income ? <Text style={[styles.textTitle, {marginBottom:20}]}>Add New Self Income</Text> 
                : <Text style={[styles.textTitle, {marginBottom:20}]}>Edit Self Income</Text> } 
                <Input name="Company" icon="building" value={company?company:""} onChangeText={text => setCompany(text)} />
                <Input name="Description" icon="building" value={descOptional?descOptional:""} onChangeText={text => setDescriptionOptional(text)} />
                <Input name="Amount" icon="money" value={amount?amount:""} onChangeText={text => setAmount(text)} keyboardType="decimal-pad" />
               
                <TouchableOpacity
                    title="Home"
                    leftIcon="Home"
                    onPress={() => setModalOpen(true)}
                    style={[modelContent.button,{marginBottom:10}]}
                    >
                        <Icon 
                            name={descIcon}
                            size={20}
                            color={'#0782F9'}
                            style={{justifyContent:'center', marginTop: 18}}
                            type={descIcon != "bank" ? "ionicon" : "font-awesome"}
                            />
                    <Text style={{top:37,margin:1,fontSize:12}}>{desc}</Text>
                </TouchableOpacity>
                <View style={{ width: "55%",justifyContent:'center',marginTop: 50}}>
                <Picker
                    selectedValue={incomeType}
                    onValueChange={(incomeType, itemIndex) => { setIncomeType(incomeType) }}
                >
                    <Picker.Item label="       - Income type -" value="Income type"/>
                    <Picker.Item label="       One-time" value="One-time"/>
                    <Picker.Item label="       Weekly" value="Weekly"/>
                    <Picker.Item label="       Fortnightly" value="Fortnightly"/>
                    <Picker.Item label="       Monthly" value="Monthly" />
                    <Picker.Item label="       Bi-monthly" value="Bi-monthly" />
                    <Picker.Item label="       Annual" value="Annual" />
                    <Picker.Item label="       Biennial" value="Biennial" />
                </Picker>
                </View>
                <View style = {modelContent.centeredView}> 
                    <Modal visible={modalOpen}
                            animationType="slide"
                            transparent={true}
                            >
                            <View style = {[modelContent.modalView, {top:100, borderWidth:1}]}>
                            <TouchableOpacity
                                        title="Home"
                                        leftIcon="Home" 
                                        onPress={() => {handleAddDescription(desc); }}
                                        style={{alignSelf: 'flex-end', margin:10}}
                                        >
                                            <Ionicons 
                                                name={"close"}
                                                size={20}
                                                color={'#0782F9'}
                                                style={{top:10}}
                                                />
                                    </TouchableOpacity>
                                <View style={[modelContent.modalRowView,{paddingTop:85,}]}>
                                    <TouchableOpacity
                                                title="Gift"
                                                leftIcon="Gift"
                                                onPress={() => {handleAddDescription("Gift"); setDescriptionIcon("gift-outline")}}
                                                style={modelContent.chooseButton}
                                                >
                                                    <Ionicons 
                                                        name={"gift-outline"}
                                                        size={20}
                                                        color={'#0782F9'}
                                                        style={{top:10}}
                                                        />
                                                        
                                                <Text style={{top:37,margin:1,fontSize:12}}>Gift</Text>
                                            </TouchableOpacity>
                                        <TouchableOpacity
                                            title="Business"
                                            leftIcon="Business"
                                            onPress={() => {handleAddDescription("Business"); setDescriptionIcon("business-outline")}}
                                            style={modelContent.chooseButton}
                                            >
                                                <Ionicons 
                                                    name={"business-outline"}
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
                                            style={modelContent.chooseButton}
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
                                            onPress={() => {handleAddDescription("Salary"); setDescriptionIcon("cash-outline")}}
                                            style={modelContent.chooseButton}
                                            >
                                                <Ionicons
                                                    name={"cash-outline"}
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
                                <UploadDocumentImage tempImage = {require('../assets/invoicing_icon.png')} image={val} onPress={() => { setIndexOfImage(index);}} onRemove={() => onRemove(index)} changeable={true} navigation={navigation}/>
                            </View>
                            ))
                        }
                        <View style={docImageUploaderStyles.mediaImageContainer}>    
                            <UploadDocumentImage tempImage = {require('../assets/invoicing_icon.png')} onPress={() => { setIndexOfImage(-1);}} onRemove={-1} changeable={true} navigation={navigation}/>
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
                        { income ? <Text style={styles.buttonText}>Update</Text> : <Text style={styles.buttonText}>Create</Text>}
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

export default AddOrEditSelfIncomeScreen