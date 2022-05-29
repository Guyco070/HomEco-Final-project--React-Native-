import React, { useEffect,useState } from 'react'
import { Text, View, SafeAreaView, Image, ScrollView, LogBox } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as firebase from '../firebase'
import Loading from '../components/Loading';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { styles, houseProfileStyles } from '../styleSheet';
import { useNavigation } from '@react-navigation/native';
import RecentActivity from '../components/RecentActivity';
import TodoList from '../components/TodoList/TodoList';
import Toast from 'react-native-toast-message';
import TouchableScale from 'react-native-touchable-scale';
import ModalSelector from 'react-native-modal-selector'
import * as Linking from 'expo-linking';
import { Icon } from 'react-native-elements';
import BarMenu from '../components/BarMenu';
import GraphHomeScreen from './GraphHomeScreen';
import HouseGalleryViewer from '../components/HouseGalleryViewer';

import TipPopUp from '../components/TipPopUp';
LogBox.ignoreAllLogs(true)

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state.',
   ]);
    
const HouseProfileScreen = ({route}) => {
    const navigation = useNavigation()
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState([]);
    const [house, setHouse] = useState(''); // first get, no update from dta base
    const [hKey, setHKey] = useState('');
    const [hIncome, setHIncom] = useState(undefined)
    const [hExpedns, setHExpedns] = useState(undefined)

    const [checked, setChecked] = useState(-1);
    const [ref, setRef] = useState(null);
    const [dataSourceCords, setDataSourceCords] = useState([]);
    const [showMenuBar, setShowMenuBar] = useState(route.params?.menuBarIndex ? route.params?.menuBarIndex : 0);

    const [messageOptions,setMessageOptions] = useState([])
    const [messageToEmail,setMessageToEmail] = useState('')

    const [haveNewMessages, setHaveNewMessages] = useState(false) 

    const [showPopUpTip, setShowPopUpTip] = useState(false)

    let addIndex = 0
    const addData = [
        { key: addIndex++, section: true, label: 'What would you like to add' },
        house && house.partners[user.email]?.permissions.seeMonthlyBills && { key: addIndex++, label: 'Add new expenditure', type: "expenditure" },
        house && house.partners[user.email]?.permissions.seeIncome && { key: addIndex++, label: 'Add new income', type: "income"  },
    ];

    useEffect(() => {
        firebase.getByDocIdFromFirestore("users", firebase.auth.currentUser?.email).then( (us) => { 
            setUser(us)
            if(!("lastUse" in us) | ("lastUse" in us && us?.lastUse.toDate().toDateString() !== new Date().toDateString())){
                setShowPopUpTip(us?.isGetTips)
                firebase.updateCollectAtFirestore('users', firebase.auth.currentUser?.email, 'tipsCounter', "tipsCounter" in us ? us.tipsCounter+1 : 1)
            }
            firebase.updateCollectAtFirestore('users', firebase.auth.currentUser?.email, 'lastUse', new Date())
        })
    }, [])

    useEffect(() => {    
        if("hKeyP" in route.params){
            setHKey(route.params.hKeyP)
            firebase.setSnapshotById('houses', route.params.hKeyP, (doc) => firebase.updateExpendsAndIncomes(route.params.hKeyP).then((uHouse)=> setHouse(uHouse) ).catch((e) =>{}))
            firebase.setSnapshotById("chats", route.params.hKeyP, (doc) => { if(navigation.getState().routes[navigation.getState().routes.length - 1].name != "Chat"); setHaveNewMessages(true)})
        }else if("house" in route.params) setHouse(route.params.house)
    }, [route])

    useEffect(() => {
        if(house){
            setHExpedns(firebase.getHouseExpendsAmount(house.expends))
            setHIncom(firebase.getHouseIncome(house.incomes))
            setLoading(false)
            getMessageOptions()
        }
    }, [house])

    // useEffect(() => {
    //     firebase.getByDocIdFromFirestore("houses",hKey).then((uHouse)=>setHouse(uHouse)).catch((e) =>{})
    // }, [hIncome])

    useEffect(() => {
        if(hExpedns)
         firebase.getSortedArrayDateFromDict(hExpedns).map((expend) => {
                isExpended[expend.date] = false 
            })
    }, [hExpedns])

    const getMessageOptions = () => {
        let temp = []
        temp.push({key: 0, label: "All partners of " + house.hName + " House",})

        for(let i in house.partners)
        {
            if(house.partners[i].user.email != user.email)
                temp.push({key: i+1, label: house.partners[i].user.fName + " " + house.partners[i].user.lName, phone: house.partners[i].user.phone})
        }
        setMessageOptions(temp)
    }

    const scrollHandler = () => {

        if(dataSourceCords != [])
        {
            ref.scrollTo({
                x: 0,
                y: dataSourceCords,
                animated: true 
            })
        }
    }

    const getReminderColor = () => {
        if(hIncome < hExpedns)
            return '#FF6347'
        else return 'lightgreen'
    }

    return (
        <SafeAreaView style={houseProfileStyles.container}>
            {loading? <Loading/> : 
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 25 }}
            ref={(ref) => {
                setRef(ref)
            }}
            >
            { showPopUpTip && <TipPopUp setShowPopUpTip={setShowPopUpTip} tipsCounter={"tipsCounter" in user ? user.tipsCounter : 0}/>}
            {/* <View style={houseProfileStyles.titleBar}>
                <Ionicons name="ios-arrow-back" size={24} color="#52575D"></Ionicons>
                <Ionicons name="ios-ellipsis-vertical" size={24} color="#52575D"></Ionicons>
            </View> */}
            { house && house.partners[user.email]?.isAuth && <View style={{ flexDirection:'row', justifyContent:'space-between'  }}>
                    <TouchableOpacity style={{margin:25,marginBottom:0} } onPress={()=>{
                            navigation.navigate('EditHouseProfile',house);
                        }} >
                        <Icon  name="edit"  type="icon" color={"grey"} />
                        <Text style={[houseProfileStyles.text, { color: "#AEB5BC", fontSize: 10 }]}>Edit</Text>
                    </TouchableOpacity>
                </View>}

                <View style={{ alignSelf: "center" }}>
                    <View style={houseProfileStyles.profileHouseImage}>
                        <Image source={{uri:house.hImage}} style={houseProfileStyles.image} resizeMode="center"></Image>
                    </View>
                        {messageOptions && <ModalSelector
                            data={messageOptions}
                            onChange={(option)=>{ 
                                if(option.key === 0)
                                    navigation.navigate("Chat",{userToChatWith:option, hKey, setHaveNewMessages})
                                else
                                    Linking.openURL('whatsapp://send?text=Hi,\nI want to talk with you about our house.\n\n'+user.fName + " " +user.lName+'.&phone=' + option.phone)
                            }}
                            style={houseProfileStyles.dm}
                            >
                            <View>
                                <MaterialIcons name="chat" size={18} color="#DFD8C8"></MaterialIcons>
                                { haveNewMessages && <View style={houseProfileStyles.haveNewMessages}/> }
                            </View>
                        </ModalSelector> }

                        <View style={houseProfileStyles.active}></View>
                        <View style={houseProfileStyles.userProfileImage}>
                            <TouchableScale
                            style={[houseProfileStyles.userProfileImage,{borderWidth:0}]} 
                            onPress={() => {navigation.navigate('UserProfileScreen',{hKeyP:firebase.getHouseKeyByNameAndCreatorEmail(house.hName,house.cEmail)})}}
                            >
                                <Image source={{uri:user.uImage}} style={houseProfileStyles.image} resizeMode="center" ></Image>
                            </TouchableScale>
                        </View>
                </View>

                <View style={houseProfileStyles.infoContainer}>
                    <Text style={[houseProfileStyles.text, { fontWeight: "200", fontSize: 36 }]}>{house.hName}</Text>
                    <Text style={[houseProfileStyles.text, { color: "#AEB5BC", fontSize: 14 }]}>{house.description}</Text>
                </View>
                
                <View style={houseProfileStyles.statsContainer}>
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
                </View>

                {/* <View style={{ marginTop: 32 }}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={houseProfileStyles.mediaImageContainer}>
                            <Image source={require("../assets/bell.png")} style={houseProfileStyles.image} resizeMode="cover"></Image>
                        </View>
                        <View style={houseProfileStyles.mediaImageContainer}>
                            <Image source={require("../assets/bell.png")} style={houseProfileStyles.image} resizeMode="cover"></Image>
                        </View>
                        <View style={houseProfileStyles.mediaImageContainer}>
                            <Image source={require("../assets/bell.png")} style={houseProfileStyles.image} resizeMode="cover"></Image>
                        </View>
                    </ScrollView>
                    <View style={houseProfileStyles.mediaCount}>
                        <Text style={[houseProfileStyles.text, { fontSize: 24, color: "#DFD8C8", fontWeight: "300" }]}>70</Text>
                        <Text style={[houseProfileStyles.text, { fontSize: 12, color: "#DFD8C8", textTransform: "uppercase" }]}>Media</Text>
                    </View>
                </View> */}
                {/* <TouchableOpacity
                            title="Scann barcode"
                            onPress={() => navigation.navigate('BarcodeScanner')}
                            style={styles.button}
                            >
                            <Text style={styles.buttonText}>Scann barcode</Text>
                        </TouchableOpacity> */}
            {loading?(<Loading/>) :
                (<ScrollView style={{marginTop:35, marginBottom:35}}
                    
                    onLayout={(event) => {
                        setDataSourceCords(event.nativeEvent.layout.y)
                    }}
                >  
                { (checked === 0 || checked === 1) &&
                    <>
            <View style={{ flexDirection:'row', justifyContent:'space-between'  }}>

                        <Text style={[houseProfileStyles.subText, houseProfileStyles.recent]}>Recent Activity</Text>
                        <TouchableOpacity
                        onPress={()=>{ checked === 0 && navigation.navigate('AddOrEditExpenditure',{hKey}); checked === 1 && navigation.navigate('AddOrEditIncome',{hKey}) }}
                        style={{marginRight:25,marginBottom:0,}}
                        >
                                <Icon  name="add"  type="icon" color={"grey"} />
                                {/* <Text style={[houseProfileStyles.text, { color: "#AEB5BC", fontSize: 10 }]}>Add</Text> */}
                        </TouchableOpacity>
                    </View>

                        {checked === 0 && 
                            <>
                             <RecentActivity map = {house.expends?house.expends:[]} slice={3} hKey={hKey} type={'Expenditure'} title="Expenses" scrollHandler={scrollHandler} houseCreator={house.cEmail}/>
                             <RecentActivity map = {house.futureExpendes?house.futureExpendes:[]} slice={3} hKey={hKey} type={'Expenditure'} title="Future Expenses" scrollHandler={scrollHandler} houseCreator={house.cEmail}/>
                            </> }
                        {checked === 1 && 
                            <>
                             <RecentActivity map = {house.incomes?house.incomes:[]} slice={3} hKey={hKey} type={'Income'} title="Incomes" scrollHandler={scrollHandler} houseCreator={house.cEmail}/>
                             <RecentActivity map = {house.futureIncomes?house.futureIncomes:[]} slice={3} hKey={hKey} type={'Income'} title="Future Incomes" scrollHandler={scrollHandler}/>
                            </> }
                    </>
                }
                { checked === 2 && 
                    <View style={[styles.container,{alignSelf:'center', width:'100%'}]}>
                        <GraphHomeScreen route={{params: {hKey:hKey}}}  scrollHandler={scrollHandler} />
                    </View>
                }
                { checked === 3 && <>
                    <Text style={[houseProfileStyles.subText, houseProfileStyles.recent]} >Shopping List</Text>
                    <TodoList list = {house.shoppingList} listName={"shoppingList"} uEmail = {user.email} navigation={navigation} scrollHandler={scrollHandler} setShowMenuBar={setShowMenuBar}/>
                    </>
                }
                { checked === 4 && <>
                    <Text style={[houseProfileStyles.subText, houseProfileStyles.recent]} >Tasks List</Text>
                    <TodoList list = {house.tasksList} listName={"tasksList"} scrollHandler={scrollHandler} setShowMenuBar={setShowMenuBar}/>
                    </>
                }
                { checked === 5 && <>
                    <Text style={[houseProfileStyles.subText, houseProfileStyles.recent]} >Gallery</Text>
                    <HouseGalleryViewer hKey = {hKey}  scrollHandler={scrollHandler} setShowMenuBar={setShowMenuBar} navigation={navigation} />
                    </>
                }
                </ScrollView>)
            }
            </ScrollView>}
            {(showMenuBar != -1 && !loading && house?.partners[user.email]) && <BarMenu onPress={setChecked} scrollHandler={scrollHandler} index ={showMenuBar} userPermissions={house.partners[user.email].permissions}/>}
        </SafeAreaView>
    );
}

export default HouseProfileScreen
