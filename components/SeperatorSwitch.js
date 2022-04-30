import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Icon } from 'react-native-elements';

const SeperatorSwitch = ({isExpended, setIsExpended, title, topDevider, bottomDevider, width, titleColor, withCheckIcon}) => {
  return (
    <View style={{width:"95%",...styles.container}}>
      <TouchableOpacity style={[styles.touchableOpacity, {borderTopWidth: topDevider && isExpended ? 1 : 0, borderBottomWidth: bottomDevider ? 1 : 0, width: width ? width : "100%"}]} onPress={()=>{ setIsExpended(!isExpended) }}>
        <View style={{flexDirection:"row"}}>
          {withCheckIcon && <Icon style={styles.checkIcon} name= { !isExpended ? 'ellipse-outline' : "checkmark-circle-outline"} size={22}  type='ionicon' />}
          <Text style={{color: titleColor? titleColor : ""}}>{title}</Text>
        </View>
          <Icon style={styles.icon} name= { !isExpended ? 'chevron-down' : "chevron-up"} size={22}  type='ionicon' />
      </TouchableOpacity>
    </View>
  )
}

export default SeperatorSwitch

const styles = StyleSheet.create({
    container: {
      margin: 10,
    },
    touchableOpacity:{
      alignSelf: "center",
      alignItems: "center",
      borderColor:'lightgrey',
    },
    icon:{
      marginBottom: 10,
    },
    checkIcon:{
      marginHorizontal:5
    }
})