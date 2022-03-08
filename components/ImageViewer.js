import React, {useState} from 'react'
import { Dimensions, View, ImageBackground } from 'react-native'
import ImageView from "react-native-image-viewing";

{/*let deviceHeight = Dimensions.get('window').height
let deviceWidth = Dimensions.get('window').width*/}

const ImageViewer = (props) => {
  const [visible, setIsVisible] = useState(true);
  const images = [
    {
      uri: props.route.params.uri,
    },
  ];
  return (
    <View>
      {console.log("source=" + props.route.params.uri)}
      {/* <ImageBackground source={{uri: props.route.params.uri}} style={{height: deviceHeight ,width:deviceWidth}}/> */}
      <ImageView
      images={images}
      imageIndex={0}
      visible={visible}
      onRequestClose={() => props.route.params.navigation.goBack()}/>
    </View>
  )
}


export default ImageViewer