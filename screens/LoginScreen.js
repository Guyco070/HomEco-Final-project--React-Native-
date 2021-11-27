import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { styles } from '../styleSheet';
import { signInWithEmailAndPassword} from "firebase/auth";
import { useNavigation } from '@react-navigation/core';
import * as firebase from '../firebase'
import Account from '../components/Acount';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements/dist/input/Input';
// import { StyledFirebaseAuth } from 'react-firebaseui';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigation = useNavigation()
    
    useEffect(() => {
        const unsubscribe = firebase.auth.onAuthStateChanged(user => {
            if(user){
                navigation.replace("Home")
            }
        })
        return unsubscribe
    }, [])

    const handleLogin = () => {
        signInWithEmailAndPassword(firebase.auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log('Logged in with: ', user.email)

        })
        .catch(error => {
            alert(error.message, email)
            firebase.deleteRowFromFirestore("users", "Ga").then(list => console.log("User Added"))
        } 
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
            >
            <Text style={styles.textBody}>Log in your account</Text>
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

                    <Text style={styles.textBody}>{'\n'}Don't Have an Acoount</Text>
                    <Text style={[styles.textBody , {color: 'blue'}]} onPress={() => navigation.replace('SignUp')}>Sign Up</Text>
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


