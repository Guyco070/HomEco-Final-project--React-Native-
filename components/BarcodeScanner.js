import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions' 
import * as firebase from '../firebase'
import * as expoBS from 'expo-barcode-scanner'
import Input from '../components/Inputs';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import * as st from '../styleSheet';
import * as shufersal from '../barcodeScripts/ShufersalScraping';


const BarcodeScanner = (props) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Not yet scanned')
  const navigation = useNavigation()

  const [newProd, setNewProd] = useState(null);


  const askForCameraPermission = () => {
    (async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      setHasPermission(status === 'granted');
    })()
  }

  // Request Camera Permission
  useEffect(() => {
    askForCameraPermission();
  }, []);

  // What happens when we scan the bar code
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setText(data)
    console.log(data)
    shufersal.getDescriptionByUPC(data).then((fromShufersal) => {
      if(fromShufersal){
        setText(fromShufersal["name"])
        props.onScannExtraFunc(fromShufersal["name"])
      }else{
        const prom = firebase.getByDocIdFromFirestore('products',data).then((prod)=>{
            if(prod){
                setText(prod["name"])
                props.onScannExtraFunc(prod["name"])
                
            }else {
                setText(data)
                const updateInTe = {}
                updateInTe["barcode"] = data
                setNewProd(updateInTe)
            }
        })
      }
    })
    
    console.log('Type: ' + type + '\nData: ' + data)
    console.log('hKey:' + props.hKey)
    
    // props.items
    // firebase.updateCollectAtFirestore("houses",props.hKey, props.listName, )
	// 				.then(firebase.getByDocIdFromFirestore('houses', props.hKey)
	// 							.then((house) => setItems(house.shoppingList)))
    navigation.navigate('HouseProfile',{hKeyP: props.hKey})

  };

  // Check permissions and return the screens
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>)
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
      </View>)
  }

  // Return the View
  return (
    <View style={styles.container}>
      <View style={styles.barcodebox}>
        <Camera
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height: 550, width: 400 }}
          barCodeScannerSettings={{
            barCodeTypes: Object.values(expoBS.Constants.BarCodeType).filter((type) => {return type != expoBS.Constants.BarCodeType.qr})
          }} />
      </View>
      <Text style={styles.maintext}>{text}</Text>
      {newProd && 
                <>
                <View >       
                    <View style={{minWidth:"80%",alignItems:'center'}}>           
                        <Text style={[styles.maintext,{textAlign:'center'}]}>Sorry, the product is not yet in the database..{"\n"}Would you like to insert it ? </Text>  
                        <Input name="Enter name of product" onChangeText={(text) => newProd["name"] = text}></Input>
                        <Input name="Enter brand of product" onChangeText={(text) => newProd["brand"] = text}></Input>
                    </View>
                    <TouchableOpacity style={[st.styles.button,{backgroundColor: 'rgba(7, 130, 249, 0.8)',flexDirection:'row',alignSelf:'center'}]} onPress={() => {firebase.addProductToFirestore(newProd.barcode, newProd.name, newProd.brand).then(() => setNewProd(null))}}>
                    <Text style={[st.styles.buttonText, {marginRight:2,textAlign:'center'}]}>Enter new prod</Text>
                    {/* <Icon name="scan-circle-outline"  type="ionicon" color='white'/> */}
                </TouchableOpacity>                
                </View>
                
                </>
            }
      {scanned && 
        <TouchableOpacity style={[st.styles.button,{backgroundColor: 'rgba(7, 130, 249, 0.8)',flexDirection:'row'}]} onPress={() => setScanned(false)}>
              <Text style={[st.styles.buttonText, {marginRight:2,textAlign:'center'}]}>Tap to Scan Again</Text>
              <Icon name="scan-circle-outline"  type="ionicon" color='white'/>
        </TouchableOpacity>}
      {/* {<Button title={'Go Back'} onPress={() => navigation.pop()} />} */}
        <TouchableOpacity style={[st.styles.button,{backgroundColor: 'rgba(7, 130, 249, 0.8)',flexDirection:'row'}]} onPress={() => props.isScanningFunc(false)}>
            <Text style={[st.styles.buttonText, {marginRight:2}]}>Go Back</Text>
            <Icon name="return-up-back-outline" type="ionicon" color={'white'}/> 
        </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    borderRadius:20,
    // flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf:"center",
    marginTop:170,
    padding:20,
    borderWidth:1,
    borderColor:"grey",
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  maintext: {
    fontSize: 16,
    margin: 20,
    color:'white'
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'tomato'
  }
});

export default BarcodeScanner
