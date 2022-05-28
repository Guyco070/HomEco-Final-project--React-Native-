import React, {useState, useRef} from 'react';
import { View, StyleSheet, Button, Image, ScrollView, Text } from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import { deviceHeight, deviceWidth } from '../SIZES';
import { HomEcoVideo } from '../PrivateVariables';
import { useFocusEffect } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { houseProfileStyles } from '../styleSheet';
const SupportScreen = () => {
    const video = useRef(null);
    const [status, setStatus] = useState({});
    const [viewVideo, setViewVideo] = useState(false);

    return (
    <ScrollView>
        <View style={styles.videoContainer}>
            <Text style={[houseProfileStyles.text, { fontWeight: "200", fontSize: 20, textAlign: 'center' }]}>
                {!viewVideo ? "Click to watch a video showing how HomEco can help you:" : "HomEco" }
                </Text>
        { !viewVideo ? <TouchableOpacity onPress={() => setViewVideo(true)}>
            <Image style={styles.image} source={require('../assets/HomEco.png')} 
                resizeMode="contain"
            />
        </TouchableOpacity> :
        <Video
        ref={video}
        style={styles.video}
        source={{
            uri: HomEcoVideo,
        }}
        useNativeControls
        resizeMode="contain"
        isLooping = {false}
        onPlaybackStatusUpdate={status => setStatus(() => status)}
        shouldPlay
        />}
        {/* <Button
            title={status.isPlaying ? 'Pause' : 'Play'}
            onPress={() =>
            status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
            }
        /> */}
        </View>
    </ScrollView>
    );
}
    
    const styles = StyleSheet.create({ 
        videoContainer: {
            margin: 10,
            alignSelf: 'center',
            alignItems:'center',
            width: deviceWidth,
            height: deviceHeight,
        },
        video: {
            margin: 10,
            alignSelf: 'center',
            width: "98%",
            height: "70%",
            borderColor: 'lightgrey',
            borderWidth: 1
        },
        image:{
            margin: 10,
            alignSelf: 'center',
            borderColor: 'lightgrey',
            width: deviceWidth,
            height: 160,
            borderWidth: 1
        }
     }); 

export default SupportScreen