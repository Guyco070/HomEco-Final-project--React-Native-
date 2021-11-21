import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { Text, View,Image,ScrollView, TouchableOpacity, TextPropTypes } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";

import { styles } from '../styleSheet';

import Input from '../components/Inputs';
import * as firebase from '../firebase'

import Submit from '../components/Submit';


const SignUpScreen = props => {
    const navigation = useNavigation()
    const [fName, setFName] = useState('');
    const [lName, setLName] = useState('');
    const [bDate, setBDate] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const unsubscribe = firebase.auth.onAuthStateChanged(user => {
            if(user){
                navigation.replace("Home")
            }
        })
        return unsubscribe
    }, [])

    const handleSignUp = () => {
        createUserWithEmailAndPassword(firebase.auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            firebase.addUserToFirestore(email.toLowerCase(),fName, lName, phone, bDate )
            console.log('Registered with: ', user.email)
            signInWithEmailAndPassword(firebase.auth, email, password)
        })
        .catch(error => alert(error.message, email, password));
    }
    return (
        <ScrollView style={{backgroundColor: 'white'}}>
            <View style={styles.container}>
                <Image source={require('../assets/signup.png')}
                resizeMode="center" style={styles.image} />
                <Text style={styles.textTitle}>Let's Get Started</Text>
                <Text style={styles.textBody}>Create an account</Text>
                <Input name="First Name" icon="user" onChangeText={text => setFName(text)} />
                <Input name="Last Name" icon="user" onChangeText={text => setLName(text)} />
                <Input name="Phone" icon="phone" keyboardType="phone-pad" onChangeText={text => setPhone(text)} /> 
                <Input name="Birth Date" icon= 'birthday-cake' onChangeText={text => setBDate(text)} /> 
                <Input name="Email" icon="envelope" onChangeText={text => setEmail(text)} /> 
                <Input name="Password" icon="lock" pass={true} onChangeText={text => setPassword(text)} />
                <Input name="Confirm Password" icon="lock" pass={true} onChangeText={(text) => {}}/>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        title="Create"
                        onPress={handleSignUp}
                        style={styles.button}
                        >
                        <Text style={styles.buttonText}>Create</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.container}>
                    <Text style={styles.textBody}>{'\n'}{'\n'}Already have an account</Text>
                    <Text style={[styles.textBody , {color: 'blue'}]} onPress={() => navigation.replace('Login')}>Login here</Text>
                </View>
            </View>
        </ScrollView>
    )
};

export default SignUpScreen;
