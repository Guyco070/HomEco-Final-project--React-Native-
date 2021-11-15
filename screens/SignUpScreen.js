import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { StyleSheet, Text, View,Image,ScrollView } from 'react-native';
 
import Input from '../components/Inputs';
import Submit from '../components/Submit';


const SignUpScreen = props => {
    const navigation = useNavigation()
    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('Registered with: ', user.email)
        })
        .catch(error => alert(error.message)
        );
    }
    return (
        <ScrollView style={{backgroundColor: 'white'}}>
            <View style={styles.container}>
                <Image source={require('../assets/signup.png')}
                resizeMode="center" style={styles.image} />
                <Text style={styles.textTitle}>Let's Get Started</Text>
                <Text style={styles.textBody}>Create an account</Text>
                <Input name="Full Name" icon="user" />
                <Input name="Email" icon="envelope" /> 
                <Input name="Phone" icon="phone" /> 
                <Input name="Password" icon="lock" pass={true} />
                <Input name="Confirm Password" icon="lock" pass={true} />
                <Submit color="#0251ce" title="Create" /> 
                <View style={styles.container}>
                    <Text style={styles.textBody}>{'\n'}{'\n'}Already have an account</Text>
                    <Text style={[styles.textBody , {color: 'blue'}]} onPress={() => navigation.replace('Login')}>Login here</Text>
                </View>
            </View>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'center',

        alignItems: 'center',
        
    },
    image:{
        width:400,
        height:250,
        marginVertical:10
    },
    textTitle: {
        fontFamily: 'Foundation',
        fontSize:40,
        marginVertical:5
    },
    textBody:{
        fontFamily: 'Foundation',
        fontSize: 16,
        alignSelf: 'center',
        marginTop: 10
    }
});

export default SignUpScreen;