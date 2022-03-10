import { signOut } from '@firebase/auth'
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import UserHousesListView from '../components/UserHousesListView'
import * as firebase from '../firebase'
import { styles } from '../styleSheet'

import readProductsFromEXCL, * as s from "../barcodeScripts/productsFileScript.js"
import SheetJSApp from '../barcodeScripts/productsFileScript.js';
import TodoList from '../components/TodoList/TodoList';
import Loading from '../components/Loading';
import ShoppingApi from '../barcodeScripts/ShoppingApi';
import * as shufersal from '../barcodeScripts/ShufersalScraping';
import General from '../screens/General';


const HomeScreen = () => {
    const navigation = useNavigation()
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        console.log(firebase.auth.currentUser?.email)
        firebase.getByDocIdFromFirestore("users", firebase.auth.currentUser?.email).then( (us) => { setUser(us); setLoading(false); })    // before opening the page

      }, [])

    const createNewHouseScreen = () => {
        navigation.navigate("CreateNewHouse",user)
    }
     
    const handleSignOut = () => {
        signOut(firebase.auth)
        .then(() => {
            console.log("Logout")
            navigation.replace("Login")
        })
        .catch(error => alert(error.message)
        );
    }

    return (
        <View style={[styles.container]}>
            {loading ?    <Loading/>:<><Text style={styles.textBody}>{ user["fName"]+ " " + user["lName"] } </Text>
            <Text style={styles.textBody}>Email: { user["email"] } </Text>
            <UserHousesListView user={user}/>
             {/*uploade products drom excel*/ }
            {/* <SheetJSApp/> */}
            {/* <ShoppingApi/> */}
            <TouchableOpacity
                    onPress={() => shufersal.getDescriptionByUPC("7290010066582") }
                    style={styles.button}
                    email = {user["email"]}
                    >
                    <Text style={styles.buttonText}>Shufersal</Text>
            </TouchableOpacity>
            <TouchableOpacity
                    onPress={createNewHouseScreen}
                    style={styles.button}
                    email = {user["email"]}
                    >
                    <Text style={styles.buttonText}>Create New House</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText} onPress={handleSignOut} >Sign out</Text>
            </TouchableOpacity></>}
        </View>
    )
}

export default HomeScreen

