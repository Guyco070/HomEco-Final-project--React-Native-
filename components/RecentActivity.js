import React, { useEffect,useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, LogBox, TouchableOpacity ,Picker} from "react-native";
import { Divider } from 'react-native-elements/dist/divider/Divider';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import Loading from '../components/Loading';
import { getSortedArrayDateFromDict, getSrtDateAndTimeToViewFromSrtDate } from '../firebase';
import { styles,houseProfileStyles,docImageUploaderStyles } from '../styleSheet';
import UploadDocumentImage from '../components/UploadDocumentImage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as firebase from '../firebase'
import ModalSelector from 'react-native-modal-selector'
import { sortDispatch, filterDispatch } from '../SortAndFilter';


const typeIcones ={
    Home: 'home',
    Food: "md-fast-food",
    Car: "car",
    Travel: "airplane",
    Shopping: "pricetags-outline",
    Bills: "card-outline",
    Education: "glasses-outline",
    Other: "help-outline"
}

const RecentActivity = ({map,slice,hKey}) => {
    const navigation = useNavigation()

    const [loading, setLoading] = useState(true);
    const [sorteList, setSorteList] = useState(true);
    let isExpended = {}
    const [isExpendedConst, setIsExpendedConst] = useState(true);
    const [newSlice,setNewSlice] = useState(1)
    const [cEmail,setHouseCreator] = useState(1)
    const [sortVal,setSortVal] = useState('')
    const [filterVal,setFiltertVal] = useState('')
    
    let sortIndex = 0;
    const sortData = [
        { key: sortIndex++, section: true, label: 'Select a value to sort by' },
        { key: sortIndex++, label: 'Date: old to new' },
        { key: sortIndex++, label: 'Date: new to old'  },
        { key: sortIndex++, label: 'Amount: high to low' },
        { key: sortIndex++, label: 'Amount: low to high'  },
    ];
    let filterIndex = 0;
    const filterData = [
        { key: filterIndex++, section: true, label: 'Fruits' },
        { key: filterIndex++, label: 'Red Apples' },
        { key: filterIndex++, label: 'Cherries' },
        { key: filterIndex++, label: 'Cranberries', accessibilityLabel: 'Tap here for cranberries' },
        // etc...
        // Can also add additional custom keys which are passed to the onChange callback
        { key: filterIndex++, label: 'Vegetable', customKey: 'Not a fruit' }
    ];
    

    useEffect(() => {
        setSorteList(getSortedArrayDateFromDict(map))
        setNewSlice(slice)
        firebase.getByDocIdFromFirestore("houses",hKey).then((house)=>setHouseCreator(house.cEmail)).catch((e) =>{})

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

      const handleEdit = (exp) => {
        navigation.navigate('EditExpenditureScreen',{hKey, exp})
      }

      const handleSort = (key) => {
        console.log(sortDispatch[key](sorteList))
        setSorteList(sortDispatch[key](sorteList) )
      }

      const handleFilter = (val) => {

      }

    return (
        <View>
        {loading?(<Loading/>) :
        (<ScrollView 
        style={{width:'100%',}}
        >  
            <View flexDirection='row' flex={1}  style={{marginTop: 32, marginBottom: 6,}}>
                <Text style={[houseProfileStyles.subText, houseProfileStyles.recent]}>Recent Activity</Text>
                <View flexDirection='row-reverse' style={{ width:'55%',alignItems:'flex-end',marginBottom:7}}>
                        <ModalSelector
                        data={sortData}
                        onChange={(option)=>{ setSortVal(option.label); handleSort(option.key) }}
                        style={{ marginLeft: 10 }}
                        >
                            <View flexDirection='row'>
                                <Icon name="funnel-outline" size={15} type='ionicon'/>
                                <Text style={[houseProfileStyles.subTextIcon,]} > Sort</Text>
                            </View>
                            <Text style={[houseProfileStyles.subTextIcon,{fontSize:10}]} > {sortVal}</Text>
                        </ModalSelector>
                    
                        <ModalSelector
                            data={filterData}
                            onChange={(option)=>{ setFiltertVal(option.label); handleFilter(option.label) }}
                            >
                            <View flexDirection='row' >
                                <Icon name="search" size={15} type='ionicon'/>
                                <Text style={[houseProfileStyles.subTextIcon,]} > Filter</Text>
                            </View>
                            <Text style={[houseProfileStyles.subTextIcon,{fontSize:10}]} > {filterVal}</Text>
                        </ModalSelector>

                </View>
            </View>
        { sorteList.length == 0 &&
              <Text style={[houseProfileStyles.subText, {marginHorizontal:55,marginBottom:10,fontSize:10}]}>- None -</Text>
             }
            {sorteList &&  sorteList.slice(0,newSlice)
                        .map((l, i) => 
                        (
                            <View key={i}>
                                <View style={[styles.container]}>
                                    <View style={houseProfileStyles.recentItem}>
                                        <View style={houseProfileStyles.activityIndicator}>

                                        </View>
                                            <View style={{ width: "75%" }}>
                                                <TouchableOpacity onPress={()=> {setIsExpended(l.date)}}>
                                                    <Text style={[houseProfileStyles.text, { color: "#41444B", fontWeight: "300" }]}>
                                                        <View style={{width:"100%", flexDirection: "row",marginTop:2}}>
                                                            <Text style={{ fontWeight: "400" ,marginRight:20}}>{getSrtDateAndTimeToViewFromSrtDate((l.date.toDate()))}</Text>
                                                            <View
                                                                style={[houseProfileStyles.typeIcone,]}
                                                                >
                                                                    <Ionicons 
                                                                        name={typeIcones[l.desc]}
                                                                        size={10}
                                                                        color={'#41444B'}
                                                                        style={{top:10}}
                                                                        />
                                                                    <Text style={{top:10,margin:1}}></Text>
                                                            </View>    
                                                        </View>

                                                        {"\n"}Company: <Text style={{ fontWeight: "400" }}>{l.company}</Text>
                                                        {"\n"}Amount: <Text style={{ fontWeight: "400" }}>{l.amount} $</Text>
                                                        {l.isEvent && <>{"\n"}Event Time: <Text style={{ fontWeight: "400" }}>{getSrtDateAndTimeToViewFromSrtDate((l.eventDate.toDate()))}</Text></>}
                                                       
                                                    </Text>
                                                    
                                                    {isExpendedConst && isExpendedConst[l.date.toDate()] &&
                                                        <View style={[houseProfileStyles.textWithTopAndButDividers, { flexDirection:'row', width:'95%'}]}>
                                                        <Text style = {{width:'88%'}}>
                                                           <Text style={{ fontWeight: "400" }}>{"Type: " + l.desc}</Text>
                                                           {"descOpitional" in l && l.descOpitional != '' &&<> {"\n"}<Text style={{ fontWeight: "400" }}>{"Description: " + l.descOpitional}</Text> </>}
                                                           {"\n"}<Text style={{ fontWeight: "400" }}>{"Billing type:" + l.billingType}</Text>
                                                           {"\n"}<Text style={{ fontWeight: "400" }}>{"Creator: " + l.partner}</Text>
                                                           {"\n"}
                                                           <View>
                                                                {("invoices" in l) && (l.invoices.length != 0) && <Text style = {houseProfileStyles.textWithButDivider}>
                                                                    {"\n"}
                                                                   <Text style={{ fontWeight: "400" }}>{"Invoices: "}</Text>
                                                                </Text>}
                                                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                                                            
                                                                    {("invoices" in l) && (l.invoices.length != 0) && l.invoices.map((val, index) => ( 
                                                                        <View style={docImageUploaderStyles.mediaImageContainer}>
                                                                            <UploadDocumentImage tempImage = {require('../assets/contract_icon.png')} image={val} changeable={false} navigation={navigation}/>
                                                                        </View>
                                                                        ))
                                                                    }
                                                                
                                                                </ScrollView>
                                                                {("contracts" in l) && (l.contracts.length != 0) &&
                                                                <Text style = {houseProfileStyles.textWithButDivider}>
                                                                    {"\n"}
                                                                     <Text style={{ fontWeight: "400" }}>{"Warranty / contract: "}</Text>
                                                                </Text>}
                                                                
                                                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                                                                    {("contracts" in l) && (l.contracts.length != 0) && l.contracts.map((val, index) => ( 
                                                                        <View style={docImageUploaderStyles.mediaImageContainer}>
                                                                            <UploadDocumentImage tempImage = {require('../assets/contract_icon.png')} image={val} changeable={false} navigation={navigation}/>
                                                                        </View>
                                                                        ))
                                                                    }                 
                                                                </ScrollView>
                                                            </View> 
                                                        </Text>
                                                        { (firebase.auth.currentUser?.email == l.partner || cEmail == firebase.auth.currentUser?.email) &&
                                                                <View style={{alignSelf: 'center', alignItems: 'flex-end', }}>     
                                                                    <TouchableOpacity  onPress={ () => handleEdit(l) }>
                                                                        <Icon  name="edit"  type="icon" color={"grey"} size={18}/>
                                                                    </TouchableOpacity>
                                                                </View>
                                                                }
                                                        </View>
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
