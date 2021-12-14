import { signOut } from '@firebase/auth'
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import UserHousesListView from '../components/UserHousesListView'
import * as firebase from '../firebase'
import { styles } from '../styleSheet'



const HomeScreen = () => {
    const navigation = useNavigation()
    const [user, setUser] = useState([]);

    useEffect(() => {
        firebase.getByDocIdFromFirestore("users", firebase.auth.currentUser?.email).then( (us) => { setUser(us)})    // before opening the page

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
        <View style={[styles.container],styles.container}>
            <Text style={styles.textBody}>{ user["fName"]+ " " + user["lName"] } </Text>
            <Text style={styles.textBody}>Email: { user["email"] } </Text>
            <UserHousesListView user={user}/>

            <TouchableOpacity
                    onPress={createNewHouseScreen}
                    style={styles.button}
                    email = {user["email"]}
                    >
                    <Text style={styles.buttonText}>Create New House</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText} onPress={handleSignOut} >Sign out</Text>
            </TouchableOpacity>
            <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('EditProfile')}>
                    <Text style={styles.buttonText}>Edit User</Text>
            </TouchableOpacity>
            <TouchableOpacity
                    onPress={() => navigation.navigate('General')}>
                    <Text >press me</Text>
            </TouchableOpacity>
        </View>
    )
}

export default HomeScreen

