
import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View,SafeAreaView, ScrollView } from 'react-native';
import * as firebase from '../firebase';
import {FontAwesome5} from "@expo/vector-icons";
import { styles } from '../styleSheet';

const EditProfile = () => {
    
    return (
        <ScrollView>
            <View style ={styles.container}>
                <SafeAreaView style={{ flex: 1 }}>
                     <TouchableOpacity 
                          style={{alignItems: "flex-end",margin:16}}>
                         <FontAwesome5 name="bars" size={24} color="#161924"/>
                     </TouchableOpacity>
              </SafeAreaView>
          </View>
          <View>
                <Text>hii here you can to edit your profile</Text>
           </View>
        </ScrollView>
    )
};

export default EditProfile;
