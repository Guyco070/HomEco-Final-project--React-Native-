import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import { useNavigation } from '@react-navigation/core';
import { auth, uiConfig } from '../firebase'
import Account from '../components/Acount';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements/dist/input/Input';
// import { StyledFirebaseAuth } from 'react-firebaseui';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigation = useNavigation()
    
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if(user){
                navigation.replace("Home")
            }
        })
        return unsubscribe
    }, [])

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log('Logged in with: ', user.email)

        })
        .catch(error => alert(error.message, user.email)
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
            >
            <Text style={styles.textBody}>Log in your account </Text>
            <View style={styles.inputContainer}>

                <Input
                    placeholder="Email"
                    value={ email }
                    onChangeText={text => setEmail(text)}
                    style={styles.input}
                    leftIcon={ <Icon name="user" size={20} color="#000"/>}
                    />
            </View>
            <View style={styles.inputContainer}>
                <Input
                    placeholder="Pasword"
                    value={ password }
                    onChangeText={text => setPassword(text)}
                    style={styles.input}
                    secureTextEntry
                    leftIcon={ <Icon name="lock" size={20} color="#000"/>}
                    />
            </View>
            <View style={[styles.inputContainer], {marginTop: 5}}>
                    <Text style={[styles.textBody,{color: 'blue',alignSelf: 'flex-end'}]} onPress={() => navigation.navigate('ForgotPassword')}> Forgot Password </Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={handleLogin}
                    style={styles.button}
                    >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <Text style={styles.textBody}>{'\n'}</Text>
                {/*<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />*/}

                <View style={styles.container}>
                    <Text style={styles.textBody}>{'\n'}{'\n'}Don't Have an Acoount</Text>
                    <Text style={[styles.textBody , {color: 'blue'}]} onPress={() => navigation.replace('SignUp')}>Sign Up</Text>
                </View>
                {/*
                <TouchableOpacity
                onPress={handleSignUp}
                style={[styles.button, styles.buttonOutline]}
                >
                    <Text style={styles.buttonOutlineText}>Register</Text>
                </TouchableOpacity>
                */}        
            </View>
        </KeyboardAvoidingView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    inputContainer: {
        width: '80%',
        marginTop:20,
        borderColor: '#eeee',
        borderWidth:3.5,
        borderRadius: 100,
        backgroundColor:'white',

    },
    input: {
        backgroundColor:'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius:100,
        marginTop:5,
        paddingVertical: 10,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:25
    },
    button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center'
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#0782F9',
        borderWidth: 2

    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        color: '#0782F9',
        fontWeight: '700',
        fontSize: 16,
    },
    textBody:{
        fontFamily: 'Foundation',
        fontSize: 16,
        alignSelf: 'center',
        marginTop: 10
    },
    submitText:{
        fontSize:22,
        fontWeight: 'bold',
        color: 'white',
        alignSelf: 'center',
        marginVertical : 10
    }
})
