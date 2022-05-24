import React, { useEffect, useState, Component } from 'react'
import { KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { styles } from '../styleSheet';
import { signInWithEmailAndPassword} from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import * as firebase from '../firebase'
import Account from '../components/Acount';
import Icon from 'react-native-vector-icons/FontAwesome';
import Input from '../components/Inputs';
import { Title } from 'react-native-paper';
// import { StyledFirebaseAuth } from 'react-firebaseui';
import { LogBox } from "react-native"
import Loading from '../components/Loading';


LogBox.ignoreAllLogs(true)

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
        signInWithEmailAndPassword(firebase.auth, email.replace(' ',''), password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log('Logged in with: ', user.email)

        })
        .catch(error => {
            alert(error.message, email)
        } );
    }

    return (
        <ScrollView style={{backgroundColor: 'white',}}>
            <View>
                <Title style={[styles.textBody,{fontSize:20}]}>Hello and Wellcome to</Title>
                <Title style={[styles.textBody,{fontSize:30,color:"#0782F9",textShadowRadius:2,textShadowColor:"grey"}]}>HomEco{"\n"}</Title>
                <Image style={{ alignSelf:'center' }} source={ require("../assets/HomEcoLogo.png") } />

                <Text style={styles.textBody}>Log in to your account</Text>
                <View style={styles.container}>

                        <Input name="Email" icon="user" onChangeText={text => setEmail(text)} />

                    <Input
                        name="Password"
                        value={ password }
                        onChangeText={text => setPassword(text)}
                        pass={true}
                        icon="lock"
                        />
                        <Text style={[styles.textBody,{color: 'blue'}]} onPress={() => navigation.navigate('ForgotPassword')}> Forgot Password </Text>

                        <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={handleLogin}
                        style={styles.button}
                        >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <Text style={styles.textBody}>{'\n'}Don't Have an Acoount ? </Text>
                        <Text style={[styles.textBody , {color: 'blue'}]} onPress={() => navigation.navigate('SignUp')}>Sign Up</Text>
                    <TouchableOpacity
                        style={{ width:219 ,borderRadius:5, paddingVertical:10, paddingHorizontal:30, flexDirection: 'row', backgroundColor: '#3578E5', marginTop: 20 }}
                        onPress={() => {}}>
                        <Icon name='facebook' size={20} color='#fff' />
                        <Text style={{ marginLeft: 10, color: '#fff', fontWeight: 'bold' }}>
                            Login With Facebook 
                        </Text>
                    </TouchableOpacity>    

                    <TouchableOpacity
                        style={{ width:219 , borderRadius:5, paddingVertical:10, paddingHorizontal:30, flexDirection: 'row', backgroundColor: 'red', marginTop: 10, marginBottom:20  }}
                        onPress={() => {}}>
                        <Icon name='google' size={20} color='#fff' />
                        <Text style={{ marginLeft: 10, color: '#fff', fontWeight: 'bold' }}>
                            Login With Google 
                        </Text>
                    </TouchableOpacity>  
                    {/*<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />*/}

                        
                    {/*
                    <TouchableOpacity
                    onPress={handleSignUp}
                    style={[styles.button, styles.buttonOutline]}
                    >
                        <Text style={styles.buttonOutlineText}>Register</Text>
                    </TouchableOpacity>
                    */}    
                </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default LoginScreen


