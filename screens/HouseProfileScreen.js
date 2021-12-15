import React, { useEffect,useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, LogBox } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as firebase from '../firebase'
import Loading from '../components/Loading';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { styles, houseProfileStyles } from '../styleSheet';
import { useNavigation } from '@react-navigation/native';
import RecentActivity from '../components/RecentActivity';

 
LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state.',
   ]);
    
const HouseProfileScreen = ({route}) => {
    const navigation = useNavigation()
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState([]);
    const [updatedHouse, setUpdatedHouse] = useState([]);
    const house = route.params; // first get, no update from dta base
    const [hKey, setHKey] = useState('');
    const [hIncome, setHIncom] = useState(undefined)
    const [hExpedns, setHExpedns] = useState(undefined)


    useEffect(() => {
        firebase.getByDocIdFromFirestore("users", firebase.auth.currentUser?.email).then( (us) => { setUser(us)} )    // before opening the page
    }, [])

    useEffect(() => {
        setHKey(firebase.getHouseKeyByNameAndCreatorEmail(house.hName,house.cEmail))
    }, [house])

    useEffect(() => {
        firebase.getHouseIncome(hKey).then((hIncome) => setHIncom(hIncome)).catch((e) => alert(e.message))
    }, [hKey])

    useEffect(() => {
        firebase.getByDocIdFromFirestore("houses",hKey).then((uHouse)=>setUpdatedHouse(uHouse)).catch((e) =>{})
    }, [hIncome])

    useEffect(() => {
        setHExpedns(firebase.getHouseExpendsAmount(updatedHouse.outComeToCurHouse))
        setLoading(false)
    }, [updatedHouse])

    return (
        <SafeAreaView style={houseProfileStyles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
            {/* <View style={houseProfileStyles.titleBar}>
                <Ionicons name="ios-arrow-back" size={24} color="#52575D"></Ionicons>
                <Ionicons name="ios-ellipsis-vertical" size={24} color="#52575D"></Ionicons>
            </View> */}
                <View style={{ alignSelf: "center" }}>
                    <View style={houseProfileStyles.profileHouseImage}>
                        <Image source={{uri:updatedHouse.hImage}} style={houseProfileStyles.image} resizeMode="center"></Image>
                    </View>
                    {/* <View style={houseProfileStyles.dm}>
                        <MaterialIcons name="chat" size={18} color="#DFD8C8"></MaterialIcons>
                    </View> */}
                    <View style={houseProfileStyles.active}></View>
                    <View style={houseProfileStyles.userProfileImage}>
                        <Image source={{uri:user.uImage}} style={houseProfileStyles.image} resizeMode="center"></Image>
                    </View>
                </View>

                <View style={houseProfileStyles.infoContainer}>
                    <Text style={[houseProfileStyles.text, { fontWeight: "200", fontSize: 36 }]}>{updatedHouse.hName}</Text>
                    <Text style={[houseProfileStyles.text, { color: "#AEB5BC", fontSize: 14 }]}>{updatedHouse.description}</Text>
                </View>
                {loading? <Loading/> : 
                <View style={houseProfileStyles.statsContainer}>
                    { <View style={houseProfileStyles.statsBox}>
                        <Text style={[houseProfileStyles.text, { fontSize: 24 }]}>{hIncome - hExpedns} $</Text>
                        <Text style={[houseProfileStyles.text, houseProfileStyles.subText]}>Remainder</Text>
                    </View> }
                    { <View style={[houseProfileStyles.statsBox, { borderColor: "#DFD8C8", borderLeftWidth: 1, borderRightWidth: 1 }]}>
                        <Text style={[houseProfileStyles.text, { fontSize: 24 }]}>{hExpedns} $</Text>
                        <Text style={[houseProfileStyles.text, houseProfileStyles.subText]}>Expenses</Text>
                    </View> }
                    { <View style={houseProfileStyles.statsBox}>
                        <Text style={[houseProfileStyles.text, { fontSize: 24 }]}>{hIncome} $</Text>
                        <Text style={[houseProfileStyles.text, houseProfileStyles.subText]}>Income</Text>
                    </View> }
                </View>}

                {/* <View style={{ marginTop: 32 }}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={houseProfileStyles.mediaImageContainer}>
                            <Image source={require("./assets/media1.jpg")} style={houseProfileStyles.image} resizeMode="cover"></Image>
                        </View>
                        <View style={houseProfileStyles.mediaImageContainer}>
                            <Image source={require("./assets/media2.jpg")} style={houseProfileStyles.image} resizeMode="cover"></Image>
                        </View>
                        <View style={houseProfileStyles.mediaImageContainer}>
                            <Image source={require("./assets/media3.jpg")} style={houseProfileStyles.image} resizeMode="cover"></Image>
                        </View>
                    </ScrollView>
                    <View style={houseProfileStyles.mediaCount}>
                        <Text style={[houseProfileStyles.text, { fontSize: 24, color: "#DFD8C8", fontWeight: "300" }]}>70</Text>
                        <Text style={[houseProfileStyles.text, { fontSize: 12, color: "#DFD8C8", textTransform: "uppercase" }]}>Media</Text>
                    </View>
                </View> */}

                <RecentActivity map = {updatedHouse.outComeToCurHouse?updatedHouse.outComeToCurHouse:[]} slice={3}/>

                <View style={[styles.container,{alignSelf:'center'}]}>
                    <TouchableOpacity
                            title="Add Expenditure"
                            onPress={() => {navigation.navigate('AddNewExpenditure',house)}}
                            style={styles.button}
                            >
                            <Text style={styles.buttonText}>Add Expenditure</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            title="Edit"
                            onPress={() => {navigation.navigate('EditHouseProfile',house)}}
                            style={styles.button}
                            >
                            <Text style={styles.buttonText}>Edit</Text>
                        </TouchableOpacity>
                </View>
            
            </ScrollView>
        </SafeAreaView>
    );
}

export default HouseProfileScreen
