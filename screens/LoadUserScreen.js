import React, { useEffect } from 'react'
import { View, Image } from 'react-native'
import { styles } from '../styleSheet';
import { useNavigation } from '@react-navigation/native';
import * as firebase from '../firebase'
import { Title } from 'react-native-paper';
import { LogBox } from "react-native"
import Loading from '../components/Loading';


LogBox.ignoreAllLogs(true)

const LoadUserScreen = () => {
    const navigation = useNavigation()
    
    useEffect(() => {
        const unsubscribe = firebase.auth.onAuthStateChanged(user => {
            if(user){
                navigation.replace("Home")
            }else
                navigation.replace("Login")
        })
        return unsubscribe
    }, [])

    return (
        <View style={{ backgroundColor:'white', height:"100%"}}>
            <Title style={[styles.textBody,{fontSize:30,color:"#0782F9",textShadowRadius:2,textShadowColor:"grey",marginTop:100,}]}>HomEco{"\n"}</Title>
            <Image style={{ alignSelf:'center',}} source={ require("../assets/HomEcoLogo.png") } />
            <Loading/>
        </View>
    )
}

export default LoadUserScreen


