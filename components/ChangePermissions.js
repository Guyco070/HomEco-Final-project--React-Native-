import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Text, View, ScrollView } from 'react-native';
import * as firebase from '../firebase'
import { houseProfileStyles, styles } from '../styleSheet'
import { ListItem } from 'react-native-elements';
import Loading from '../components/Loading';

const ChangePermissions =(props) => {
    const navigation = useNavigation()
    const [user, setUser] = useState([]);

    const [hName, setHName] = useState('');
    const [newHName, setNewHName] = useState('');
    const [hPartners, setPartners] = useState([]);
    const [oldHFullPartners, setOldHFullPartners] = useState();
    const [oldHPartners, setOldHPartners] = useState([]);
    const [partnersList, setPartnersList] = useState([]);
    const [isAll, setIsAll] = useState(false);
    const [desc, setDesc] = useState('');
    const [hKey, setHKey] = useState('');

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        firebase.getByDocIdFromFirestore("users", firebase.auth.currentUser?.email).then( (us) => { setUser(us)} )    // before opening the page
      }, [])

      useEffect(() => {
        const house = props.house
        setHName(house.hName)
        setNewHName(house.hName)
        setDesc(house.description)
        setHKey(firebase.getHouseKeyByNameAndCreatorEmail(house.hName,house.cEmail))
        setOldHFullPartners(props.house["partners"])
        firebase.getUserArrayFromPartnersDict(props.house["partners"])
        .then(arr => {setPartners(arr); setOldHPartners(arr)})
    }, [props])

    

    useEffect(() =>
    {
        setLoading(false)
    },[partnersList] )

    const handlePermissionCheck = (email,perType) => {
        let temp = {}
        for(let i in oldHFullPartners)
            temp[i] = oldHFullPartners[i]
        if(perType!="all")
            temp[email].permissions[perType] = !temp[email].permissions[perType]
        else{ 
            temp[email].permissions["seeMonthlyBills"] = !isAll
            temp[email].permissions["seeIncome"] = !isAll
            temp[email].permissions["changeGallery"] = !isAll
         }
        setOldHFullPartners(temp)
        props.onPress(oldHFullPartners)
    }

    const getPermission = (email,perType) => {
        return oldHFullPartners[email].permissions[perType]
    }

    return (
        <ScrollView style={{backgroundColor: 'white'}}>
            {loading? <Loading/> : 
            <View>
            { props.hPartners.length != 0 &&
                <Text style={[houseProfileStyles.subText, houseProfileStyles.recent,{marginLeft:20}]}>mannage permissions</Text>
            }
            <View>
            {props.hPartners &&
                    props.hPartners
                        .map((l,i) => 
                        (
                            l.email != user["email"] && props.house["partners"][l.email] &&
                            <ListItem key={i} topDivider bottomDivider 
                            friction={90} //
                            tension={100} // These props are passed to the parent component (here TouchableScale)
                            activeScale={0.95}
                            >
                                <ListItem.Content>
                                <ListItem.Title style={[styles.listTextItem,{alignSelf:'center'}]} >{l.fName + " " + l.lName}</ListItem.Title>
                                <ListItem.Subtitle style={[styles.listSubtitleTextItem,{alignSelf:'center'}]}>{l.email}</ListItem.Subtitle>
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
                                     <ListItem.CheckBox 
                                        center
                                        title="All"
                                        checkedIcon="dot-circle-o"
                                        uncheckedIcon="circle-o"
                                        checked={isAll}
                                        onPress={() => {handlePermissionCheck(l.email,"all"); setIsAll(!isAll)}}
                                        containerStyle={{marginLeft:10,marginRight:10,marginTop:15,marginBottom:10,borderRadius:10}}
                                        wrapperStyle = {{marginLeft:5,marginRight:5,marginTop:10,marginBottom:10}}
                                    />

                                    <ListItem.CheckBox 
                                        center
                                        title="See Income"
                                        checkedIcon="dot-circle-o"
                                        uncheckedIcon="circle-o"
                                        disabled={isAll}
                                        checked={getPermission(l.email,"seeIncome")}
                                        onPress={() => handlePermissionCheck(l.email,"seeIncome")}
                                        containerStyle={isAll?{marginLeft:10,marginRight:10,marginTop:15,marginBottom:10,borderRadius:10,backgroundColor:"#ddd",}
                                        :{marginLeft:10,marginRight:10,marginTop:15,marginBottom:10,borderRadius:10}}
                                        textStyle={isAll?{color:"#7B7177"} : {}}
                                        wrapperStyle = {{marginLeft:5,marginRight:5,marginTop:10,marginBottom:10}}
                                    />

                                    <ListItem.CheckBox 
                                        center
                                        title="See Bills"
                                        checkedIcon="dot-circle-o"
                                        uncheckedIcon="circle-o"
                                        disabled={isAll}
                                        checked={getPermission(l.email,"seeMonthlyBills")}
                                        onPress={() => handlePermissionCheck(l.email,"seeMonthlyBills")}
                                        containerStyle={isAll?{marginLeft:10,marginRight:10,marginTop:15,marginBottom:10,borderRadius:10,backgroundColor:"#ddd",}
                                        :{marginLeft:10,marginRight:10,marginTop:15,marginBottom:10,borderRadius:10}}
                                        textStyle={isAll?{color:"#7B7177"} : {}}
                                        wrapperStyle = {{marginLeft:5,marginRight:5,marginTop:10,marginBottom:10,}}
                                    />

                                    <ListItem.CheckBox 
                                        center
                                        title="Change gallery"
                                        checkedIcon="dot-circle-o"
                                        uncheckedIcon="circle-o"
                                        disabled={isAll}
                                        checked={getPermission(l.email,"changeGallery")}
                                        onPress={() => handlePermissionCheck(l.email,"changeGallery")}
                                        containerStyle={isAll?{marginLeft:10,marginRight:10,marginTop:15,marginBottom:10,borderRadius:10,backgroundColor:"#ddd",}
                                        :{marginLeft:10,marginRight:10,marginTop:15,marginBottom:10,borderRadius:10}}
                                        textStyle={isAll?{color:"#7B7177"} : {}}
                                        wrapperStyle = {{marginLeft:5,marginRight:5,marginTop:10,marginBottom:10,}}
                                    />
                                
                                </ScrollView>
                                </ListItem.Content>
                            </ListItem>
                        ))
                    }

            { oldHPartners.length == 1 &&
              <Text style={[houseProfileStyles.subText, {marginHorizontal:55,marginBottom:10,fontSize:8}]}>- Permissions is changable only to saved partners -</Text>
             }
            </View>
            
            </View>
            }
        </ScrollView>
    )
}

export default ChangePermissions
