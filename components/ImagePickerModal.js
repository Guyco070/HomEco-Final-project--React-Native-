import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Modal } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import BottomSheet from 'reanimated-bottom-sheet';
import { Button } from 'react-native-elements';

let deviceHeight = Dimensions.get('window').height
let deviceWidth = Dimensions.get('window').width

const ImagePickerModal = ({imageModalPickerVisable,setImageModalPickerVisable,addImage}) => {
    
    const renderInner = () =>{
        <View style={styles.panel}>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.panelTitle}>Upload Photo</Text>
          <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
        </View>
        <TouchableOpacity style={styles.panelButton} onPress={()=>{}}>
          <Text style={styles.panelButtonTitle}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.panelButton} onPress={()=>{}}>
          <Text style={styles.panelButtonTitle}>Choose From Library</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.panelButton}
          onPress={() => this.bs.current.snapTo(1)}>
          <Text style={styles.panelButtonTitle}>Cancel</Text>
        </TouchableOpacity>
      </View>
    }

    const sheetRef = React.useRef(null);

  return (
//       <View>
// {sheetRef && <Button
//           title="Open Bottom Sheet"
//           onPress={sheetRef.current.snapTo(0)}/>}
//               <BottomSheet
//     ref={sheetRef}
//     snapPoints={[450, 300, 0]}
//     renderContent={renderInner}
//     initialSnap={1}
//     enabledGestureInteraction={true}
//   /></View>
  
        <Modal
        transparent={true}
        backdropOpacity={0.3}
        isVisible={imageModalPickerVisable}
        onBackdropPress={() => setImageModalPickerVisable(false)}
        style={styles.contentView}
    >
         <View style={styles.content}>
            {/* <TouchableOpacity  onPress={()=>{setImageModalPickerVisable(false)}} style={{margin:10, alignSelf:'flex-start',}}
            >
                <Icon name={"close"} size={19}/>
            </TouchableOpacity> */}
            <Text style={styles.panelTitle}>How would you like to pick a photo:</Text>
            <TouchableOpacity  onPress={()=>{addImage("camera")}} style={styles.buttonStyle}
            >
                <Text style={styles.buttontTitle}>Open camera</Text>
            </TouchableOpacity>
            <TouchableOpacity  onPress={()=>{addImage("gallery")}} style={styles.buttonStyle}
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



// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//     },
//     commandButton: {
//       padding: 15,
//       borderRadius: 10,
//       backgroundColor: '#FF6347',
//       alignItems: 'center',
//       marginTop: 10,
//     },
//     panel: {
//       padding: 20,
//       backgroundColor: '#FFFFFF',
//       paddingTop: 20,
//       // borderTopLeftRadius: 20,
//       // borderTopRightRadius: 20,
//       // shadowColor: '#000000',
//       // shadowOffset: {width: 0, height: 0},
//       // shadowRadius: 5,
//       // shadowOpacity: 0.4,
//     },
//     header: {
//       backgroundColor: '#FFFFFF',
//       shadowColor: '#333333',
//       shadowOffset: {width: -1, height: -3},
//       shadowRadius: 2,
//       shadowOpacity: 0.4,
//       // elevation: 5,
//       paddingTop: 20,
//       borderTopLeftRadius: 20,
//       borderTopRightRadius: 20,
//     },
//     panelHeader: {
//       alignItems: 'center',
//     },
//     panelHandle: {
//       width: 40,
//       height: 8,
//       borderRadius: 4,
//       backgroundColor: '#00000040',
//       marginBottom: 10,
//     },
//     panelTitle: {
//       fontSize: 27,
//       height: 35,
//     },
//     panelSubtitle: {
//       fontSize: 14,
//       color: 'gray',
//       height: 30,
//       marginBottom: 10,
//     },
//     panelButton: {
//       padding: 13,
//       borderRadius: 10,
//       backgroundColor: '#FF6347',
//       alignItems: 'center',
//       marginVertical: 7,
//     },
//     panelButtonTitle: {
//       fontSize: 17,
//       fontWeight: 'bold',
//       color: 'white',
//     },
//     action: {
//       flexDirection: 'row',
//       marginTop: 10,
//       marginBottom: 10,
//       borderBottomWidth: 1,
//       borderBottomColor: '#f2f2f2',
//       paddingBottom: 5,
//     },
//     actionError: {
//       flexDirection: 'row',
//       marginTop: 10,
//       borderBottomWidth: 1,
//       borderBottomColor: '#FF0000',
//       paddingBottom: 5,
//     },
//     textInput: {
//       flex: 1,
//       marginTop: Platform.OS === 'ios' ? 0 : -12,
//       paddingLeft: 10,
//       color: '#05375a',
//     },
//   });