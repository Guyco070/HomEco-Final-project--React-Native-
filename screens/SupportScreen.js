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
    const bodyArray = [
        "Create your own homes, add partners and give them permissions as you wish, get a proper home management association, add income and expenses for the home and keep track of your expense details using various graphs to help you manage your home economy.",
        "Also, you can keep track of your synchronized home shopping list or home to-do list thus saving time and money.",
        "You can even upload photos to the photo gallery of the house so you and all the members of the house can enjoy a fun and interesting social experience in addition to managing the home economy.",
        "The app offers other different options like personal finance management and personal tracking of the expenses for your homes.\n",
        "Hopefully you will have a fun experience from the savings and even learn a thing or two about your financial conduct, your family members and more.\n",
        "This page will be updated in the future and we recommend that you take a look from time to time and find out what's new about the app and how you can best use it."
    ]
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
        <Text style={[houseProfileStyles.text, { fontWeight: "200", fontSize: 20, textAlign: 'center' }]}>
            About HomEco:
            </Text>
        {
            bodyArray.map((text) => (<Text style={[houseProfileStyles.text, { fontWeight: "200", fontSize: 15, textAlign: 'center' }]}>{text}</Text>))
        }
    </ScrollView>
    );
}
    
    const styles = StyleSheet.create({ 
        videoContainer: {
            margin: 10,
            alignSelf: 'center',
            alignItems:'center',
            width: deviceWidth,
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
        },
        body:{

        }
     }); 

export default SupportScreen