import React, { useEffect,useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, LogBox, TouchableOpacity } from "react-native";
import { Divider } from 'react-native-elements/dist/divider/Divider';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import Loading from '../components/Loading';
import { getSortedArrayDateFromDict, getSrtDateAndTimeToViewFromSrtDate } from '../firebase';
import { styles,houseProfileStyles,docImageUploaderStyles } from '../styleSheet';
import UploadDocumentImage from '../components/UploadDocumentImage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as firebase from '../firebase'




const SelfIncomeListViewer = ({map,slice}) => {
    const navigation = useNavigation()

    const [loading, setLoading] = useState(true);
    const [sorteList, setSorteList] = useState(true);
    let isExpended = {}
    const [isExpendedConst, setIsExpendedConst] = useState(true);
    const [newSlice,setNewSlice] = useState(1)
    const [cEmail,setHouseCreator] = useState(1)

    useEffect(() => {
        setSorteList(getSortedArrayDateFromDict(map))
        setNewSlice(slice)
        // firebase.getByDocIdFromFirestore("houses",hKey).then((house)=>setHouseCreator(house.cEmail)).catch((e) =>{})

      },[map])

      useEffect(() => {
        setLoading(false);
        for(const key in sorteList)
            isExpended[sorteList[key].date.toDate()] = false
            setIsExpendedConst(isExpended)
        },[sorteList])
        

      const setIsExpended=(date) => {
            isExpended[date.toDate()] = !isExpendedConst[date.toDate()]
            setIsExpendedConst(isExpended)
      }

      const handleEdit = (income) => {
        navigation.navigate('AddOrEditSelfIncome', {income:income})
      }
    return (
        <View>
        {loading?(<Loading/>) :
        (<ScrollView 
        style={{width:'80%', marginTop:20}}
        >  
        <Text style={[houseProfileStyles.subText, houseProfileStyles.recent]}>Self Income</Text>

            {sorteList && sorteList.length != 0 ?  sorteList.slice(0,newSlice)
                        .map((l, i) => 
                        (
                            <View key={i}>
                                <View style={[styles.container]}>
                                    <View style={houseProfileStyles.recentItem}>
                                        <View style={houseProfileStyles.activityIndicator}>

                                        </View>
                                            <View style={{ width: 250 }}>
                                                <TouchableOpacity onPress={()=> {setIsExpended(l.date)}}>
                                                    <Text style={[houseProfileStyles.text, { color: "#41444B", fontWeight: "300" }]}>
                                                        <Text style={{ fontWeight: "400" }}>{getSrtDateAndTimeToViewFromSrtDate((l.date.toDate()))}</Text>

                                                        {"\n"}Company: <Text style={{ fontWeight: "400" }}>{l.company}</Text>
                                                        {"\n"}Amount: <Text style={{ fontWeight: "400" }}>{l.amount} $</Text>
                                                       
                                                    </Text>
                                                    </TouchableOpacity>
                                                    {isExpendedConst && isExpendedConst[l.date.toDate()] &&<>
                                                        <Text>
                                                           <Text style={{ fontWeight: "400" }}>{"Description: " + l.desc}</Text>
                                                           {"\n"}<Text style={{ fontWeight: "400" }}>{"Income type:" + l.incomeType}</Text>
                                                        </Text>
                                                        {("payslips" in l) && (l.payslips.length != 0) && <Text style = {houseProfileStyles.textWithButDivider}>
                                                                    {"\n"}
                                                                   <Text style={{ fontWeight: "400" }}>{"Payslips: "}</Text>
                                                                </Text>}
                                                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                                                            
                                                                    {("payslips" in l) && (l.payslips.length != 0) && l.payslips.map((val, index) => ( 
                                                                        <View style={docImageUploaderStyles.mediaImageContainer}>
                                                                            <UploadDocumentImage tempImage = {require('../assets/contract_icon.png')} image={val} changeable={false} navigation={navigation}/>
                                                                        </View>
                                                                        ))
                                                                    }
                                                                
                                                                </ScrollView>     
                                                        { (firebase.auth.currentUser?.email == l.partner || cEmail == firebase.auth.currentUser?.email) &&
                                                            <View style={{alignSelf: 'center', alignItems: 'center', marginTop: 10}}>   
                                                                <TouchableOpacity  onPress={ () => handleEdit(l) }>
                                                                    <Icon  name="edit"  type="icon" color={"grey"} />
                                                                </TouchableOpacity>
                                                            </View>
                                                                }</>
                                                        }
                                            </View>
                                    </View>

                                    {/* <View style={houseProfileStyles.recentItem}>
                                        <View style={houseProfileStyles.activityIndicator}>
                                        </View>
                                            <View style={{ width: 250 }}>
                                                <Text style={[houseProfileStyles.text, { color: "#41444B", fontWeight: "300" }]}>
                                                    Started following <Text style={{ fontWeight: "400" }}>Luke Harper</Text>
                                                </Text>
                                            </View>
                                    </View>  */}
                                </View>
                            </View>
                        )
            ):
            <Text style={[houseProfileStyles.subText, {marginHorizontal:55,marginBottom:10,fontSize:10}]}>- Empty -</Text>
        }
        </ScrollView>)}
            <View style={{flexDirection:"row" ,alignSelf:'center'}}>
            { newSlice < sorteList.length &&
                <TouchableOpacity onPress={()=>{setNewSlice(newSlice + 2)}}>
                    <View>
                        <Icon
                            name='chevron-down' size={22}  type='ionicon'
                        />
                        <Text value = "See more" />
                    </View>
                </TouchableOpacity>
                }

                { newSlice != slice &&
                    <TouchableOpacity onPress={()=>{setNewSlice(slice)}}>
                        <View>
                            <Icon name="chevron-up" size={22} type='ionicon'
                            />
                            <Text value = "See more" />
                        </View>
                    </TouchableOpacity>
                }

            </View>
        </View>
    )
}

export default SelfIncomeListViewer
