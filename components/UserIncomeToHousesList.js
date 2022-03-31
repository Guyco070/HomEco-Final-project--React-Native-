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


const UserIncomeToHosesList = (props) => {
    const navigation = useNavigation()
    const [housesList, sethousesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [changeIncome, setChangeIncome] = useState([])
    const [hIncome, setHIncome] = useState([])
    const [hIncomeToChange, setHIncomeToChange] = useState([])


    useEffect(() => { 
            firebase.getHousesByUserEmail(props.user["email"])
            .then((houses) => {
                let tempChangeIncome = []
                let tempChangeHIncome = []
                let tempChangeHIncomeToChange = []
                for(let i in houses){
                    tempChangeIncome[i] = false
                    tempChangeHIncome[i] = firebase.getUserIncomeToHouseByMonth(houses[i].incomes, props.user["email"])
                    tempChangeHIncomeToChange[i] = tempChangeHIncome[i]
                }
                
               
                setChangeIncome([...tempChangeIncome])
                setHIncome([...tempChangeHIncome])
                
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
            <Text style={[houseProfileStyles.subText, houseProfileStyles.recent,{marginLeft:0}]}>Payments to houses</Text>
            <Text style={[houseProfileStyles.subText, houseProfileStyles.recent,{marginLeft:0,marginTop:5, fontSize:11,textTransform:'none'}]}>Total for this month</Text>

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
                                <Text style={[styles.listTextItem,{alignSelf:'center'}]} >{hIncome[i]}</Text>

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

export default UserIncomeToHosesList