import React from 'react'
import { View, Text } from 'react-native'
import Inputs from './Inputs'

const SearchBar = (props) => {
    return (
        <View>
            <Inputs name={props.name}  onChangeText={props.onChangeText} icon="search" />
        </View>
    )
}

export default SearchBar
