import React from 'react';
import { StyleSheet, Text, View,Image,ScrollView,TextInput} from 'react-native';
import Input from '../components/Inputs';
import Submit from '../components/Submit';


const SignUp = props => {
    return (
        <ScrollView style={{backgroundColor: 'white'}}>
            <View style={styles.container}>
                <Image source={require('../assets/signup.png')}
                resizeMode="center" style={styles.image} />
                <Text style={styles.textTitle}>Let's Get Started</Text>
                <Text style={styles.textBody}>Create an account</Text>
                <Input name="Full Name" icon="user" />
                <Input name="Email" icon="envelope" /> 
                <Input keyboardType="phone-pad" name="Phone" icon="phone"  />
                <Input name="Password" icon="lock" pass={true} />
                <Input name="Confirm Password" icon="lock" pass={true} />
                <Submit color="#0251ce" title="Create" /> 
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.textBody}>Already have an account</Text>
                    <Text style={[styles.textBody, {color: 'blue'}]} onPress={() => props.navigation.navigate('Home')}>Login here</Text>

                </View>
            </View>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container:{
        flex:1,
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
        fontSize: 16
    },
    inputContainer: {
        borderBottomWidth:0
    },
    inputText: {
        color: '#0779e4',
        fontWeight: 'bold',
        marginLeft:5
    }
});

export default SignUp;