import React, { Component, useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import { Modal } from 'react-native'
import { Colors } from '../Colors';
import { popUpTip, styles } from '../styleSheet';
import * as firebase from '../firebase'

const TipPopUp = ({ setShowPopUpTip, tipsCounter }) => {
    const [tip, setTip] = useState()

    useEffect(() => {
        firebase.getCollectionFromFirestore('tips').then( tips => {
            console.log(Math.floor(Math.random() * tips.length))
            setTip(tips[tipsCounter % tips.length])
        })
    },[])

    return (
        <Modal visible = {true}
            transparent={true}
            backdropOpacity={0.5}
            animationType="slide"
            onAccessibilityTap={() => setShowPopUpTip(false)}
            onRequestClose={() => setShowPopUpTip(false)}>
            { tip &&
            <View style={popUpTip.mainContainer}>
                <View style={popUpTip.container}>
                    <View style={popUpTip.iconContainer}>
                        <Icon size={40} name='lightbulb-multiple-outline' color={Colors.main} type='material-community'/>
                    </View>
                    
                    <ScrollView style={{width:"80%"}}>
                        <View style={popUpTip.textContainer}>
                            <Text style={popUpTip.title}>{tip.title}</Text>
                            <Text style={popUpTip.text}>{tip.body}</Text>
                            
                        </View>
                    </ScrollView>
                    <View style={{ flexDirection: 'row', }}>
                    { tip?.icon && <Icon size={40} name={tip.icon.name} color={Colors.main} type={tip.icon.type} style={{marginVertical:15, marginHorizontal: 5}}/>}
                    <TouchableOpacity
                        title={"Ok"}
                        onPress={()=>{ setShowPopUpTip(false) }}
                        style={[styles.button, { marginVertical: 15 }]}
                        >
                        <Text style={[styles.buttonText]}>{"Ok"}</Text>
                    </TouchableOpacity>
                    { tip?.icon && <Icon size={40} name={tip.icon.name} color={Colors.main} type={tip.icon.type} style={{marginVertical:15, marginHorizontal: 5}}/>}
                    </View>
                </View>
            </View>
            }
        </Modal>
    ) 
}

export default TipPopUp;