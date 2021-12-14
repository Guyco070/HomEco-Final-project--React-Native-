import React, { useEffect,useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as firebase from '../firebase'
import Loading from '../components/Loading';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { styles } from '../styleSheet';
import { useNavigation } from '@react-navigation/native';

 


const HouseProfileScreen = ({route}) => {
    const navigation = useNavigation()
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState([]);
    const house = route.params;
    const [hKey, setHKey] = useState('');
    const [hIncome, setHIncom] = useState(undefined)


    useEffect(() => {
        firebase.getByDocIdFromFirestore("users", firebase.auth.currentUser?.email).then( (us) => { setUser(us)} )    // before opening the page
    }, [])

    useEffect(() => {
        setHKey(firebase.getHouseKeyByNameAndCreatorEmail(house.hName,house.cEmail))
    }, [house])

    useEffect(() => {
        firebase.getHouseIncome(hKey).then((hIncome) => setHIncom(hIncome)).catch((e) => alert(e.message))
        setLoading(false)
    }, [hKey])

    return (
        <SafeAreaView style={houseProfileStyles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
            {/* <View style={houseProfileStyles.titleBar}>
                <Ionicons name="ios-arrow-back" size={24} color="#52575D"></Ionicons>
                <Ionicons name="ios-ellipsis-vertical" size={24} color="#52575D"></Ionicons>
            </View> */}
                <View style={{ alignSelf: "center" }}>
                    <View style={houseProfileStyles.profileHouseImage}>
                        <Image source={{uri:house.hImage}} style={houseProfileStyles.image} resizeMode="center"></Image>
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
                    <Text style={[houseProfileStyles.text, { fontWeight: "200", fontSize: 36 }]}>{house.hName}</Text>
                    <Text style={[houseProfileStyles.text, { color: "#AEB5BC", fontSize: 14 }]}>{house.description}</Text>
                </View>
                {loading? <Loading/> : 
                <View style={houseProfileStyles.statsContainer}>
                    { <View style={houseProfileStyles.statsBox}>
                        <Text style={[houseProfileStyles.text, { fontSize: 24 }]}>483</Text>
                        <Text style={[houseProfileStyles.text, houseProfileStyles.subText]}>Remainder</Text>
                    </View> }
                    { <View style={[houseProfileStyles.statsBox, { borderColor: "#DFD8C8", borderLeftWidth: 1, borderRightWidth: 1 }]}>
                        <Text style={[houseProfileStyles.text, { fontSize: 24 }]}>45,844</Text>
                        <Text style={[houseProfileStyles.text, houseProfileStyles.subText]}>Expenses</Text>
                    </View> }
                    { <View style={houseProfileStyles.statsBox}>
                        <Text style={[houseProfileStyles.text, { fontSize: 24 }]}>{hIncome}</Text>
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

                <Text style={[houseProfileStyles.subText, houseProfileStyles.recent]}>Recent Activity</Text>
                <View style={[styles.container],{ alignItems: "center" }}>
                    <View style={houseProfileStyles.recentItem}>
                        <View style={houseProfileStyles.activityIndicator}>
                        </View>
                            <View style={{ width: 250 }}>
                                <Text style={[houseProfileStyles.text, { color: "#41444B", fontWeight: "300" }]}>
                                    Started following <Text style={{ fontWeight: "400" }}>Jake Challeahe</Text> and <Text style={{ fontWeight: "400" }}>Luis Poteer</Text>
                                </Text>
                            </View>
                    </View>

                    <View style={houseProfileStyles.recentItem}>
                        <View style={houseProfileStyles.activityIndicator}>
                        </View>
                            <View style={{ width: 250 }}>
                                <Text style={[houseProfileStyles.text, { color: "#41444B", fontWeight: "300" }]}>
                                    Started following <Text style={{ fontWeight: "400" }}>Luke Harper</Text>
                                </Text>
                            </View>
                    </View> 
                </View>

                <View style={[styles.container,{alignSelf:'center'}]}>
                    <TouchableOpacity
                            title="Add Expenditure"
                            onPress={() => {navigation.navigate('AddNewExpenditure')}}
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

const houseProfileStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF"
    },
    text: {
        fontFamily: "HelveticaNeue",
        color: "#52575D"
    },
    image: {
        flex: 1,
        height: undefined,
        width: undefined
    },
    titleBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 24,
        marginHorizontal: 16
    },
    subText: {
        fontSize: 12,
        color: "#AEB5BC",
        textTransform: "uppercase",
        fontWeight: "500"
    },
    profileHouseImage: {
        marginTop: 25,
        width: 200,
        height: 200,
        borderRadius: 100,
        overflow: "hidden"
    },
    dm: {
        backgroundColor: "#41444B",
        position: "absolute",
        top: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    active: {
        backgroundColor: "#34FFB9",
        position: "absolute",
        bottom: 28,
        left: 15,
        padding: 4,
        height: 20,
        width: 20,
        borderRadius: 10
    },
    userProfileImage: {
        backgroundColor: "lightgrey",
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        borderWidth: 2,
        borderColor:"#0782F9"
    },
    infoContainer: {
        alignSelf: "center",
        alignItems: "center",
        marginTop: 16
    },
    statsContainer: {
        flexDirection: "row",
        alignSelf: "center",
        marginTop: 32
    },
    statsBox: {
        alignItems: "center",
        flex: 1
    },
    mediaImageContainer: {
        width: 180,
        height: 200,
        borderRadius: 12,
        overflow: "hidden",
        marginHorizontal: 10
    },
    mediaCount: {
        backgroundColor: "#41444B",
        position: "absolute",
        top: "50%",
        marginTop: -50,
        marginLeft: 30,
        width: 100,
        height: 100,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        shadowColor: "rgba(0, 0, 0, 0.38)",
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 20,
        shadowOpacity: 1
    },
    recent: {
        marginLeft: 78,
        marginTop: 32,
        marginBottom: 6,
        fontSize: 10
    },
    recentItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 16
    },
    activityIndicator: {
        backgroundColor: "#CABFAB",
        padding: 4,
        height: 12,
        width: 12,
        borderRadius: 6,
        marginTop: 3,
        marginRight: 20
    }
});