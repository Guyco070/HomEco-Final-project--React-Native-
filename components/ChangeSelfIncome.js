import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { changePartnerIncomeOfHouse } from '../firebase';
import Input from './Inputs';
import { styles } from '../styleSheet';

const ChangeSelfIncome = ({income, setIncome,hKey,uEmail,setChangeIncom}) => {

    const handleCreateExpend = () => {
        changePartnerIncomeOfHouse(hKey,uEmail,income)
        setChangeIncom(false)
    }

    return (
        <ScrollView style={{backgroundColor: 'white'}}>

            <View style={[styles.container, {marginTop:30,marginHorizontal:30}]}>
                <Input name="Change" icon="money" onChangeText={text => setIncome(text)} />
            </View>
            <View style={[styles.container,{marginTop: 55}]}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        title="Change"
                        onPress={handleCreateExpend}
                        style={styles.button}
                        >
                        <Text style={styles.buttonText}>Change</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

export default ChangeSelfIncome
