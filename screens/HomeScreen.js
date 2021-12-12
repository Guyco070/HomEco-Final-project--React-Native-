import { signOut } from '@firebase/auth'
import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import * as firebase from '../firebase'

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
        <View style={styles.container}>
            <Text>{ user["fName"]+ " " + user["lName"] } </Text>
            <Text>Email: { user["email"] } </Text>
            <Text>My Houses: </Text>
           

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
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#0782F9',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 40
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
})
