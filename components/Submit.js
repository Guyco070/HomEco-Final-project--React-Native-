import React , { useEffect, useState }  from 'react';
import { StyleSheet,View,Text,TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';

const Submit = props => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return(

        <TouchableOpacity style={[styles.container, {backgroundColor:props.color}]}>
            <Button style={styles.submitText} title={props.title} onPress={console.log("yarin")} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
        height: 50,
        borderColor:'blue',
        borderRadius: 10,
        marginVertical:10,
        borderWidth: 0
    },
    submitText:{
        fontSize:22,
        fontWeight: 'bold',
        color: 'white',
        alignSelf: 'center',
        marginVertical : 10

    }

});

export default Submit;