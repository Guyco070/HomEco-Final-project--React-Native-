import React, { useEffect,useState } from 'react'
import { Text, View, SafeAreaView, Image, ScrollView, LogBox } from "react-native";
import * as firebase from '../firebase'
import Loading from '../components/Loading';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { styles, houseProfileStyles } from '../styleSheet';
import { useNavigation } from '@react-navigation/native';
import SelfIncomeListViewer from '../components/SelfIncomeListViewer';
import UserHousesListView from '../components/UserHousesListView';
import UserIncomesOrExpendsToHousesList from '../components/UserIncomesOrExpendsToHousesList';
import { Icon } from 'react-native-elements';
 
LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state.',
   ]);
    
const UserProfileScreen = ({route}) => {
    const navigation = useNavigation()
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState([]);


    useEffect(() => {
        firebase.getByDocIdFromFirestore("users", firebase.auth.currentUser?.email).then( (us) => { setUser(us); setLoading(false)} )    // before opening the page
    }, [])

    const getBDate = () => {
        try{
            return firebase.getStrDateToViewFromSrtDate(user.bDate.toDate())
        }catch{
            return user.bDate
        }
    }
    
    return (
        <SafeAreaView style={houseProfileStyles.container}>
            {loading? <Loading/> : 
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ flexDirection:'row', justifyContent:'space-between'  }}>
                    <TouchableOpacity style={{margin:25,marginBottom:0} } onPress={()=>{navigation.replace('EditUserProfile')}} >
                        <Icon  name="edit"  type="icon" color={"grey"} />
                        <Text style={[houseProfileStyles.text, { color: "#AEB5BC", fontSize: 10 }]}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{margin:25,marginBottom:0} } onPress={()=>{navigation.replace('AddOrEditSelfIncome')}} >
                        <Icon  name="add"  type="icon" color={"grey"} />
                        <Text style={[houseProfileStyles.text, { color: "#AEB5BC", fontSize: 10 }]}>Add</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ alignSelf: "center" }}>
                    <View style={[houseProfileStyles.profileHouseImage,{elevation:8}]}>
                        <Image source={{uri:user.uImage}} style={houseProfileStyles.image} resizeMode="center"></Image>
                    </View>
                </View>

                <View style={houseProfileStyles.infoContainer}>
                    <Text style={[houseProfileStyles.text, { fontWeight: "200", fontSize: 36 }]}>{user.fName + " " + user.lName}</Text>
                    <Text style={[houseProfileStyles.text, { color: "#AEB5BC", fontSize: 14 }]}>{user.email}</Text> 
                    <Text style={[houseProfileStyles.text, { color: "#AEB5BC", fontSize: 14 }]}>{user.phone}</Text> 
                    <Text style={[houseProfileStyles.text, { color: "#AEB5BC", fontSize: 14 }]}>{getBDate()}</Text> 
                </View>

                <SelfIncomeListViewer map = {user.incomes?user.incomes:[]} slice={3}/>

                <View style={[styles.container,{marginVertical:15}]}>
                    <UserHousesListView user={user} viewImage={false} withDetails={true}/>
                </View>
               
                <View style={[styles.container,{marginVertical:15}]}>
                    <UserIncomesOrExpendsToHousesList user={user} viewImage={false} type='incomes' isWithPaymentsTitle />
                </View>
            </ScrollView>}
        </SafeAreaView>
    );
}

export default UserProfileScreen
