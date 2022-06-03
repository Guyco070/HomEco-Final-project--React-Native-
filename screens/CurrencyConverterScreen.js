import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import CurrencyInput from '../components/CurrencyInput';
import { Icon } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler';

const CurrencyConverterScreen = () => {
    const [rates, setRates] = useState()
    const [currency1, setCurrency1] = useState('USD')
    const [currency2, setCurrency2] = useState('ILS')

    const [amount1, setAmount1] = useState(1);
    const [amount2, setAmount2] = useState(1);

    useEffect(()=>{
        const options = {
            method: 'GET',
            url: 'http://api.nbp.pl/api/exchangerates/tables/A', // B and C are the same but with other currencies
          };
        
          axios(options).then( (response) => {
                let tempRates = {}
                for( let i in response.data[0].rates)
                    tempRates[response.data[0].rates[i].code] = { currency: response.data[0].rates[i].currency , amount: parseFloat(response.data[0].rates[i].mid)}
                    setRates(tempRates)
          }).catch(function (error) {
              console.error(error);
          });
    },[])
    
    useEffect(() => {
        if( rates && currency1 && currency2)
        handleAmount1Change(1)
    }, [rates])

    const format = (number) => {
        return parseFloat(number.toFixed(4));
      }
    
    const handleAmount1Change = (amount1) => {
        if(!isNaN(amount1)){
            setAmount2(format(amount1 * rates[currency1].amount / rates[currency2].amount));
            setAmount1(amount1);  
        }else{
            handleAmount1Change(0)
        }
    }

    const handleCurrency1Change = (currency1) => {
        setAmount2(format(amount1 * rates[currency1].amount / rates[currency2].amount));
        setCurrency1(currency1);
    }

    const handleAmount2Change = (amount2) => {
        if(!isNaN(amount2)){
            setAmount1(format(amount2 * rates[currency2].amount / rates[currency1].amount));
            setAmount2(amount2);
        }else{
            handleAmount2Change(0)
        }
    }

    const handleCurrency2Change = (currency2) => {
        setAmount1(format(amount2 * rates[currency2].amount / rates[currency1].amount));
        setCurrency2(currency2);
    }
    
    const swap = () => {
        const temp = amount1
        handleAmount1Change(amount2)
        handleAmount2Change(temp)
    }
  
return (
    <View style={styles.container}>
        <Text style={styles.title}>Currency Converter</Text>
      {rates && currency1 && 
            <CurrencyInput
                onAmountChange={handleAmount1Change}
                onCurrencyChange={handleCurrency1Change}
                currencies={Object.keys(rates)} 
                amount={amount1}
                currency={currency1}
            />}
        <TouchableOpacity onPress={swap}>
            <Icon type='ionicon' name='swap-vertical' size={26} color={'black'}/>
        </TouchableOpacity>
        {rates && currency2 && 
            <CurrencyInput
                onAmountChange={handleAmount2Change}
                onCurrencyChange={handleCurrency2Change}
                currencies={Object.keys(rates)} 
                amount={amount2}
                currency={currency2}
            />}
    </View>
  )
}

export default CurrencyConverterScreen

const styles = StyleSheet.create({
    container: {
        alignSelf:'center',
        height: "100%",
        marginTop: 40
    },
    title: {
        fontSize: 25,
        alignSelf:'center',
        textAlign: 'center',
        marginVertical: 20
    }
})