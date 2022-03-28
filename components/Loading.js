import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet,Dimensions } from 'react-native';

const Loading = () => {
    return (
        <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="large" color="#0782F9" />
        </View>
    )
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      height:"100%"
    },
    horizontal: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignSelf:'center',
      alignItems:"center",
    }
  });

export default Loading;