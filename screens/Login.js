import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View,Image,ScrollView,KeyboardAvoidingView } from 'react-native';
import Inputs from '../components/Inputs';
import Submit from '../components/Submit';
import Account from '../components/Account';
import { Button } from 'react-native-elements';
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";



const Login = props => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if(user){
                navigation.replace("Home")
            }
        })
        return unsubscribe
    }, [])
    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('Registered with: ', user.email)
        });

    }
    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log('Logged in with: ', user.email)

        });

    }
    return (
        <ScrollView style={{backgroundColor: 'white'}}>
            <View style={styles.container}>
                <Image 
                    source={require('../assets/login.png')}
                    resizeMode='center'
                    style={styles.image} />
                <Text style={styles.textTitle}>Welcome Back! </Text>
                <Text style={styles.textBody}>Log in your account </Text>
                <View style={{marginTop:20}}/>
                <Inputs name='Email' icon="user" onChangeText={setEmail}/>
                <Inputs name='Password' icon="lock" pass={true} onChangeText={setPassword} />
                <View style={{width: '90%'}}>
                    <Text style={[styles.textBody],{alignSelf: 'flex-end'}}> forgot Password </Text>
                </View>
                <Button title="LOG IN" color="#0148a4" onPress={handleLogin}/>
                <Text style={styles.textBody}>Or connect Using</Text>
                <View style={{flexDirection: 'row'}}>
                    <Account color="#3b5c8f" icon="facebook" title="Facebook" />
                    <Account color="#ec482f" icon="google" title="Google" />
                </View>
                <View style={{flexDirection: 'row' , marginVertical: 5}}>
                    <Text style={styles.textBody}>Don't Have an Acoount</Text>
                    <Text style={[styles.textBody , {color: 'blue'}]} onPress={() => props.navigation.navigate('SignUp')}>Sign Up</Text>
                </View>
            </View>
        </ScrollView>

    );
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image:{
        width:400,
        height:250,
        marginVertical:10
    },
    textTitle: {
        fontFamily: 'Foundation',
        fontSize:40,
        marginVertical:10
    },
    textBody:{
        fontFamily: 'Foundation',
        fontSize: 16
    }
});

export default Login