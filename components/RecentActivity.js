import React, { useEffect,useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, LogBox, TouchableOpacity } from "react-native";
import { Divider } from 'react-native-elements/dist/divider/Divider';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import Loading from '../components/Loading';
import { getSortedArrayDateFromDict, getSrtDateAndTimeToViewFromSrtDate } from '../firebase';
import { styles,houseProfileStyles,docImageUploaderStyles } from '../styleSheet';
import UploadDocumentImage from '../components/UploadDocumentImage';
import { useNavigation } from '@react-navigation/native';




const RecentActivity = ({map,slice}) => {
    const navigation = useNavigation()

    const [loading, setLoading] = useState(true);
    const [sorteList, setSorteList] = useState(true);
    let isExpended = {}
    const [isExpendedConst, setIsExpendedConst] = useState(true);
    const [newSlice,setNewSlice] = useState(1)

    

    useEffect(() => {
        setSorteList(getSortedArrayDateFromDict(map))
        setNewSlice(slice)
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

    return (
        <View>
        {loading?(<Loading/>) :
        (<ScrollView 
        style={{width:'80%',}}
        >  
        <Text style={[houseProfileStyles.subText, houseProfileStyles.recent]}>Recent Activity</Text>

            {sorteList &&  sorteList.slice(0,newSlice)
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
                                                    
                                                    {isExpendedConst && isExpendedConst[l.date.toDate()] &&
                                                        <Text style = {houseProfileStyles.textWithTopAndButDividers}>
                                                           <Text style={{ fontWeight: "400" }}>{"Description: " + l.desc}</Text>
                                                           {"\n"}<Text style={{ fontWeight: "400" }}>{"Billing type:" + l.billingType}</Text>
                                                           {"\n"}<Text style={{ fontWeight: "400" }}>{"Creator: " + l.partner}</Text>
                                                           {"\n"}
                                                           <View>
                                                                {("invoices" in l) && <Text style = {houseProfileStyles.textWithButDivider}>
                                                                    {"\n"}
                                                                   <Text style={{ fontWeight: "400" }}>{"Invoices: "}</Text>
                                                                </Text>}
                                                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                                                            
                                                                    {("invoices" in l) && l.invoices.map((val, index) => ( 
                                                                        <View style={docImageUploaderStyles.mediaImageContainer}>
                                                                            <UploadDocumentImage tempImage = {require('../assets/contract_icon.png')} image={val} changeable={false} navigation={navigation}/>
                                                                        </View>
                                                                        ))
                                                                    }
                                                                
                                                                </ScrollView>
                                                                {("contracts" in l) &&
                                                                <Text style = {houseProfileStyles.textWithButDivider}>
                                                                    {"\n"}
                                                                     <Text style={{ fontWeight: "400" }}>{"Warranty / contract: "}</Text>
                                                                </Text>}
                                                                
                                                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                                                                    {("contracts" in l) && l.contracts.map((val, index) => ( 
                                                                        <View style={docImageUploaderStyles.mediaImageContainer}>
                                                                            <UploadDocumentImage tempImage = {require('../assets/contract_icon.png')} image={val} changeable={false} navigation={navigation}/>
                                                                        </View>
                                                                        ))
                                                                    }
                                                                </ScrollView>
                                                            </View> 

                                                        </Text>
                                                        }
                                                </TouchableOpacity>
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
            )}
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

export default RecentActivity
