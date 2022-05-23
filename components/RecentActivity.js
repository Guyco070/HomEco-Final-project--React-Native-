import React, { useEffect,useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, LogBox, TouchableOpacity ,Picker} from "react-native";
import { Divider } from 'react-native-elements/dist/divider/Divider';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import Loading from '../components/Loading';
import { getSortedArrayDateFromDict, getStrDateAndTimeToViewFromSrtDate } from '../firebase';
import { styles,houseProfileStyles,docImageUploaderStyles } from '../styleSheet';
import UploadDocumentImage from '../components/UploadDocumentImage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as firebase from '../firebase'
import ModalSelector from 'react-native-modal-selector'
import { sortDispatch, filterOptionsDispatch ,filterByFunc} from '../SortAndFilter';
import { TextInput } from 'react-native-gesture-handler';
import ModalFilterPicker from 'react-native-modal-filter-picker'


const typeIcones ={
    Home: 'home',
    Food: "md-fast-food",
    Car: "car",
    Travel: "airplane",
    Shopping: "pricetags-outline",
    Bills: "card-outline",
    Education: "glasses-outline",
    Other: "help-outline",
    Supermarket: "cart-outline"
}

const RecentActivity = ({map,slice,hKey,type,scrollHandler, title}) => {
    const navigation = useNavigation()

    const [loading, setLoading] = useState(true);
    const [toViewList, setToViewList] = useState([]);
    const [sortedList, setSortedList] = useState([]);
    let isExpended = {}
    const [isExpendedConst, setIsExpendedConst] = useState(true);
    const [newSlice,setNewSlice] = useState(1)
    const [cEmail,setHouseCreator] = useState(1)

    const [sortVal,setSortVal] = useState('Date: new to old')

    const [filterVal,setFiltertVal] = useState('')
    const [filterVisable,setFilterVisable] = useState(false)
    const [filterOptions,setFilterOptions] = useState([])
    const [filterList,setFilterList] = useState([])
    
    let sortIndex = 0;
    const sortData = [
        { key: sortIndex++, section: true, label: 'Select a value to sort by' },
        { key: sortIndex++, label: 'Date: old to new' },
        { key: sortIndex++, label: 'Date: new to old'  },
        { key: sortIndex++, label: 'Amount: high to low' },
        { key: sortIndex++, label: 'Amount: low to high'  },
    ];
    let filterIndex = 0;
    const filterData = type == 'Expenditure' ? [
        { key: filterIndex++, section: true, label: 'Select a value to filter by' },
        { key: filterIndex++, label: 'User email' },
        { key: filterIndex++, label: 'Billing Type'},
        { key: filterIndex++, label: 'Type' },
        { key: filterIndex++, label: 'Company' },
        { key: filterIndex++, label: 'Description' },
        { key: filterIndex++, label: 'Month' },
        { key: filterIndex++, label: 'Year' },
        { key: filterIndex++, section: true, label: '',  },
        { key: filterIndex++, label: 'None' },
    ] : [
        { key: filterIndex++, section: true, label: 'Select a value to filter by' },
        { key: filterIndex++, label: 'User email' },
        { key: filterIndex++, label: 'Billing Type'},

        { key: filterIndex++, section: true, label: '',  },
        { key: filterIndex++, label: 'None' },
    ]
    

    useEffect(() => {
        setToViewList(getSortedArrayDateFromDict(map))
        setFilterList(getSortedArrayDateFromDict(map))
        setSortedList(getSortedArrayDateFromDict(map))
        setNewSlice(slice)
        firebase.getByDocIdFromFirestore("houses",hKey).then((house)=>setHouseCreator(house.cEmail)).catch((e) =>{})
        
      },[map])

    useEffect(() => {
        for(const key in toViewList)
            isExpended[toViewList[key].date.toDate()] = false
        setIsExpendedConst(isExpended)
        setLoading(false);
        if(scrollHandler) scrollHandler()
    },[toViewList])

      const setIsExpended=(date) => {
            isExpended[date.toDate()] = !isExpendedConst[date.toDate()]
            setIsExpendedConst(isExpended)
      }

      const handleEdit = (valToEdit) => {
        if(type === 'Expenditure')
            navigation.navigate('AddOrEditExpenditure',{hKey, exp: valToEdit})
        if(type === 'Income')
            navigation.navigate('AddOrEditIncome',{hKey, income: valToEdit})
      }

      const handleSort = (key) => {
        if(filterList !== sortedList){
            setToViewList(sortDispatch[key](toViewList))
        }
        else setToViewList(sortDispatch[key](sortedList))
        setSortedList(sortDispatch[key](sortedList))
      }

      const handleFilterOptions = (option) => {
        if(option.label !== 'None'){
            setFilterOptions(filterOptionsDispatch[option.key](sortedList))
            setFilterVisable(true)
        }else setToViewList(sortedList)

      }

      const handleFilter = (key,val) => {
        setToViewList(filterByFunc(sortedList, filterVal, val))
      }

    return (
        <View>
        {loading?(<Loading/>) :
        (<ScrollView 
        style={{width:'100%',borderTopColor: 'lightgrey', borderTopWidth:1,borderTopLeftRadius:35,borderTopRightRadius:35, marginTop: 12}}
        >  
            <View flexDirection='row' flex={1}  style={{marginTop: 8, marginBottom: 6,}}>
                <Text style={[houseProfileStyles.subText, houseProfileStyles.recent,{textTransform: 'none',width: "25%"}]}>{title ? title : type}</Text>
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
                            onChange={(option)=>{ setFiltertVal(option.label); handleFilterOptions(option) }}
                            >
                            <View flexDirection='row' >
                                <Icon name="search" size={15} type='ionicon'/>
                                <Text style={[houseProfileStyles.subTextIcon,]} > Filter</Text>
                            </View>
                            <Text style={[houseProfileStyles.subTextIcon,{fontSize:10}]} > {filterVal}</Text>
                        </ModalSelector>
                        {filterOptions && <ModalFilterPicker
                        placeholderText={filterVal}
                            visible={filterVisable}
                            onSelect={(val) => {setFilterVisable(false); handleFilter(val.key,val.label)}}
                            onCancel={() => setFilterVisable(false)}
                            options={filterOptions}
                            /> }

                </View>
            </View>
        { toViewList.length == 0 &&
              <Text style={[houseProfileStyles.subText, {marginHorizontal:55,marginBottom:10,fontSize:10}]}>- None -</Text>
             }
            {toViewList &&  toViewList.slice(0,newSlice)
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
                                                            <Text style={{ fontWeight: "400" ,marginRight:20}}>{getStrDateAndTimeToViewFromSrtDate((l.date.toDate()))}</Text>
                                                            {type === 'Expenditure' && <View
                                                                style={[houseProfileStyles.typeIcone,]}
                                                                >
                                                                    <Ionicons 
                                                                        name={typeIcones[l.desc]}
                                                                        size={10}
                                                                        color={'#41444B'}
                                                                        style={{top:10}}
                                                                        />
                                                                    <Text style={{top:10,margin:1}}></Text>
                                                            </View>  }  
                                                        </View>
                                
                                                        {type == 'Expenditure' && <Text style={{ fontWeight: "400" }}>{"\nCompany: " + l.company}</Text>}
                                                        {"\n"}Amount: <Text style={{ fontWeight: "400" }}>{ l.amount} $</Text>
                                                        {type === 'Income' && <Text style={{ fontWeight: "400" }}>{"\nCreator: " + l.partner}</Text>}
                                                        {l.isEvent && <>{"\n"}Event Time: <Text style={{ fontWeight: "400" }}>{getStrDateAndTimeToViewFromSrtDate((l.eventDate.toDate()))}</Text></>}
                                                       
                                                    </Text>
                                                    </TouchableOpacity>
                                                    {
                                                    isExpendedConst && isExpendedConst[l.date.toDate()] &&
                                                    <>
                                                        <View style={[houseProfileStyles.textWithTopAndButDividers, { width:'95%'}]}>
                                                        <Text style = {{width:'88%'}}>
                                                            {type === 'Expenditure' && <Text style={{ fontWeight: "400" }}>{"Type: " + l.desc}</Text>}
                                                           {"descOpitional" in l && l.descOpitional != '' &&<>{type && type == 'Expenditure' && "\n"}<Text style={{ fontWeight: "400" }}>{"Description: " + l.descOpitional}</Text> </>}
                                                           {"\n"}<Text style={{ fontWeight: "400" }}>{"Billing type: " + l.billingType}</Text>
                                                           {type === 'Expenditure' && <Text style={{ fontWeight: "400" }}>{"\nCreator: " + l.partner + "\n"}</Text>}
                                                           {type === 'Expenditure' && l.totalPayments !== "" && 
                                                                <Text style={{ fontWeight: "400" }}>{"\Payment: " + l.payments+ "/" + l.totalPayments 
                                                                    + "\nPayed: " + l.amount*l.payments + "/" + l.totalAmount +" $\n"}</Text> 
                                                            }
                                                           
                                                        </Text>
                                                        {type === 'Expenditure' && <View>
                                                                {("invoices" in l) && (l.invoices.length != 0) && <Text style = {houseProfileStyles.textWithButDivider}>
                                                                    {"\n"}
                                                                   <Text style={{ fontWeight: "400" }}>{"Invoices: "}</Text>
                                                                </Text>}
                                                                
                                                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
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
                                                            </View> }
                                                        </View>
                                                        { (firebase.auth.currentUser?.email == l.partner || cEmail == firebase.auth.currentUser?.email) && !l?.isFuture &&
                                                                <TouchableOpacity  onPress={ () => handleEdit(l) } style={{alignSelf: 'center', alignItems: 'flex-end', margin:7 }}>
                                                                    <Icon  name="edit"  type="icon" color={"grey"} size={20}/>
                                                                </TouchableOpacity>
                                                            }
                                                        </>
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
            )}
        </ScrollView>)}
            <View style={{flexDirection:"row" ,alignSelf:'center'}}>
            { newSlice < toViewList.length &&
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
