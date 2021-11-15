import { signOut } from '@firebase/auth'
import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { auth } from '../firebase'

const HomeScreen = () => {
    const navigation = useNavigation()

    const handleSignOut = () => {
        signOut(auth)
        .then(() => {
            console.log("Logout")
            navigation.replace("Login")
        })
        .catch(error => alert(error.message)
        );
    }

    return (
        <View style={styles.container}>
            <Text>Email: {auth.currentUser?.email} </Text>
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
