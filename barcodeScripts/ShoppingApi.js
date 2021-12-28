import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { styles } from '../styleSheet';

const ShoppingApi = () => {
    const [searchRes, setSearchRes] =  useState('')
    const runSearch = (term) => {
        // axios
        //     .get(`https://api.barcodelookup.com/v3/products=${term}`)
        //     .then((response) => {
        //         setResponseData(response.data);
        //         console.log(response.data)
        //     })
        //     .catch((error) => {
        //         console.log('Error', error);
        //     }).finally(() => {
        //         //setValues(INITIAL_STATE); // מוחק את תוכן החיפוש
        //     })






            var axios = require("axios").default;

            var options = {
            method: 'GET',
            url: 'https://datagram-products-v1.p.rapidapi.com/storeproduct/ean/7290013585387/',
            headers: {
                'x-rapidapi-host': 'datagram-products-v1.p.rapidapi.com',
                'x-rapidapi-key': '2f9922109dmsha793586b374d7e7p1ec81fjsn57b2af4f14d2'
            }
            };

            axios.request(options).then(function (response) {
                console.log(response.data);
                // setSearchRes(response.)
            }).catch(function (error) {
                console.error(error);
            });
        }
    return (
        <View>
            <TouchableOpacity
                    onPress={runSearch}
                    style={styles.button}
                    >
                    <Text style={styles.buttonText}>Search In Api</Text>
            </TouchableOpacity>
            <Text value={searchRes}/>
        </View>
    )
}

export default ShoppingApi
