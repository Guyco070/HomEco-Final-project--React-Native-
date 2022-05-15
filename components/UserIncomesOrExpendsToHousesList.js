import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Text, View,Image,ScrollView, TouchableOpacity,KeyboardAvoidingView, Alert } from 'react-native';
import * as firebase from '../firebase'
import * as cloudinary from '../Cloudinary'
import Input from './Inputs';
import { docImageUploaderStyles, houseProfileStyles, styles } from '../styleSheet'
import * as ImagePicker from 'expo-image-picker';
import UploadProfileImage from './UploadProfileImage';
import { ListItem, Avatar } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale'; 
import { Divider } from 'react-native-elements/dist/divider/Divider';
import Loading from './Loading';
import { AntDesign } from '@expo/vector-icons';
import { monthNames } from '../Graphs';


const UserIncomesOrExpendsToHousesList = (props) => {
    const [housesList, sethousesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [changeIncome, setChangeIncome] = useState([])
    const [hIncome, setHIncome] = useState([])
    const [hExpends, setHHExpends] = useState([])
    const [hIncomeToChange, setHIncomeToChange] = useState([])


    useEffect(() => { 
            firebase.getHousesByUserEmail(props.user["email"])
            .then((houses) => {
                let tempChangeIncome = []
                let tempChangeHIncome = []
                let tempChangeHExpends = []
                let tempChangeHIncomeToChange = []

                for(let i in houses){
                    tempChangeIncome[i] = false
                    tempChangeHIncome[i] = firebase.getUserIncomeOrExpendsToHouseByMonth(houses[i].incomes, props.user["email"])
                    tempChangeHExpends[i] = firebase.getUserIncomeOrExpendsToHouseByMonth(houses[i].expends, props.user["email"])
                    tempChangeHIncomeToChange[i] = tempChangeHIncome[i]
                }
                
                setChangeIncome([...tempChangeIncome])
                setHIncome([...tempChangeHIncome])
                setHHExpends([...tempChangeHExpends])
                setHIncomeToChange([...tempChangeHIncomeToChange])
                
                sethousesList(houses); 
                
                setLoading(false);
            })
            .catch((e)=>(e.massege))    // before opening the page
      },[props])

      useEffect(() => { 
        firebase.getHousesByUserEmail(props.user["email"])
        .then((houses) => {sethousesList(houses); setLoading(false);})
        .catch((e)=>alert(e.massege))    // before opening the page
    },[])

    const handleChangeIncomeTohouse = (house,i) => {
        firebase.changePartnerIncomeOfHouse(firebase.getHouseKeyByNameAndCreatorEmail(house.hName,house.cEmail),props.user["email"],hIncomeToChange[i])
        hIncome[i] = hIncomeToChange[i]; setHIncome([...hIncome])
        changeIncome[i] = !changeIncome[i]; setChangeIncome([...changeIncome])
    }

    return (
        loading?(<Loading/>) :
        (<ScrollView 
        style={{width:'80%',}}
        >
            {props.isWithPaymentsTitle && <Text style={[houseProfileStyles.subText, houseProfileStyles.recent,{marginLeft:0}]}>Payments to houses</Text>}
            <View style={{margin:0, flexDirection:'row'}}>
                <Text style={[houseProfileStyles.subText, houseProfileStyles.recent,{marginLeft:0,marginTop: props.isWithPaymentsTitle ? 5 : 15, fontSize:11,textTransform:'none'}]}>{monthNames[new Date().getMonth()] + " " + new Date().getFullYear() + " - Overall summary   | "}</Text>
                <Text style={[houseProfileStyles.subText, {marginTop: props.isWithPaymentsTitle ? 1 : 11,fontSize:9,textTransform:'none'}]}>{"Quantity\nAmount"}</Text>
                <Text style={[houseProfileStyles.subText, houseProfileStyles.recent,{marginLeft:0,marginTop: props.isWithPaymentsTitle ? 5 : 15, fontSize:11,textTransform:'none'}]}>{" | "}</Text>
            </View>

            <ListItem key={-1} bottomDivider>
                <ListItem.Content style={{margin:0}} >
                <View style={{margin:0}}>
                    <Text>{}</Text>
                </View>

                </ListItem.Content>
                    <Text style={[houseProfileStyles.subText, houseProfileStyles.recent,{alignSelf: 'flex-end',marginTop:5, fontSize:11,textTransform:'none'}]}>Incomes</Text>
                    <Text style={[houseProfileStyles.subText, houseProfileStyles.recent,{alignSelf: 'flex-end',marginTop:5,marginLeft:20, fontSize:11,textTransform:'none'}]}>Expends</Text>
                    <Text style={{margin:0}}>        </Text>
            </ListItem>

            {housesList && 
                    housesList 
                        .map((l, i) => 
                        (
                            <>
                            <ListItem key={i} bottomDivider topDivider Component={TouchableScale}
                            friction={90} //
                            tension={100} // These props are passed to the parent component (here TouchableScale)
                            activeScale={1}
                            onPress={() => { changeIncome[i] = !changeIncome[i]; setChangeIncome([...changeIncome]) }}
                            >
                                <ListItem.Content style={{margin:0}} >
                            {/* <TouchableOpacity  style={docImageUploaderStyles.removeBtn} onPress={props.onRemove}>
                                    <AntDesign name="close" size={17} color="black" />
                            </TouchableOpacity> */}
                                <Text style={{margin:0}}>{l.hName}</Text>

                                </ListItem.Content>
                                <View style={{ width: "25%" }}>
                                    <Text style={[styles.listTextItem,{alignSelf:'center'}]} >{hIncome[i].incomesQuntity}</Text>
                                    <Text style={[styles.listTextItem,{alignSelf:'center'}]} >{hIncome[i].incomesAmount}</Text>
                                </View>
                                <View style={{ width: "25%" }}>
                                    <Text style={[styles.listTextItem,{alignSelf:'center'}]} >{hExpends[i].incomesQuntity}</Text>
                                    <Text style={[styles.listTextItem,{alignSelf:'center'}]} >{hExpends[i].incomesAmount}</Text>
                                </View>
                                <AntDesign name="creditcard" size={17} color="black" />

                            </ListItem>
                                {/* {changeIncome[i] && (
                                    <View style={[styles.buttonContainer,{marginBottom:0,alignSelf:'center'}]}>
                                        <View style={[styles.container, { marginHorizontal:30, width:'100%'}]}>
                                            <Input name="Change" icon="money" onChangeText={text => {hIncomeToChange[i] = text; setHIncomeToChange([...hIncomeToChange])}} />
                                        </View>
                                        <Text style={[styles.textBody , {color: 'blue',marginBottom:25,marginTop:10}]} onPress={() => handleChangeIncomeTohouse(l,i)}>Save new income</Text>
                                    </View>
                                )} */}
                            </>
                        ))
                    }
        </ScrollView>)
    )
}

export default UserIncomesOrExpendsToHousesList