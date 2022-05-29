import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import SelectDropdown from 'react-native-select-dropdown'
import Inputs from './Inputs'
import { Colors } from '../Colors'

const CurrencyInput = (props) => {
  return (
    <View>
        <View style={styles.container}>
            <SelectDropdown
                buttonStyle = {styles.select}
                defaultValue={props.currency}
                data={props.currencies}
                onSelect={(selectedItem, index) => {
                    props.onCurrencyChange(selectedItem)
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                    // text represented after item is selected 
                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                    return selectedItem
                }}
                rowTextForSelection={(item, index) => {
                    // text represented for each item in dropdown
                    // if data array is an array of objects then return item.property to represent item in dropdown
                    return item
                }}
            />
            <Inputs style={styles.input} name={props.amount.toString()} value={props.amount.toString()} onChangeText={ text => props.onAmountChange(parseFloat(text)) } keyboardType="phone-pad"/>
        </View>
    </View>
  )
}

export default CurrencyInput

const styles = StyleSheet.create({
    container: {
        width:"90%", 
        flexDirection:'row', 
        alignItems:'center', 
        justifyContent: 'space-between', 
        alignSelf:'center'
    },
    input: {
        width:"60%",
        textAlign:'center'
    },
    select: { 
        height: 30, 
        borderRadius: 50, 
        flexDirection:'row',
        width: "35%", 
        marginLeft:5, 
        borderColor: Colors.sub, 
        borderWidth: 1.5,
        height: 50
    }
})