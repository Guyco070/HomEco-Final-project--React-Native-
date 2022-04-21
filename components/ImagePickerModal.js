import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Modal } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import BottomSheet from 'reanimated-bottom-sheet';
import { Button } from 'react-native-elements';

let deviceHeight = Dimensions.get('window').height
// let deviceWidth = Dimensions.get('window').width

const ImagePickerModal = ({imageModalPickerVisable,setImageModalPickerVisable,addImage,from,index}) => {
  return (
  
        <Modal
        transparent={true}
        backdropOpacity={0.3}
        isVisible={imageModalPickerVisable}
        onBackdropPress={() => setImageModalPickerVisable(false)}
        style={styles.contentView}
        animationType="slide"
    >
         <View style={styles.content}>
            {/* <TouchableOpacity  onPress={()=>{setImageModalPickerVisable(false)}} style={{margin:10, alignSelf:'flex-start',}}
            >
                <Icon name={"close"} size={19}/>
            </TouchableOpacity> */}
            <Text style={styles.panelTitle}>How would you like to pick a photo:</Text>
            <TouchableOpacity  onPress={()=>{from ? addImage("camera",from, index) : addImage("camera")}} style={styles.buttonStyle}
            >
                <Text style={styles.buttontTitle}>Open camera</Text>
            </TouchableOpacity>
            <TouchableOpacity  onPress={()=>{from ? addImage("gallery", from, index) : addImage("gallery")}} style={styles.buttonStyle}
            >
                <Text style={styles.buttontTitle}>Open phone gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity  onPress={()=>{setImageModalPickerVisable(false)}} style={[styles.buttonStyle,{backgroundColor:'grey',marginTop:30}]}
            >
                <Text style={[styles.buttontTitle,{color:'white'}]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
  )
}

export default ImagePickerModal

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'rgba(7, 130, 249, 0.9)'
    },
    content: {
        backgroundColor: 'rgba(7, 130, 249, 0.95)',
        padding: 22,
        alignItems: 'center',
        alignSelf:'center',
        borderTopRightRadius: 17,
        borderTopLeftRadius: 17,
        borderColor:'grey',
        borderWidth:1,
        borderBottomWidth:0,
        top:3.5*deviceHeight/6,
        height:"47%",
        width:"98.3%",
    },
    buttontTitle: {
        justifyContent:'center',
        fontSize: 20,
        marginBottom: 12,
        color:"grey",
    },
    contentView: {
      margin: 0,
    },
      buttonStyle: {
      width: "80%",
      alignItems:'center',
      backgroundColor: "white",
      borderRadius: 20,
      borderColor:"lightgrey",
      borderWidth:2,
      marginTop:15,
      justifyContent:'center',
    },
    panelTitle: {
        fontSize: 27,
        height: 35,
        margin:20
    },
    panelSubtitle: {
        fontSize: 14,
        color: 'gray',
        height: 30,
        marginBottom: 10,
    },
    panelButton: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: '#FF6347',
        alignItems: 'center',
        marginVertical: 7,
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
    },
  });
//   Colors.primaryDarkColor
