import React, { useEffect,useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, LogBox } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as firebase from '../firebase'
import Loading from '../components/Loading';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { styles, houseProfileStyles } from '../styleSheet';
import { useNavigation } from '@react-navigation/native';
import RecentActivity from '../components/RecentActivity';
import ChangeSelfIncome from '../components/ChangeSelfIncome';
import Input from '../components/Inputs';
import BarcodeScanner from '../components/BarcodeScanner';
import { Button } from 'react-native-elements/dist/buttons/Button';
import TodoList from '../components/TodoList/TodoList';
import Toast from 'react-native-toast-message';


 
LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state.',
   ]);
    
const UserProfileScreen = ({route}) => {
    const navigation = useNavigation()
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState([]);
    const [updatedHouse, setUpdatedHouse] = useState([]);
    const [house, setHouse] = useState(''); // first get, no update from dta base
    const [hKey, setHKey] = useState('');
    const [hIncome, setHIncom] = useState(undefined)
    const [changeIncom, setChangeIncom] = useState(false)
    const [hExpedns, setHExpedns] = useState(undefined)


    useEffect(() => {
        firebase.getByDocIdFromFirestore("users", firebase.auth.currentUser?.email).then( (us) => { setUser(us)} )    // before opening the page
    }, [])

    useEffect(() => {    
        if("hKeyP" in route.params){
            console.log(route.params.hKeyP)    
            setHKey(route.params.hKeyP)
            firebase.getByDocIdFromFirestore("houses",route.params.hKeyP).then((uHouse)=>setHouse(uHouse)).catch((e) =>{})
        }else if("house" in route.params) setHouse(route.params.house)
    }, [route])

    useEffect(() => {
        if(house){
            setHExpedns(firebase.getHouseExpendsAmount(house.expends))
            setHIncom(firebase.getHouseIncome(hKey))
            setLoading(false)
        }
    }, [house])

    useEffect(() => {
        firebase.getByDocIdFromFirestore("houses",hKey).then((uHouse)=>setHouse(uHouse)).catch((e) =>{})
    }, [hIncome])

    useEffect(() => {
        if(hExpedns)
         firebase.getSortedArrayDateFromDict(hExpedns).map((expend) => {
                isExpended[expend.date] = false 
            })
    }, [hExpedns])

    const getReminderColor = () => {
        if(hIncome < hExpedns)
            return '#FF6347'
        else return 'lightgreen'
    }

    const handleCreateExpend = () => {
        firebase.changePartnerIncomeOfHouse(hKey,user.email,hIncome)
        setChangeIncom(false)
    }

    return (
        <SafeAreaView style={houseProfileStyles.container}>
            {loading? <Loading/> : 
            <ScrollView showsVerticalScrollIndicator={false}>
            {/* <View style={houseProfileStyles.titleBar}>
                <Ionicons name="ios-arrow-back" size={24} color="#52575D"></Ionicons>
                <Ionicons name="ios-ellipsis-vertical" size={24} color="#52575D"></Ionicons>
            </View> */}
            
                <View style={{ alignSelf: "center" }}>
                    <View style={[houseProfileStyles.profileHouseImage,{elevation:8}]}>
                        <Image source={{uri:user.uImage}} style={houseProfileStyles.image} resizeMode="center"></Image>
                    </View>
                    {/* <View style={houseProfileStyles.dm}>
                        <MaterialIcons name="chat" size={18} color="#DFD8C8"></MaterialIcons>
                    </View> */}
                    {/* <View style={houseProfileStyles.active}></View> */}
                </View>

                <View style={houseProfileStyles.infoContainer}>
                    <Text style={[houseProfileStyles.text, { fontWeight: "200", fontSize: 36 }]}>{user.fName + " " + user.lName}</Text>
                    {/* <Text style={[houseProfileStyles.text, { color: "#AEB5BC", fontSize: 14 }]}>{house.description}</Text> */}
                </View>
                
                {/* <View style={houseProfileStyles.statsContainer}>
                     <View style={houseProfileStyles.statsBox}>
                        <Text style={[houseProfileStyles.text, { fontSize: 24, color:  getReminderColor() }]}>{hIncome - hExpedns} $</Text>
                        <Text style={[houseProfileStyles.text, houseProfileStyles.subText]}>Remainder</Text>
                    </View> 
                     <View style={[houseProfileStyles.statsBox, { borderColor: "#DFD8C8", borderLeftWidth: 1, borderRightWidth: 1 }]}>
                        <Text style={[houseProfileStyles.text, { fontSize: 24 }]}>{hExpedns} $</Text>
                        <Text style={[houseProfileStyles.text, houseProfileStyles.subText]}>Expenses</Text>
                    </View> 
                      <View style={houseProfileStyles.statsBox}>
                        <Text style={[houseProfileStyles.text, { fontSize: 24 }]}>{hIncome} $</Text>
                        <Text style={[houseProfileStyles.text, houseProfileStyles.subText]}>Income</Text>
                    </View> 
                </View> */}
             
                <RecentActivity map = {house.expends?house.expends:[]} slice={3}/>

                <View style={[styles.container,{alignSelf:'center', width:'100%'}]}>
                    <TouchableOpacity
                        title="Add Expenditure"
                        onPress={() => {navigation.navigate('AddNewExpenditure',house)}}
                        style={styles.button}
                        >
                        <Text style={styles.buttonText}>Add Expenditure</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        title="Change Income"
                        onPress={() => {setChangeIncom(!changeIncom)}}
                        style={styles.button}
                        >
                        <Text style={styles.buttonText}>Change Income</Text>
                    </TouchableOpacity>
                    {changeIncom && (
                    <View style={[styles.buttonContainer,{marginBottom:0}]}>
                        <View style={[styles.container, { marginHorizontal:30, width:'100%'}]}>
                            <Input name="Change" icon="money" onChangeText={text => setHIncom(text)} />
                        </View>
                                <Text style={[styles.textBody , {color: 'blue',marginBottom:10}]} onPress={handleCreateExpend}>Save new income</Text>
                    </View>
                    )}

                    <TouchableOpacity
                        title="Edit"
                        onPress={() => {navigation.navigate('EditHouseProfile',house)}}
                        style={styles.button}
                        >
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                </View>
                
            </ScrollView>}
        </SafeAreaView>
    );
}

export default UserProfileScreen
