import { sendPasswordResetEmail } from '@firebase/auth';
import { useNavigation } from '@react-navigation/native';
import React, { PureComponent, useState } from 'react'
import { Text, View ,StyleSheet, KeyboardAvoidingView, TouchableOpacity, Alert} from 'react-native'
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { Input } from 'react-native-elements/dist/input/Input';

const ForgotPasswordScreen = () => {
    const navigation = useNavigation()

    const [email, setEmail] = useState('')
    
    const handlePasswordReset = () => {
        sendPasswordResetEmail(email.toLowerCase(),true)
            .then(() => alert('Your password reset mail has been sent'))
            .catch(error => Alert.alert('Error', error.message));
    }

    return (
        <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        >
            <Text style={styles.textTitle}>Enter Your confirmation Email ! </Text>
            <View style={styles.inputContainer}>
                <Input
                    placeholder="Email"
                    value={ email }
                    onChangeText={text => setEmail(text)}
                    style={styles.input}
                    leftIcon={ <Icon name="mail" size={20} color="#000"/>}
                    ></Input>
                <TouchableOpacity
                    onPress={handlePasswordReset}
                    style={[styles.button, styles.buttonOutline]}
                    >
                        <Text style={styles.buttonOutlineText}>Register</Text>
                </TouchableOpacity>
                <Text style={styles.textBody}>{'\n'}{'\n'}I think I just remembered the password</Text>
                <Text style={[styles.textBody , {color: 'blue'}]} onPress={() => navigation.replace('Login')}>Login here</Text>
            </View>
        </KeyboardAvoidingView>
    )
}

export default ForgotPasswordScreen


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
        borderBottomWidth:0
    },
    input: {
        backgroundColor:'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius:100,
        marginTop:5,
        borderWidth:3.5,
        borderRadius: 100,
        borderColor: '#eeee',
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
        borderRadius: 100,
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
    textTitle: {
        fontFamily: 'Foundation',
        fontSize:30,
        marginVertical:10
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
